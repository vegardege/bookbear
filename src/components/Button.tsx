import Link from "next/link";

type ContainerProps = {
	text: string;
	href: string;
	theme?: "light" | "dark";
};

export default function Button({ text, href, theme = "dark" }: ContainerProps) {
	const background = theme === "dark" ? "bg-bar" : "bg-highlight";
	const textColor = theme === "dark" ? "text-card" : "text-black";
	const hoverBackground =
		theme === "dark" ? "hover:bg-highlight" : "hover:bg-bar";
	const hoverTextColor =
		theme === "dark" ? "hover:text-foreground" : "hover:text-card";

	const space = "px-3 py-2 m-1 rounded-md shadow-md";
	const textStyle = "text-sm no-underline";

	return (
		<Link
			href={href}
			className={`
        ${background} ${textColor} ${textStyle} ${space}
        ${hoverBackground} ${hoverTextColor}
      `}
		>
			{text}
		</Link>
	);
}
