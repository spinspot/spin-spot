"use client";

import { AuthGuard, LayoutAdmin } from "@spin-spot/components";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutAdmin>
      <AuthGuard validate={(user) => user === null} route="/dashboard">
        {children}
      </AuthGuard>
    </LayoutAdmin>
  );
}
