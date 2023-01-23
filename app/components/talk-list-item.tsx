import React from "react";
import { Link } from "@remix-run/react";

import { slugify } from "~/notion/helpers";
import type { Speaker, Talk } from "~/notion-conference/domain";
import { getFormattedTalkTimes } from "~/notion-conference/helpers";
import { RichTextList } from "./notion-rich-text";

const Speakers = ({ speakers }: { speakers: Speaker[] }) => {
  return (
    <div>
      {speakers.map((speaker) => (
        <div className="mt-3 flex gap-2 font-bold" key={speaker.id}>
          {speaker.name}
        </div>
      ))}
    </div>
  );
};

interface TalkListItemProps {
  talk: Talk;
}
export const TalkListItem: React.FC<TalkListItemProps> = ({ talk }) => {
  const { startTime, endTime } = getFormattedTalkTimes(talk);

  return (
    <Link to={`/talk/${slugify(talk.title)}`} className="mb-4 laptop:m-0">
      <div className="relative h-[100%] min-h-min bg-white px-2 pt-4 pb-4 shadow-md laptop:px-6 laptop:pt-6 laptop:pb-8">
        <div className="mb-1 inline-block rounded border-x border-y border-black leading-3">
          <span className="inline-block bg-black p-1 text-sm font-bold leading-3 text-white">
            {startTime} - {endTime}
          </span>
          <span className="inline p-1 pb-2 text-sm font-bold leading-3 tablet:hidden">
            {talk.track.title}
          </span>
        </div>
        <h3
          className={`mb-2 break-words text-2xl font-bold tracking-tight tablet:mb-6 tablet:font-black ${
            talk.title && talk.title.length > 40
              ? "laptop:text-3xl"
              : "laptop:text-4xl"
          }`}
        >
          {talk.title}
        </h3>
        <p>
          <RichTextList richTextList={talk.abstract} />
        </p>
        <div className="flex flex-wrap gap-x-6">
          <Speakers speakers={talk.speakers} />
        </div>
      </div>
    </Link>
  );
};
