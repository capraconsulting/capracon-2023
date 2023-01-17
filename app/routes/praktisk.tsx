import type { MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
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

      {data.conference.praktiskDescription.split("\n\n").map((x, i) => (
        <p className="mt-3 text-xl" key={i}>
          {x}
        </p>
      ))}

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
