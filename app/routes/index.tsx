import type {
  HeadersFunction,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";

import { TalkListItem } from "~/components/talk-list-item";
import { Title } from "~/components/title";
import { config } from "~/config";
import type { Talk, Track } from "~/notion-conference/domain";
import {
  formattedHoursMinutes,
  formattedHoursMinutesAlt,
  getFormattedTalkTimes,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import styles from "~/styles/program.css";
import { TRACK_HEADINGS, TrackGridColumn, Tracks } from "~/utils/consts";
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
    <main className="container mx-auto pb-32">
      <Title as="h1" color="text-white">
        {data.conference.title}
      </Title>

      <div className="px-4 text-2xl font-bold text-white">
        <time dateTime={data.conference.date}>
          {data.formattedConferenceDate}
        </time>
        <p>{data.conference.locationName}</p>
      </div>

      <div>
        <div className="mt-8 h-96 w-full rounded-xl bg-black"></div>
      </div>

      <section className="pt-12">
        <Title as="h2" withBackground size="text-6xl">
          Program
        </Title>

        <div className="schedule">
          {/* Track headings */}
          {trackHeadings.map((track) => (
            <div
              key={track.id}
              className="sticky top-0 z-20 hidden laptop:block"
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
                "hidden laptop:inline",
                "rounded-lg rounded-tr-none border-t-[6px] border-t-primary bg-primary-light p-2 font-semibold shadow-md",
              )}
              style={{
                gridColumn: "times",
                gridRow: `time-${formattedHoursMinutes(timeslot.startTime)}`,
              }}
            >
              {formattedHoursMinutesAlt(timeslot.startTime)}
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
  const trackColors: Record<Tracks, `border-${string}`> = {
    [Tracks["Felles"]]: "border-black",
    [Tracks["Frontend"]]: "border-[#bbdde6]",
    [Tracks["Ledelse"]]: "border-[#651d32]",
    [Tracks["Cloud"]]: "border-[#ffd2b9]",
  } as const;
  return (
    <div className="flex w-full items-center justify-center bg-primary-light px-[5px] pt-5 pb-6">
      <span
        className={classNames(
          trackColors[track.title],
          "border-b-8 px-[6px] py-1 text-[1.2rem] font-bold uppercase",
        )}
      >
        {track.title}
      </span>
    </div>
  );
};
