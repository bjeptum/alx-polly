"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push("/");
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Signing you out...</p>
      </div>
    </div>
  );
}
