import Link from "next/link";
import Container from "@/components/Container";
import SubTitle from "@/components/SubTitle";

export default async function ContactPage() {
	return (
		<section aria-label="Contact">
			<SubTitle>Get in Touch</SubTitle>
			<Container>
				<p>Book Bear was a weekend project I created to scratch my own itch.</p>
				<p>
					My goal was to create a quick and mobile friendly site to guide me
					during library visits. A simple overview of works per author with an
					indicator of popularity and notability.
				</p>
				<p>
					If you want to contribute, take the project further, or simply say
					hello, you are welcome to send me an{" "}
					<Link href="mailto:vegardegeland@gmail.com">e-mail</Link>.
				</p>
				<p>
					If you are curious about my other projects, they are all available on{" "}
					<Link
						target="_blank"
						rel="noopener noreferrer"
						href="https://pebblepatch.dev/"
					>
						pebblepatch.dev
					</Link>
					.
				</p>
			</Container>
		</section>
	);
}
