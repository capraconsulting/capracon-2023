import type { V2_MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { buildImageUrl } from "./api.image-optimized";

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
      <Title as="h1" withBackground size="text-6xl" className="mb-10">
        {data.conference.kontaktTitle}
      </Title>
      <p className="mb-12 text-3xl">{data.conference.kontaktDescription}</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.contacts.map((contactPerson) => (
          <div key={contactPerson.id} className="flex flex-row gap-2">
            {contactPerson.image && (
              <img
                alt={`Bilde av ${contactPerson.name}`}
                src={buildImageUrl({
                  type: "contact",
                  id: contactPerson.id,
                })}
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            {!contactPerson.image && (
              <div className="h-20 w-20 rounded-full bg-neutral-300" />
            )}
            <div>
              <div className="mb-4 text-xl font-bold">{contactPerson.name}</div>
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
          </div>
        ))}
      </div>
    </ContentBox>
  );
}
