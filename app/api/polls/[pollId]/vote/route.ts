import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await params;
  // TODO: record vote for pollId
  return NextResponse.json({ ok: true });
}


