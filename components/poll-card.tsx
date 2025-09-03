import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PollCard() {
  return (
    <Card className="h-full">
      <CardHeader><CardTitle>Sample Poll</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">This is a placeholder poll description.</p>
        <div className="flex gap-2">
          <Link href="/polls/placeholder" className="underline">View</Link>
          <Link href="/polls/placeholder/results" className="underline">Results</Link>
        </div>
      </CardContent>
    </Card>
  );
}


