import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yehezkiel Haganta Tarigan — Portfolio",
  description:
    "Yehezkiel Haganta Tarigan — software, AI, projects, and ways to connect.",
  themeColor: "#f6f2e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
