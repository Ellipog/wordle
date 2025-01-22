import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wordle ∞",
  description: "by Elliot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/jpeg" href="/wordle_icon.jpeg" />
      <body className={`antialiased h-screen w-screen`}>{children}</body>
    </html>
  );
}
