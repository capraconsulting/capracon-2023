import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { Link, useParams } from "@remix-run/react";

import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { Title } from "~/components/title";
import { getTextFromRichText, slugify } from "~/notion/helpers";
import type { Talk } from "~/notion-conference/domain";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { classNames } from "~/utils/misc";

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
      <Title
        as="h1"
        withBackground
        size="text-3xl"
        className={classNames(
          "p-4",
          talk.title && talk.title.length > 40
            ? "laptop:text-5xl"
            : "laptop:text-6xl",
        )}
      >
        {talk.title}
      </Title>

      <div>
        {talk.speakers.map((speaker) => (
          <Link
            key={speaker.id}
            to={`/speakers#${slugify(speaker.name)}`}
            className="hover:underline"
          >
            <p className="text-2xl font-bold">{speaker.name}</p>
          </Link>
        ))}
      </div>

      <p className="whitespace-pre-line text-xl">
        <RichTextList richTextList={talk.abstract} />
      </p>

      <Link to="/" className="underline">
        Tilbake til program
      </Link>
    </ContentBox>
  );
}
