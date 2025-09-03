import { requireAuthServer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PollActions from "@/components/poll-actions";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuthServer();
  const supabase = await createClient();

  // Fetch user's polls with vote counts
  const { data: polls } = await supabase
    .from("polls")
    .select(`
      id, 
      title, 
      description,
      created_at, 
      is_active,
      poll_options (
        id,
        votes (id)
      )
    `)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch total votes across all user's polls
  const { data: totalVotes } = await supabase
    .from("votes")
    .select("id", { count: "exact" })
    .in("poll_id", polls?.map(p => p.id) || []);

  // Count active polls
  const activePolls = polls?.filter(p => p.is_active).length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <Link href="/polls/new">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Your Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{polls?.length || 0}</p>
              <p className="text-muted-foreground">Total polls created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalVotes?.length || 0}</p>
              <p className="text-muted-foreground">Across all your polls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activePolls}</p>
              <p className="text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Polls</CardTitle>
          </CardHeader>
          <CardContent>
            {polls && polls.length > 0 ? (
              <div className="space-y-4">
                {polls.map((poll) => {
                  const totalVotes = poll.poll_options?.reduce((sum, option) => sum + (option.votes?.length || 0), 0) || 0;
                  return (
                    <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{poll.title}</h3>
                          <Badge variant={poll.is_active ? "default" : "secondary"}>
                            {poll.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {poll.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                            {poll.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created {new Date(poll.created_at).toLocaleDateString()}</span>
                          <span>{totalVotes} votes</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/polls/${poll.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/polls/${poll.id}/results`}>
                          <Button variant="outline" size="sm">Results</Button>
                        </Link>
                        <PollActions 
                          pollId={poll.id} 
                          isActive={poll.is_active}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No polls yet. Create your first poll to get started!</p>
                <Link href="/polls/new">
                  <Button>Create Your First Poll</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


