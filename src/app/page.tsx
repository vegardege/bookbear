import Button from "@/components/Button";
import Container from "@/components/Container";
import HelpContainer from "@/components/HelpContainer";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <HelpContainer />
      <Container>
        <p>Not sure where to start? Here are some of my recommendations:</p>
        <div className="flex flex-row justify-between mx-4">
          <Button
            text="Marilynne Robinson"
            href="/author/Marilynne_Robinson"
            theme="light"
          />
          <Button
            text="Kazuo Ishiguro"
            href="/author/Kazuo_Ishiguro"
            theme="light"
          />
          <Button
            text="Cormac McCarthy"
            href="/author/Cormac_McCarthy"
            theme="light"
          />
          <Button
            text="Olga Tokarczuk"
            href="/author/Olga_Tokarczuk"
            theme="light"
          />
        </div>
        <p>
          Book Bear is powered by Wikidata. Read more about how the data is
          generated and how you can contribute to the Wikidata project by
          following the links below.
        </p>
      </Container>
    </div>
  );
}
