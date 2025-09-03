import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_active: boolean;
  owner_id: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

interface PollCardProps {
  poll: Poll;
}

export default function PollCard({ poll }: PollCardProps) {
  const creatorName = poll.profiles?.full_name || poll.profiles?.email?.split('@')[0] || 'Anonymous';
  const createdDate = new Date(poll.created_at).toLocaleDateString();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {poll.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground">
          <p>Created by: {creatorName}</p>
          <p>Created: {createdDate}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/polls/${poll.id}`} className="underline">
            Vote
          </Link>
          <Link href={`/polls/${poll.id}/results`} className="underline">
            Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


