import { LayoutMain } from "@spin-spot/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain isAdmin={true}>
      {children}
      {/* <AuthGuard>{children}</AuthGuard> */}
    </LayoutMain>
  );
}
