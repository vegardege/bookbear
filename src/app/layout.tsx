import type { Metadata } from "next";
import "./globals.css";

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
        <h1><a href="/">Book Bear</a></h1>
        <form action="/search" method="get">
          <input type="text" name="q" placeholder="Search for an author..." />
          <button type="submit">Search</button>
        </form>
        {children}
      </body>
    </html>
  );
}
