import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
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
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
          <header className="flex flex-row justify-center mt-8">
            <Link href="/">
              <Image
                src="/bookbear.png"
                alt="Book Bear"
                width={120}
                height={120}
                priority={true}
              />
            </Link>
          </header>
          <main className="flex flex-col gap-4 justify-center">
            <section aria-label="Search" className="w-full">
              <Search />
            </section>
            {children}
          </main>
          <footer className="flex flex-row justify-center">
            <p>Powered by Wikidata</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
