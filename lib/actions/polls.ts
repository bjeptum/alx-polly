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


