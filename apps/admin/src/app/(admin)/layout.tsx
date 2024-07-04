"use client";

import { AuthGuard, LayoutMain } from "@spin-spot/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain isAdmin={true}>
      <AuthGuard validate={(user) => user?.userType === "ADMIN"} route="/login">
        {children}
      </AuthGuard>
    </LayoutMain>
  );
}
