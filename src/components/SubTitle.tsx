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
  return (
    <div className="w-full flex">
      <h1 className={`${eb_garamond.className} text-3xl my-6 mx-2`}>
        {children}
      </h1>
    </div>
  );
}
