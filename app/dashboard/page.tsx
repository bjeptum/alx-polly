import { requireAuthServer } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuthServer();

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
              <p className="text-2xl font-bold">0</p>
              <p className="text-muted-foreground">Total polls created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-muted-foreground">Across all your polls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity. Create your first poll to get started!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


