import { Amiri } from "next/font/google";

const amiri = Amiri({
	subsets: ["latin"],
	weight: ["400"],
});
type HeadingProps = {
	children: React.ReactNode;
	action?: React.ReactNode;
};

export default function Heading({ children, action }: HeadingProps) {
	return (
		<div className="flex items-center mx-1 my-6">
			<h2 className={`${amiri.className} text-3xl flex-1`}>{children}</h2>
			{action && (
				<div className="w-14 self-stretch flex justify-center items-center">
					{action}
				</div>
			)}
		</div>
	);
}
