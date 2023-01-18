import React from "react";
import { Link } from "@remix-run/react";

import type { Talk } from "~/notion-conference/domain";
import { TrackGridColumn } from "~/utils/consts";

type TalkListItemProps = {
  talk: Talk;
};

const toTwoDigitString = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

const TalkListItem: React.FC<TalkListItemProps> = ({ talk }) => {
  const startTime =
    toTwoDigitString(talk.timeslot.startTime.hours) +
    toTwoDigitString(talk.timeslot.startTime.minutes);

  const endTime =
    toTwoDigitString(talk.timeslot.endTime.hours) +
    toTwoDigitString(talk.timeslot.endTime.minutes);

  const gridPosition = {
    gridRow: `time-${startTime} / time-${endTime}`,
    gridColumn: TrackGridColumn[talk.track.title],
  };

  return (
    <div className="mb-4 laptop:m-0" style={gridPosition}>
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
        {/* <div className="flex flex-wrap gap-x-6">{speakers}</div> */}
      </div>
    </div>
  );
};

export default TalkListItem;