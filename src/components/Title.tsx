import { EB_Garamond, Amiri } from "next/font/google";

const eb_garamond = EB_Garamond({ subsets: ["latin"] });
const amiri = Amiri({
  subsets: ["latin"],
  weight: ["400"],
});

type HeadingProps = {
  children: React.ReactNode;
};

export default function Heading({ children }: HeadingProps) {
  return <h1 className={`${amiri.className} text-5xl mt-4`}>{children}</h1>;
}
