"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPoll(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const question = String(formData.get("question") || "").trim();
  const rawOptions = formData.getAll("options[]").map((o) => String(o).trim());
  const options = rawOptions.filter((o) => o.length > 0);

  console.log("Creating poll:", { question, options, userId: user.id });

  if (question.length < 5) {
    throw new Error("Question must be at least 5 characters");
  }
  if (options.length < 2) {
    throw new Error("Provide at least two options");
  }
  if (options.length > 10) {
    throw new Error("Maximum of 10 options");
  }

  // Create the poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({ 
      owner_id: user.id, 
      title: question,
      description: null,
      is_active: true
    })
    .select()
    .single();

  if (pollError || !poll) {
    console.error("Poll creation failed:", pollError);
    throw new Error(pollError?.message ?? "Failed to create poll");
  }

  console.log("Poll created:", poll.id);

  // Create the poll options
  const optionRows = options.map((label, idx) => ({
    poll_id: poll.id,
    label,
    position: idx + 1,
  }));

  const { error: optError } = await supabase
    .from("poll_options")
    .insert(optionRows);

  if (optError) {
    console.error("Options creation failed:", optError);
    // Clean up the poll if options fail
    await supabase.from("polls").delete().eq("id", poll.id);
    throw new Error(`Failed to create options: ${optError.message}`);
  }

  console.log("Options created for poll:", poll.id);

  // Revalidate and redirect to polls page with success message
  revalidatePath("/polls");
  redirect("/polls?success=true");
}

export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const question = String(formData.get("question") || "").trim();
  const rawOptions = formData.getAll("options[]").map((o) => String(o).trim());
  const options = rawOptions.filter((o) => o.length > 0);

  if (question.length < 5) {
    throw new Error("Question must be at least 5 characters");
  }
  if (options.length < 2) {
    throw new Error("Provide at least two options");
  }
  if (options.length > 10) {
    throw new Error("Maximum of 10 options");
  }

  // Verify ownership
  const { data: poll, error: pollCheckError } = await supabase
    .from("polls")
    .select("owner_id")
    .eq("id", pollId)
    .single();

  if (pollCheckError || !poll) {
    throw new Error("Poll not found");
  }

  if (poll.owner_id !== user.id) {
    throw new Error("Unauthorized to edit this poll");
  }

  // Update the poll
  const { error: pollError } = await supabase
    .from("polls")
    .update({ 
      title: question,
      updated_at: new Date().toISOString()
    })
    .eq("id", pollId);

  if (pollError) {
    throw new Error(`Failed to update poll: ${pollError.message}`);
  }

  // Delete existing options
  const { error: deleteError } = await supabase
    .from("poll_options")
    .delete()
    .eq("poll_id", pollId);

  if (deleteError) {
    throw new Error(`Failed to delete existing options: ${deleteError.message}`);
  }

  // Create new options
  const optionRows = options.map((label, idx) => ({
    poll_id: pollId,
    label,
    position: idx + 1,
  }));

  const { error: optError } = await supabase
    .from("poll_options")
    .insert(optionRows);

  if (optError) {
    throw new Error(`Failed to create new options: ${optError.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/polls");
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify ownership
  const { data: poll, error: pollCheckError } = await supabase
    .from("polls")
    .select("owner_id")
    .eq("id", pollId)
    .single();

  if (pollCheckError || !poll) {
    throw new Error("Poll not found");
  }

  if (poll.owner_id !== user.id) {
    throw new Error("Unauthorized to delete this poll");
  }

  // Delete the poll (cascade will handle options and votes)
  const { error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", pollId);

  if (deleteError) {
    throw new Error(`Failed to delete poll: ${deleteError.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/polls");
}

export async function togglePollStatus(pollId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify ownership and get current status
  const { data: poll, error: pollCheckError } = await supabase
    .from("polls")
    .select("owner_id, is_active")
    .eq("id", pollId)
    .single();

  if (pollCheckError || !poll) {
    throw new Error("Poll not found");
  }

  if (poll.owner_id !== user.id) {
    throw new Error("Unauthorized to modify this poll");
  }

  // Toggle the status
  const { error: updateError } = await supabase
    .from("polls")
    .update({ 
      is_active: !poll.is_active,
      updated_at: new Date().toISOString()
    })
    .eq("id", pollId);

  if (updateError) {
    throw new Error(`Failed to update poll status: ${updateError.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/polls");
}


