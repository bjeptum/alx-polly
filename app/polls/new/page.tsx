import { requireAuthServer } from "@/lib/auth";
import PollForm from "@/components/poll-form";

export default async function NewPollPage() {
  const user = await requireAuthServer();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create a new poll</h1>
          <p className="text-muted-foreground">Create and share polls with your audience</p>
        </div>
        <PollForm />
      </section>
    </div>
  );
}


