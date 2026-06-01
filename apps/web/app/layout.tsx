import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistPixelLine } from "geist/font/pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Message UI — Dynamic chat attachments",
  description:
    "Build rich chat attachments with React. Develop locally and export PNGs for iMessage, WhatsApp, and more from the same template.",
  openGraph: {
    title: "Message UI",
    description: "Build rich chat attachments with React.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelLine.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
