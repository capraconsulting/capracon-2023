import type { MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const meta: MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => ({
  title: parentsData["root"].conference.kontaktTitle,
  description: parentsData["root"].conference.kontaktDescription,
});

export default function Kontakt() {
  const data = useRootData();

  return (
    <ContentBox>
      <Title as="h1" withBackground size="text-6xl">
        {data.conference.kontaktTitle}
      </Title>
      <p className="mb-12 text-3xl">{data.conference.kontaktDescription}</p>
    </ContentBox>
  );
}
