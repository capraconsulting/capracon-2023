import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";

export default function Kontakt() {
  return (
    <ContentBox>
      <Title as="h1" withBackground size="text-6xl">
        Kontakt
      </Title>
      <p className="mb-12 text-3xl">
        Har du spørsmål? Ta kontakt med en av oss!
      </p>
    </ContentBox>
  );
}
