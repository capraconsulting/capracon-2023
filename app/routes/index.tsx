import type {
  HeadersFunction,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";

import { TalkListItem } from "~/components/talk-list-item";
import { Title } from "~/components/title";
import { config } from "~/config";
import type { Track } from "~/notion-conference/domain";
import {
  formattedHoursMinutes,
  formattedHoursMinutesAlt,
  getFormattedTalkTimes,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import styles from "~/styles/program.css";
import { TRACK_HEADINGS, TrackGridColumn } from "~/utils/consts";
import { classNames, typedBoolean } from "~/utils/misc";

export const headers: HeadersFunction = () => config.cacheControlHeaders;

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"].conference.title,
  },
  { name: "description", content: parentsData["root"].conference.description },
];

export default function Component() {
  const data = useRootData();

  const talks = data.talks.concat(data.unpublishedTalks ?? []);

  const trackHeadings = TRACK_HEADINGS.map((trackTitle) =>
    data.tracks.find((track) => track.title === trackTitle),
  ).filter(typedBoolean);

  return (
    <main className="container mx-auto">
      <video
        playsInline
        autoPlay
        loop
        preload="true"
        className="mx-auto min-h-[400px] w-full bg-black object-cover [mask-image:url(/mask.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:60%] tablet:[mask-size:30%]"
        muted
      >
        <source src="/background.mov" type="video/mp4" />
      </video>

      <section className="mx-auto min-h-[90vh] p-4 sm:max-w-[1200px] sm:px-12">
        <div className="text-2xl font-bold text-black dark:text-white">
          <time dateTime={data.conference.date}>
            {data.formattedConferenceDate}
          </time>
          <p>{data.conference.locationName}</p>
        </div>

        <Title as="h2" size="text-5xl">
          Program
        </Title>

        <div className="schedule">
          {/* Track headings */}
          {trackHeadings.map((track) => (
            <div
              key={track.id}
              className="sticky top-0 z-20 hidden laptop:flex"
              style={{
                gridColumn: TrackGridColumn[track.title],
                gridRow: "tracks",
              }}
            >
              <TrackHeading track={track} />
            </div>
          ))}

          {/* Timeslot markers */}
          {data.timeslots.map((timeslot) => (
            <h2
              key={timeslot.id}
              className={classNames(
                "hidden laptop:flex",
                "inline-flex h-6 items-center justify-center whitespace-nowrap bg-transparent px-2.5 py-0.5 text-xs font-medium",
              )}
              style={{
                gridColumn: "times",
                gridRow: `time-${formattedHoursMinutes(timeslot.startTime)}`,
              }}
            >
              <span className="overflow-hidden truncate">
                {formattedHoursMinutesAlt(timeslot.startTime)}
              </span>
            </h2>
          ))}

          {/* Talks */}
          {talks.map((talk) => {
            const { startTime, endTime } = getFormattedTalkTimes(talk);
            return (
              <div
                key={talk.title}
                style={{
                  gridColumn: TrackGridColumn[talk.track.title],
                  gridRow: `time-${startTime} / time-${endTime}`,
                }}
              >
                <TalkListItem talk={talk} />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

interface TrackHeadingProps {
  track: Track;
}
const TrackHeading = ({ track }: TrackHeadingProps) => {
  return (
    <div className="pointer-events-none flex w-full items-center justify-center border border-[#999] bg-white p-2 dark:border-[#27272A] dark:bg-[black] ">
      <span className={classNames("uppercase text-black dark:text-white")}>
        {track.title}
      </span>
    </div>
  );
};
