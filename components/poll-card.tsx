import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePoll } from "@/lib/actions/polls";
import { Trash2, Edit } from "lucide-react";

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
  currentUserId?: string;
}

export default function PollCard({ poll, currentUserId }: PollCardProps) {
  const creatorName = poll.profiles?.full_name || poll.profiles?.email?.split('@')[0] || 'Anonymous';
  const createdDate = new Date(poll.created_at).toLocaleDateString();
  const isOwner = currentUserId && poll.owner_id === currentUserId;

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
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={`/polls/${poll.id}`} className="underline">
              Vote
            </Link>
            <Link href={`/polls/${poll.id}/results`} className="underline">
              Results
            </Link>
          </div>
          {isOwner && (
            <div className="flex items-center gap-1">
              <Link href={`/polls/${poll.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </Link>
              <form action={async () => {
                "use server";
                await deletePoll(poll.id);
              }}>
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


