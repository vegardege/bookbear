import Container from "@/components/Container";
import SubTitle from "@/components/SubTitle";

export default async function AboutPage() {
  return (
    <section aria-label="Author" className="w-full">
      <SubTitle>Contributions</SubTitle>
      <Container>
        <p className="p-2">Text</p>
      </Container>
    </section>
  );
}
