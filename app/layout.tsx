import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedLayout } from "@/components/auth/protected-layout";
import TanstackProvider from "@/components/tanstack-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Planejamento Operacional",
  description:
    "Aplicação para gestão de planejamento operacional com controle de perfis",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <TanstackProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
          </TanstackProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
