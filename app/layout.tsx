import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bags Website Builder",
  description: "Generate launch-ready websites for Bags tokens and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
