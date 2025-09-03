import { requireAuthServer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuthServer();
  const supabase = await createClient();

  // Fetch user's polls
  const { data: polls } = await supabase
    .from("polls")
    .select("id, title, created_at, is_active")
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {polls && polls.length > 0 ? (
              <div className="space-y-3">
                {polls.slice(0, 5).map((poll) => (
                  <div key={poll.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{poll.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(poll.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        poll.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {poll.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Link href={`/polls/${poll.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity. Create your first poll to get started!</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


