import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { Link, useParams } from "@remix-run/react";

import { ArrowLeft } from "phosphor-react";

import { CompanyLogo } from "~/components/company-logos";
import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { Title } from "~/components/title";
import { getTextFromRichText, slugify } from "~/notion/helpers";
import type { Talk } from "~/notion-conference/domain";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { buildImageUrl } from "./api.image-optimized";

const getTalkFromSlugOrThrow = (slug: string | undefined, talks: Talk[]) => {
  const talk = talks.find((talk) => slugify(talk.title) === slug);
  if (!talk) throw new Error(`could not find talk ${slug}`);
  return talk;
};

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
  params,
}) => {
  const talk = getTalkFromSlugOrThrow(
    params.slug,
    parentsData["root"].talks.concat(
      parentsData["root"].unpublishedTalks ?? [],
    ),
  );

  return [
    {
      title: talk.title,
    },
    { name: "description", content: getTextFromRichText(talk.abstract) },
  ];
};

export default function Component() {
  const data = useRootData();
  const params = useParams();
  const talk = getTalkFromSlugOrThrow(
    params.slug,
    data.talks.concat(data.unpublishedTalks ?? []),
  );

  return (
    <ContentBox>
      <Link
        to="/program"
        className="mb-4 mt-8 flex items-center font-bold hover:underline tablet:mb-16 tablet:mt-24"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Tilbake til program
      </Link>

      <Title as="h1" className="mb-4 text-3xl tablet:text-5xl">
        {talk.title}
      </Title>

      <div className="flex flex-col gap-6 tablet:flex-row tablet:gap-10">
        {talk.speakers.map((speaker) => (
          <Link
            key={speaker.id}
            to={`/speakers#${slugify(speaker.name)}`}
            className="flex flex-row gap-2 hover:underline laptop:flex-row"
          >
            {speaker.image && (
              <img
                alt={`Bilde av ${speaker.name}`}
                src={buildImageUrl({
                  type: "speaker",
                  id: speaker.id,
                  mode: "face",
                })}
                className="h-28 w-28 rounded-full object-cover"
              />
            )}
            {!speaker.image && (
              <div className="h-28 w-28 rounded-full bg-neutral-300" />
            )}
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold leading-snug">
                {speaker.name}
              </p>
              {speaker.role && (
                <span className="text-base">{speaker.role}</span>
              )}
              {speaker.company && <CompanyLogo company={speaker.company} />}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6" />

      <p className="whitespace-pre-line text-xl">
        <RichTextList richTextList={talk.abstract} />
      </p>

      <div className="mt-6" />
    </ContentBox>
  );
}
