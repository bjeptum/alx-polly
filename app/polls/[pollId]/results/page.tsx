import ResultsChart from "@/components/results-chart";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PollResultsPage({ params, searchParams }: { params: Promise<{ pollId: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { pollId } = await params;
  const sp = (await (searchParams || Promise.resolve({}))) as Record<string, string | string[] | undefined>;
  const alreadyVoted = sp.alreadyVoted === "true";
  const supabase = await createClient();

  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      poll_options (
        id,
        label,
        votes ( id )
      )
    `)
    .eq("id", pollId)
    .single();

  if (error || !poll) {
    notFound();
  }

  // Aggregate counts per option
  const results = (poll.poll_options || []).map((opt: any) => ({
    id: opt.id,
    label: opt.label,
    count: (opt.votes || []).length,
  }));

  return (
    <section className="space-y-6">
      {alreadyVoted && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You already voted on this poll. Showing current results.
        </div>
      )}
      <h1 className="text-2xl font-semibold">Results: {poll.title}</h1>
      {/* Placeholder chart component; replace to visualize `results` */}
      <ResultsChart />
      <div className="rounded-2xl border p-6">
        <ul className="space-y-2">
          {results.map((r) => (
            <li key={r.id} className="flex items-center justify-between">
              <span>{r.label}</span>
              <span className="text-muted-foreground">{r.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}






