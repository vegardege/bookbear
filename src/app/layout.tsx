import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Search from "@/components/Search";

export const metadata: Metadata = {
  title: "Book Bear",
  description: "Browse authors and their works",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <h1><Link href="/">Book Bear</Link></h1>
        <Search />
        {children}
      </body>
    </html>
  );
}
