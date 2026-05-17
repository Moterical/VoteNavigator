import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoteNavigator — AI Civic Assistant",
  description: "Navigate Indian elections with confidence. AI-powered guidance on registration, voting, and civic rights.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
