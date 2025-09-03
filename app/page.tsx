import { getUserServer } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function HomePage() {
  const user = await getUserServer();

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Welcome to ALX Polly</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create polls, share via link or QR, and view results in real-time.
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              <Link href="/polls/new">
                <Button size="lg">Create New Poll</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">View Dashboard</Button>
              </Link>
            </div>
            <p className="text-muted-foreground">Welcome back, {user.email}!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Log In</Button>
              </Link>
            </div>
            <p className="text-muted-foreground">Sign up to start creating polls</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Create Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Easily create polls with multiple choice questions and custom options.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share & Vote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share polls via links or QR codes. Anyone can vote without an account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View results as they come in with beautiful charts and analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}


