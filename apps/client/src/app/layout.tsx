import {
  AuthContextProvider,
  QueryContextProvider,
} from "@spin-spot/components";
import { cn } from "@spin-spot/utils";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const bodyFont = Roboto({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Client App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={cn("font-body", bodyFont.variable)}>
        <QueryContextProvider>
          <AuthContextProvider routes={{ signIn: "/login" }}>
            {children}
          </AuthContextProvider>
        </QueryContextProvider>
      </body>
    </html>
  );
}
