import { Amiri } from "next/font/google";

const amiri = Amiri({
	subsets: ["latin"],
	weight: ["400"],
});
type HeadingProps = {
	children: React.ReactNode;
};

export default function Heading({ children }: HeadingProps) {
	return (
		<div className="w-full flex">
			<h2 className={`${amiri.className} text-3xl my-6 mx-1`}>{children}</h2>
		</div>
	);
}
