import VotePanel from "@/components/vote-panel";
import QRCodeDisplay from "@/components/qrcode-display";

export default function PollViewPage({ params }: { params: { pollId: string } }) {
  const { pollId } = params;
  // TODO: fetch poll by pollId
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Poll Title (placeholder)</h1>
        <p className="text-muted-foreground">ID: {pollId}</p>
      </div>
      <VotePanel />
      <div>
        <h2 className="mb-2 text-lg font-medium">Share</h2>
        <QRCodeDisplay url={`https://example.com/polls/${pollId}`} />
      </div>
    </section>
  );
}


