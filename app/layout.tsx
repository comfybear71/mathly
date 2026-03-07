import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-nunito",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-source-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mathly - From Zero to Infinity",
  description: "Master mathematics from counting to advanced theory. Gamified learning platform with AI-powered assistance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mathly",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B35",
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
