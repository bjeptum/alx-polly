import VotePanel from "@/components/vote-panel";
import QRCodeDisplay from "@/components/qrcode-display";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PollViewPage({ params }: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await params;
  const supabase = await createClient();

  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      poll_options ( id, label, position )
    `)
    .eq("id", pollId)
    .single();

  if (error || !poll) {
    notFound();
  }

  const sortedOptions = (poll.poll_options || []).sort((a: any, b: any) => a.position - b.position);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{poll.title}</h1>
        {poll.description && (
          <p className="text-muted-foreground">{poll.description}</p>
        )}
      </div>
      <VotePanel pollId={poll.id} options={sortedOptions.map((o: any) => ({ id: o.id, label: o.label }))} />
      <div>
        <h2 className="mb-2 text-lg font-medium">Share</h2>
        <QRCodeDisplay url={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/polls/${pollId}`} />
      </div>
    </section>
  );
}



