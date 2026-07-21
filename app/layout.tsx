import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureInvest AI — Smart Investment Advisor",
  description:
    "AI-powered investment advisor with fraud detection and digital banking security for first-time investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-gray-100" style={{ background: '#050816' }}>
        {children}
      </body>
    </html>
  );
}
