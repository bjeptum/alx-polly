import ResultsChart from "@/components/results-chart";

export default function PollResultsPage({ params }: { params: { pollId: string } }) {
  // TODO: fetch results for pollId
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Results (placeholder)</h1>
      <ResultsChart />
    </section>
  );
}


