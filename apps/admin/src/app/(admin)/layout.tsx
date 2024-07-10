"use client";

import { AuthGuard, LayoutMain } from "@spin-spot/components";
import { useAuth, useSignOut, useToast } from "@spin-spot/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();
  const { showToast } = useToast();
  const signOut = useSignOut();

  useEffect(() => {
    if (!auth.isLoading && auth.user?.userType !== "ADMIN") {
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
    <LayoutMain isAdmin={true}>
      <AuthGuard validate={(user) => user?.userType === "ADMIN"} route="/login">
        {children}
      </AuthGuard>
    </LayoutMain>
  );
}
