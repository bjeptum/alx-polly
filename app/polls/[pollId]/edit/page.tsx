import { requireAuthServer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPollForm from "@/components/edit-poll-form";
import type { PollWithOptions } from "@/lib/types";

interface EditPollPageProps {
  params: {
    pollId: string;
  };
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const user = await requireAuthServer();
  const supabase = await createClient();

  // Fetch the poll with its options
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      owner_id,
      poll_options (
        id,
        label,
        position
      )
    `)
    .eq("id", params.pollId)
    .single();

  if (error || !poll) {
    notFound();
  }

  // Check if user owns this poll
  if (poll.owner_id !== user.id) {
    redirect("/dashboard");
  }

  // Sort options by position
  const typed: PollWithOptions = poll as PollWithOptions;
  const sortedOptions = typed.poll_options?.sort((a, b) => a.position - b.position) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Poll</h1>
          <p className="text-muted-foreground">Update your poll question and options</p>
        </div>

        <EditPollForm 
          pollId={typed.id}
          initialTitle={typed.title}
          initialDescription={typed.description || ""}
          initialOptions={sortedOptions.map(option => option.label)}
        />
      </div>
    </div>
  );
}
