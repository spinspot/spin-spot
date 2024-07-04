"use client";

import { AuthGuard, LayoutMain } from "@spin-spot/components";
import { useAuth, useSignOut, useToast } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();
  const { showToast } = useToast();
  const signOut = useSignOut();

  useEffect(() => {
    if (!auth.isLoading && auth.user?.userType !== "PLAYER") {
      signOut.mutate();
      showToast({
        label: "No tienes permisos para entrar",
        type: "error",
      });
      router.push("/login");
    }
  }, [auth.isLoading, auth.user]);

  if (auth.isLoading) {
    return null;
  }
  return (
    <LayoutMain>
      <AuthGuard>{children}</AuthGuard>
    </LayoutMain>
  );
}
