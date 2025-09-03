import { requireAuthServer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditPollForm from "@/components/edit-poll-form";

interface EditPollPageProps {
  params: { pollId: string };
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const user = await requireAuthServer();
  const supabase = await createClient();

  // Fetch the poll and verify ownership
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
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
    redirect("/dashboard");
  }

  if (poll.owner_id !== user.id) {
    redirect("/dashboard");
  }

  // Sort options by position
  const sortedOptions = poll.poll_options?.sort((a, b) => a.position - b.position) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Poll</h1>
          <p className="text-muted-foreground">Update your poll question and options</p>
        </div>
        
        <EditPollForm 
          pollId={poll.id}
          initialQuestion={poll.title}
          initialOptions={sortedOptions.map(opt => opt.label)}
        />
      </div>
    </div>
  );
}
