import type { LinksFunction, V2_MetaFunction } from "@remix-run/cloudflare";

import TalkListItem from "~/components/talk-list-item";
import { Title } from "~/components/title";
import {
  formattedHoursMinutes,
  formattedHoursMinutesAlt,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import styles from "~/styles/program.css";
import { TrackGridColumn, Tracks } from "~/utils/consts";

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

  return (
    <main className="container mx-auto">
      <div className="px-4 text-2xl font-bold text-white">
        <time dateTime={data.conference.date}>
          {data.formattedConferenceDate}
        </time>
        <p>{data.conference.locationName}</p>
      </div>

      <Title as="h1" color="text-white">
        {data.conference.title}
      </Title>

      <p className="max-w-[500px] p-4 text-white">
        {data.conference.description}
      </p>

      <section>
        <div className="my-12 mx-auto pt-12 pb-8 text-black">
          <div className="block">
            <Title as="h2" withBackground size="text-6xl">
              Program
            </Title>
            <div className="schedule" aria-labelledby="schedule-heading">
              <div
                className="trackSlot"
                style={{
                  gridColumn: TrackGridColumn[Tracks.Frontend],
                  gridRow: "tracks",
                }}
              >
                <div>{Tracks.Frontend}</div>
              </div>
              <div
                className="trackSlot"
                style={{
                  gridColumn: TrackGridColumn[Tracks.TPU],
                  gridRow: "tracks",
                }}
              >
                <div>{Tracks.TPU}</div>
              </div>
              <div
                className="trackSlot"
                style={{
                  gridColumn: TrackGridColumn[Tracks.CloudNative],
                  gridRow: "tracks",
                }}
              >
                <div>{Tracks.CloudNative}</div>
              </div>

              {data.timeslots.map((timeslot) => (
                <h2
                  key={timeslot.id}
                  className={`timeColumn hidden shadow-md laptop:inline `}
                  style={{
                    gridRow: `time-${formattedHoursMinutes(
                      timeslot.startTime,
                    )}`,
                  }}
                >
                  {formattedHoursMinutesAlt(timeslot.startTime)}
                </h2>
              ))}

              {data.talks.concat(data.unpublishedTalks ?? []).map((talk) => (
                <TalkListItem talk={talk} key={talk.title} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
