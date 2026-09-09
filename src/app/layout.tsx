import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description =
  "Nexora runs your functions as durable background jobs, cron schedules and multi-step workflows — surviving restarts, retrying on failure, and recording every run.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexora-ammarahmednot-8455s-projects.vercel.app"),
  title: {
    default: "Nexora — durable workflows for developers",
    template: "%s — Nexora",
  },
  description,
  openGraph: {
    title: "Nexora — durable workflows for developers",
    description,
    type: "website",
    siteName: "Nexora",
  },
  twitter: { card: "summary_large_image", title: "Nexora", description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
