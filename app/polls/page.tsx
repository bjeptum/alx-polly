import { createClient } from "@/lib/supabase/server";
import PollCard from "@/components/poll-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { requireAuthServer } from "@/lib/auth";

interface PollsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PollsPage({ searchParams }: PollsPageProps) {
  const supabase = await createClient();
  const user = await requireAuthServer();
  const showSuccess = searchParams.success === "true";

  // Fetch all active polls with their options and vote counts
  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      created_at,
      is_active,
      owner_id,
      profiles!polls_owner_id_fkey(full_name, email)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching polls:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading polls</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Transform the data to match the expected Poll interface
  const transformedPolls = polls?.map(poll => ({
    ...poll,
    profiles: Array.isArray(poll.profiles) ? poll.profiles[0] : poll.profiles
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Poll created successfully!</p>
            <p className="text-sm text-green-600">Your poll is now live and ready for voting.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-muted-foreground">Vote on polls created by the community</p>
        </div>
        <Link href="/polls/new">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {transformedPolls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformedPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} currentUserId={user.id} />
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>No polls yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Be the first to create a poll!
            </p>
            <Link href="/polls/new">
              <Button>Create Your First Poll</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



