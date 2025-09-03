import PollCard from "@/components/poll-card";

export default function PollsPage() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* TODO: map real polls from DB */}
      <PollCard />
      <PollCard />
      <PollCard />
    </section>
  );
}


