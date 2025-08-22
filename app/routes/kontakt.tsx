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
    title: parentsData["root"]?.conference?.kontaktTitle,
  },
  {
    name: "description",
    content: parentsData["root"]?.conference?.kontaktDescription,
  },
];

export default function Kontakt() {
  const data = useRootData();

  return (
    <ContentBox>
      <Title as="h1" className="mt-8 text-3xl tablet:mt-24 tablet:text-5xl">
        {data?.conference?.kontaktTitle}
      </Title>
      <p className="mb-4 text-xl tablet:mb-12">
        {data?.conference?.kontaktDescription}
      </p>

      <div className="mb-32 grid grid-cols-1 gap-9 sm:grid-cols-2 laptop:grid-cols-3">
        {data?.contacts?.map((contactPerson) => (
          <div
            key={contactPerson.id}
            className="overflow-hidden rounded-lg border border-[#E5E7EB]"
          >
            {contactPerson.image && (
              <img
                alt={`Bilde av ${contactPerson.name}`}
                src={buildImageUrl({
                  type: "contact",
                  id: contactPerson.id,
                  mode: "portrait",
                })}
                className="object-cover"
              />
            )}
            {!contactPerson.image && (
              <div className="h-[350px] bg-slate-400 " />
            )}
            <div className="p-4">
              <div className="mb-4 text-xl font-bold">{contactPerson.name}</div>
              <dl className="[&_dt]:font-bold">
                <dd>{contactPerson.role}</dd>
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
