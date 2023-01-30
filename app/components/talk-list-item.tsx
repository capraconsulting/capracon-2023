import React from "react";
import { Link } from "@remix-run/react";

import { slugify } from "~/notion/helpers";
import type { Speaker, Talk } from "~/notion-conference/domain";
import { getFormattedTalkTimesAlt } from "~/notion-conference/helpers";
import { buildImageUrl } from "~/routes/api.image-optimized";
import { classNames } from "~/utils/misc";
import { RichTextList } from "./notion-rich-text";

const Speakers = ({ speakers }: { speakers: Speaker[] }) => {
  return (
    <>
      {speakers.map((speaker) => (
        <div className="flex flex-col gap-2 laptop:flex-row" key={speaker.id}>
          {speaker.image && (
            <img
              alt={`Bilde av ${speaker.name}`}
              src={buildImageUrl({ type: "speaker", id: speaker.id })}
              className="h-20 w-20 rounded-full object-cover"
            />
          )}
          {!speaker.image && (
            <div className="h-20 w-20 rounded-full bg-neutral-300" />
          )}
          <div className="flex flex-col justify-center">
            <span className="text-lg font-semibold leading-snug tablet:text-base laptop:text-xl">
              {speaker.name}
            </span>
            {speaker.role && (
              <span className="text-base tablet:text-sm laptop:text-base">
                {speaker.role}
              </span>
            )}
            {speaker.company && (
              <span className="text-base tablet:text-sm laptop:text-base">
                {speaker.company}
              </span>
            )}
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

  return (
    <Link to={`/talk/${slugify(talk.title)}`}>
      <div className="relative h-[100%] min-h-min bg-white px-2 pt-4 pb-4 shadow-md laptop:px-6 laptop:pt-6 laptop:pb-8">
        <div className="inline-block rounded border-x border-y border-black leading-3">
          <span className="inline-block bg-black p-1 text-sm font-bold leading-3 text-white">
            <div className="sr-only">
              <span>fra </span>
              <time dateTime={startTime}>{startTime}</time>
              <span> til </span>
              <time dateTime={endTime}>{endTime}</time>
            </div>
            <div aria-hidden>
              {startTime.split(":").join("")} - {endTime.split(":").join("")}
            </div>
          </span>
          <span className="inline p-1 pb-2 text-sm font-bold leading-3 tablet:hidden">
            {talk.track.title}
          </span>
        </div>

        <div className="mt-1" />

        <h3
          className={classNames(
            "break-words text-2xl font-bold tracking-tight tablet:font-black",
            talk.title && talk.title.length > 40
              ? "laptop:text-3xl"
              : "laptop:text-4xl",
          )}
        >
          {talk.title}
        </h3>

        <div className="mt-2 tablet:mt-6" />

        <p>
          <RichTextList
            richTextList={
              talk.abstractShort.length > 0 ? talk.abstractShort : talk.abstract
            }
          />
        </p>

        <div className="mt-4" />

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Speakers speakers={talk.speakers} />
        </div>
      </div>
    </Link>
  );
};
