import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webcoin Labs — Waitlist",
  description:
    "Join the Webcoin Labs waitlist. Get early access to a private network of founders, builders, investors, and advisors — built for people going from zero to 100.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
