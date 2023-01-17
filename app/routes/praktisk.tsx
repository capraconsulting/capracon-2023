import type { MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { Title } from "~/components/title";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const meta: MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => ({
  title: parentsData["root"].conference.praktiskTitle,
  description: parentsData["root"].conference.praktiskTitle,
});

export default function Praktisk() {
  const data = useRootData();

  return (
    <ContentBox>
      <Title as="h1" withBackground size="text-6xl">
        {data.conference.praktiskTitle}
      </Title>
      <p className="text-3xl font-bold">{data.conference.praktiskSubheading}</p>

      <p className="whitespace-pre-line text-xl">
        <RichTextList richTextList={data.conference.praktiskDescription} />
      </p>

      <Title as="h2" withBackground size="text-6xl">
        {data.conference.locationTitle}
      </Title>

      <dl className="text-xl [&>dt]:font-bold">
        <dt>Lokasjon:</dt>
        <dd>{data.conference.locationName}</dd>
        <dt>Adresse:</dt>
        <dd>{data.conference.locationAddress}</dd>
        <dt>Hjemmeside:</dt>
        <dd>{data.conference.locationHomepage}</dd>
      </dl>
    </ContentBox>
  );
}
