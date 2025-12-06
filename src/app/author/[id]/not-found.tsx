import Container from "@/components/Container";
import SubTitle from "@/components/SubTitle";

export default function NotFound() {
	return (
		<section aria-label="Not Found">
			<SubTitle>Author Not Found</SubTitle>
			<Container>
				<p>The author you're looking for does not exist in our database.</p>
			</Container>
		</section>
	);
}
