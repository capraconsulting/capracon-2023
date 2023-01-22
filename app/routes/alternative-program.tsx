import type { V2_MetaFunction } from "@remix-run/cloudflare";

import TalkListItem from "~/components/talk-list-item";
import { Title } from "~/components/title";
import type { Talk, Timeslot, Track } from "~/notion-conference/domain";
import {
  formattedHoursMinutesAlt,
  getTalksByTimeslot,
  getTalksByTrack,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { Tracks } from "~/utils/consts";
import { typedBoolean } from "~/utils/misc";

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"].conference.title,
  },
  { name: "description", content: parentsData["root"].conference.description },
];

const SHARED_TRACK = Tracks.Felles;
const ORDERED_TRACKS = [Tracks.Frontend, Tracks.TPU, Tracks.CloudNative];

export default function Component() {
  const data = useRootData();

  const orderedTracks = ORDERED_TRACKS.map((trackTitle) =>
    data.tracks.find((track) => track.title === trackTitle),
  ).filter(typedBoolean);

  const talksByTimeslot = getTalksByTimeslot(
    data.talks.concat(data.unpublishedTalks ?? []),
  );

  return (
    <main className="container mx-auto">
      <div className="px-4 text-2xl font-bold text-white">
        <time dateTime={data.conference.date}>{data.date}</time>
        <p>{data.conference.locationName}</p>
      </div>

      <Title as="h1" color="text-white">
        {data.conference.title}
      </Title>

      <p className="max-w-[500px] p-4 text-2xl text-white">
        {data.conference.description}
      </p>

      <section>
        <div className="my-12 mx-auto pt-12 pb-8 text-black">
          <div className="block">
            <Title as="h2" withBackground size="text-6xl">
              Program
            </Title>

            {/* Track headers */}
            <div className="hidden flex-row gap-[1em] laptop:flex">
              {/* A hacky way to match the timeslot spacing */}
              <div className="shrink-0 grow-0 basis-[4em]" />

              <div className="sticky top-0 z-20 mb-[1em] flex w-full flex-row gap-[1em]">
                {orderedTracks.map((track) => (
                  <TrackHeading key={track.id} track={track} />
                ))}
              </div>
            </div>

            {/* Timeslots */}
            <div className="flex flex-col gap-[1em]">
              {data.timeslots.map((timeslot) => (
                <div key={timeslot.id} className="flex flex-row gap-[1em]">
                  <div className="hidden shrink-0 grow-0 basis-[4em] laptop:block ">
                    <TimeslotView timeslot={timeslot} />
                  </div>

                  <TalksByTrack
                    talks={talksByTimeslot[timeslot.id] ?? []}
                    tracks={orderedTracks}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface TimeslotViewProps {
  timeslot: Timeslot;
}
const TimeslotView = ({ timeslot }: TimeslotViewProps) => {
  return (
    <div className="self-start border-t-[6px] border-t-black bg-white p-2 font-semibold">
      {formattedHoursMinutesAlt(timeslot.startTime)}
    </div>
  );
};

interface TrackHeadingProps {
  track: Track;
}
const TrackHeading = ({ track }: TrackHeadingProps) => {
  return (
    <div className="flex w-full items-center justify-center bg-white px-[5px] pt-5 pb-6">
      <span className="border-b-8 border-black px-[6px] py-1 text-xl font-bold uppercase">
        {track.title}
      </span>
    </div>
  );
};

interface TalksByTrackProps {
  talks: Talk[];
  tracks: Track[];
}
const TalksByTrack = ({ talks, tracks }: TalksByTrackProps) => {
  const talksByTrack = getTalksByTrack(talks);
  const orderedTracks = ORDERED_TRACKS.map((trackTitle) =>
    tracks.find((track) => track.title === trackTitle),
  ).filter(typedBoolean);

  // Temp hack, overwrite and set some styling inside the TalkListItem.
  // Should be done inside the component instead
  const talkListItemOverwrites = "[&_a]:h-[100%] [&_*]:mb-0";

  // Special Case: Shared Track
  // Examples: Keynote, Pauses, Snacks, Panels, Endnote
  // These applies to all, and we want to stretch it out for the whole timeslot
  const sharedTalks = talks.filter((talk) => talk.track.title === SHARED_TRACK);
  if (sharedTalks?.length) {
    return (
      <div className={`w-full ${talkListItemOverwrites}`}>
        {sharedTalks.map((talk) => (
          <TalkListItem key={talk.id} talk={talk} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col justify-between gap-[1em] laptop:flex-row ${talkListItemOverwrites}`}
    >
      {orderedTracks.map((track) => (
        <div
          key={track.id}
          className="contents w-full flex-col gap-[1em] laptop:flex"
        >
          {(talksByTrack[track.id] ?? []).map((talk) => (
            <TalkListItem key={talk.id} talk={talk} />
          ))}
        </div>
      ))}
    </div>
  );
};
