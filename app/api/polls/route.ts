import { NextResponse } from "next/server";

export async function POST() {
  // TODO: validate body, create poll in Supabase
  return NextResponse.json({ ok: true, id: "placeholder-id" });
}






