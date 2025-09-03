import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function getUserServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireAuthServer() {
  const user = await getUserServer();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function requireAuthClient() {
  // This will be handled by the AuthGuard component
  return null;
}


