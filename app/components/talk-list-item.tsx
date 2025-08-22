import React from "react";
import { Link } from "@remix-run/react";

import { Check, Plus } from "phosphor-react";
import { useHydrated } from "remix-utils";

import { useFavorites } from "~/hooks/useFavorites";
import { slugify } from "~/notion/helpers";
import type { Speaker, Talk } from "~/notion-conference/domain";
import { getFormattedTalkTimesAlt } from "~/notion-conference/helpers";
import { buildImageUrl } from "~/routes/api.image-optimized";
import { classNames } from "~/utils/misc";
import { CompanyLogo } from "./company-logos";
import { RichTextList } from "./notion-rich-text";

const Speakers = ({ speakers }: { speakers: Speaker[] }) => {
  return (
    <>
      {speakers?.map((speaker) => (
        <div className="flex flex-col gap-3 laptop:flex-row" key={speaker.id}>
          {speaker.image && (
            <img
              alt={`Bilde av ${speaker.name}`}
              src={buildImageUrl({
                type: "speaker",
                id: speaker.id,
                mode: "face",
              })}
              className="h-[3.75rem] w-[3.75rem] rounded-full object-cover"
            />
          )}
          {!speaker.image && (
            <div className="h-20 w-20 rounded-full bg-neutral-300" />
          )}
          <div className="flex flex-col justify-center">
            <span className="mb-0.5 text-lg font-semibold leading-snug tablet:text-base">
              {speaker.name}
            </span>
            {speaker.role && (
              <span className="text-base tablet:text-sm laptop:text-base">
                {speaker.role}
              </span>
            )}
            {speaker.company && <CompanyLogo company={speaker.company} />}
          </div>
        </div>
      ))}
    </>
  );
};

interface TalkListItemProps {
  talk: Talk;
}

export const TalkListItem: React.FC<TalkListItemProps> = ({ talk }) => {
  const { startTime, endTime } = getFormattedTalkTimesAlt(talk);
  const isHydrated = useHydrated();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = isHydrated && favorites.includes(talk.id);

  return (
    <Link to={`/talk/${slugify(talk?.title)}`}>
      <div className="relative rounded-md border border-gray-200 bg-white px-3 py-4 hover:border-gray-800 hover:transition-[3s] laptop:px-6 laptop:pb-8 laptop:pt-6 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700">
        <div className="flex w-full justify-between">
          <div className="mr-2 flex flex-wrap gap-2">
            <div className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-transparent px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
              <div className="sr-only">
                <span>fra </span>
                <time dateTime={startTime}>{startTime}</time>
                <span> til </span>
                <time dateTime={endTime}>{endTime}</time>
              </div>
              <div aria-hidden>
                {startTime.split(":").join(".")} -{" "}
                {endTime.split(":").join(".")}
              </div>
            </div>

            {talk.room?.title && (
              <div className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-transparent px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                <div>{talk.room?.title}</div>
              </div>
            )}
            <div className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-transparent px-2.5 py-0.5 text-xs font-medium tablet:hidden dark:bg-zinc-800">
              {talk.track?.title}
            </div>
          </div>

          <button
            onClick={(event) => {
              toggleFavorite(event, talk.id);
            }}
            aria-label={
              isFavorite ? "Fjern som favoritt" : "Legg til som favoritt"
            }
            className={`inline-flex h-6 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 px-2.5 py-0.5 text-xs font-medium ${
              isFavorite
                ? "bg-[#FFEB4C] dark:border-transparent dark:text-black"
                : "bg-transparent"
            }`}
          >
            {isFavorite ? (
              <Check className="mr-1" size={12} />
            ) : (
              <Plus className="mr-1" size={12} />
            )}
            <span>Følg</span>
          </button>
        </div>

        <div className="mt-3" />

        <h3
          className={classNames(
            "tablet:font-primary break-words text-2xl font-bold tracking-tight",
            talk?.title && talk?.title.length > 40
              ? "laptop:text-3xl"
              : "laptop:text-4xl",
          )}
        >
          {talk?.title}
        </h3>

        <div className="mt-2 tablet:mt-3" />

        <p>
          <RichTextList richTextList={talk.abstractShort} />
        </p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          <Speakers speakers={talk?.speakers} />
        </div>
      </div>
    </Link>
  );
};
