import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
// Self-hosted via @fontsource/inter rather than next/font/google: avoids a
// build-time fetch to fonts.googleapis.com, which some CI/sandboxed/offline
// environments block outright. Weights match what the UI actually uses
// (400 body, 500/600 emphasis, 700 headings).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CivicPulse India — India's Political Information Archive",
    template: "%s | CivicPulse India",
  },
  description:
    "An objective, source-verified knowledge graph of Indian politicians, parties, constituencies, elections, and government composition.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
