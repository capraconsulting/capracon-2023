import type {
  HeadersFunction,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";

import { ArrowDown } from "phosphor-react";

import { ContentBox } from "~/components/content-box";
import { TalkListItem } from "~/components/talk-list-item";
import { Title } from "~/components/title";
import { config } from "~/config";
import type { Track } from "~/notion-conference/domain";
import { getFormattedTalkTimes } from "~/notion-conference/helpers";
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

export default function Program() {
  const data = useRootData();

  const talks = data.talks.concat(data.unpublishedTalks ?? []);

  const trackHeadings = TRACK_HEADINGS.map((trackTitle) =>
    data.tracks.find((track) => track.title === trackTitle),
  ).filter(typedBoolean);

  return (
    <ContentBox>
      <Title
        as="h1"
        className="text-3xl  tablet:mb-16 tablet:mt-24 tablet:text-5xl"
      >
        Program
      </Title>

      <div className="schedule">
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
    </ContentBox>
  );
}

interface TrackHeadingProps {
  track: Track;
}
const TrackHeading = ({ track }: TrackHeadingProps) => {
  return (
    <div className="pointer-events-none flex w-full items-center justify-between rounded-lg border border-[#999] bg-[#F2F2F2] px-4 py-2  dark:border-[#27272A] dark:bg-[black] ">
      <span className={classNames("font-[600] text-[#333] dark:text-white")}>
        {track.title}
      </span>
      <ArrowDown className="text-[#666] dark:text-white" size={18} />
    </div>
  );
};
