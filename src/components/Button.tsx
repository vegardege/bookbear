import Link from "next/link";

export default function Button({ text, href }: { text: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-bar text-white px-3 py-2 m-1 rounded-md shadow-md hover:bg-highlight hover:text-foreground"
    >
      {text}
    </Link>
  );
}
