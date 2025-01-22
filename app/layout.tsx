import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordle",
  description: "By Elliot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased h-screen w-screen`}>{children}</body>
    </html>
  );
}
