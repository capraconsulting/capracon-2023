import type { V2_MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"].conference.kontaktTitle,
  },
  {
    name: "description",
    content: parentsData["root"].conference.kontaktDescription,
  },
];

export default function Kontakt() {
  const data = useRootData();

  return (
    <ContentBox>
      <Title as="h1" withBackground size="text-6xl">
        {data.conference.kontaktTitle}
      </Title>
      <p className="mb-12 text-3xl">{data.conference.kontaktDescription}</p>

      {data.contacts.map((contactPerson) => (
        <div key={contactPerson.id} className="">
          <div className="text-xl font-bold">{contactPerson.name}</div>
          <dl className="[&_dt]:font-bold">
            <dt>Stilling</dt>
            <dd>{contactPerson.role}</dd>
            <dt>E-post</dt>
            <dd>
              <a href={`mailto:${contactPerson.email}`}>
                {contactPerson.email}
              </a>
            </dd>
          </dl>
        </div>
      ))}
    </ContentBox>
  );
}
