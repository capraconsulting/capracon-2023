import type { V2_MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { Title } from "~/components/title";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  { title: parentsData["root"].conference.praktiskTitle },
  {
    name: "description",
    content: parentsData["root"].conference.praktiskTitle,
  },
];

export default function Praktisk() {
  const data = useRootData();

  return (
    <ContentBox>
      <Title as="h1" size="text-6xl" className="mb-10">
        {data.conference.praktiskTitle}
      </Title>

      <p className="mb-4 text-3xl font-bold">
        {data.conference.praktiskSubheading}
      </p>

      <p className="mb-12 whitespace-pre-line text-xl">
        <RichTextList richTextList={data.conference.praktiskDescription} />
      </p>

      <Title as="h2" size="text-6xl" className="mb-10">
        {data.conference.locationTitle}
      </Title>

      <dl className="mb-12 text-xl [&_dt]:font-bold [&_dt]:after:content-[':_']">
        <div className="mb-5">
          <dt>Lokasjon</dt>
          <dd>{data.conference.locationName}</dd>
        </div>
        <div className="mb-5">
          <dt>Adresse</dt>
          <dd>{data.conference.locationAddress}</dd>
        </div>
        <div className="mb-5">
          <dt>Hjemmeside</dt>
          <dd>
            <a className="underline" href={data.conference.locationHomepage}>
              {new URL(data.conference.locationHomepage).hostname}
            </a>
          </dd>
        </div>
      </dl>
    </ContentBox>
  );
}
