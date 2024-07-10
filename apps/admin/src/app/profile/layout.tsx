"use client";

import { AuthGuard, LayoutAdmin } from "@spin-spot/components";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutAdmin>
      <AuthGuard>{children}</AuthGuard>
    </LayoutAdmin>
  );
}
