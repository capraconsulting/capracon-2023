import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { Link, useParams } from "@remix-run/react";

import FeatherIcon from "feather-icons-react";

import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { Title } from "~/components/title";
import { getTextFromRichText, slugify } from "~/notion/helpers";
import type { Talk } from "~/notion-conference/domain";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { classNames } from "~/utils/misc";
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
      <div className="p-3 tablet:p-0">
        <Link
          to="/"
          className="mb-9 flex items-center font-bold hover:underline"
        >
          <FeatherIcon icon="arrow-left" className="mr-2 h-5 w-5" />
          Tilbake til program
        </Link>
        <Title
          as="h1"
          size="text-3xl"
          className={classNames(
            talk.title && talk.title.length > 40
              ? "laptop:text-5xl"
              : "laptop:text-6xl",
          )}
        >
          {talk.title}
        </Title>

        <div className="mt-4" />

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
                  className="h-28 w-28 rounded-full border border-black object-cover grayscale"
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
                  <span className="text-base tablet:text-sm laptop:text-base">
                    {speaker.role}
                  </span>
                )}
                <span className="flex dark:hidden">
                  {speaker.company && (
                    <span className="text-base tablet:text-sm laptop:text-base">
                      {speaker.company.trim() === "Capra" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/capra.webp"
                        />
                      ) : speaker.company.trim() === "Liflig" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/liflig.webp"
                        />
                      ) : speaker.company.trim() === "Fryde" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/fryde.webp"
                        />
                      ) : (
                        speaker.company
                      )}
                    </span>
                  )}
                </span>
                <span className="hidden dark:flex">
                  {speaker.company && (
                    <span className="text-base tablet:text-sm laptop:text-base">
                      {speaker.company.trim() === "Capra" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/capra-dark.webp"
                        />
                      ) : speaker.company.trim() === "Liflig" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/liflig-dark.webp"
                        />
                      ) : speaker.company.trim() === "Fryde" ? (
                        <img
                          width={65}
                          alt={speaker.company}
                          src="/fryde-dark.webp"
                        />
                      ) : (
                        speaker.company
                      )}
                    </span>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6" />

        <p className="whitespace-pre-line text-xl">
          <RichTextList richTextList={talk.abstract} />
        </p>

        <div className="mt-6" />
      </div>
    </ContentBox>
  );
}
