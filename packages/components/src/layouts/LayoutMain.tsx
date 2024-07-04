import { Footer } from "../footers";
import { Header } from "../headers";

interface LayoutMainProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function LayoutMain({ children, isAdmin = false }: LayoutMainProps) {
  return (
    <div className={`flex min-h-screen flex-col`}>
      <Header isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
