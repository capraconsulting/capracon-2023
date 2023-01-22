import type { LinksFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import { useSearchParams } from "@remix-run/react";

import TalkListItem from "~/components/talk-list-item";
import { Title } from "~/components/title";
import { getTalksByTimeslot } from "~/notion-conference/helpers";
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
  const talksByTimeslot = getTalksByTimeslot(
    data.talks.concat(data.unpublishedTalks ?? []),
  );
  const search = "?" + useSearchParams()[0].toString();

  return (
    <main className="container mx-auto">
      <div className="px-4 text-2xl font-bold text-white">
        <time dateTime={data.conference.date}>{data.date}</time>
        <p>{data.conference.locationName}</p>
      </div>

      <Title as="h1" color="text-white">
        {data.conference.title}
      </Title>

      <p className="max-w-[500px] p-4 text-white">
        {data.conference.description}
      </p>

      {/* <section>
        <h2 className="inline-block py-2 text-4xl font-bold ">
          Foredragsholdere
        </h2>
        <ul className="flex overflow-scroll">
          {data.speakers.map((speaker) => (
            <li key={speaker.id}>{speaker.name}</li>
          ))}
        </ul>
      </section> */}

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

              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-0900` }}
              >
                09:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-0930` }}
              >
                09:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1000` }}
              >
                10:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1030` }}
              >
                10:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1100` }}
              >
                11:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1130` }}
              >
                11:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1200` }}
              >
                12:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1230` }}
              >
                12:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1300` }}
              >
                13:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1330` }}
              >
                13:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1400` }}
              >
                14:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1430` }}
              >
                14:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1500` }}
              >
                15:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1530` }}
              >
                15:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1600` }}
              >
                16:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1630` }}
              >
                16:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1700` }}
              >
                17:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1730` }}
              >
                17:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1800` }}
              >
                18:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1830` }}
              >
                18:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1900` }}
              >
                19:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-1930` }}
              >
                19:30
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-2000` }}
              >
                20:00
              </h2>

              {data.talks.map((talk) => (
                <TalkListItem talk={talk} key={talk.title} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
