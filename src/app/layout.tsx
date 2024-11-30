import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Search from "@/components/Search";
import logo from "../../public/bookbear.png";
import { Source_Sans_3 } from "next/font/google";

const ss3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400"],
});

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
      <body className={`${ss3.className} bg-background text-foreground`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
          <header className="flex flex-row justify-center mt-8">
            <Link href="/">
              <Image
                src={logo}
                alt="Book Bear"
                width={120}
                height={120}
                priority
              />
            </Link>
          </header>
          <main className="flex flex-col gap-6 justify-center">
            <section aria-label="Search" className="w-full">
              <Search />
            </section>
            {children}
          </main>
          <footer className="flex flex-row justify-center mb-8">
            <p className="font-bold text-sm">
              <Button text="How it works" href="/about" />
              <Button text="Found an error?" href="/contribute" />
              <Button
                text="Get in touch"
                href="mailto:vegardegeland@gmail.com"
              />
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
