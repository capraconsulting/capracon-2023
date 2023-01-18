import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link, useSearchParams } from "@remix-run/react";

import TalkListItem from "~/components/talk-list-item";
import { Title } from "~/components/title";
import { slugify } from "~/notion/helpers";
import {
  getTalksByTimeslot,
  getTalksByTrack,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import styles from "~/styles/program.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => ({
  title: parentsData["root"].conference.title,
  description: parentsData["root"].conference.description,
});

export default function Component() {
  const data = useRootData();
  const talksByTimeslot = getTalksByTimeslot(
    data.talks.concat(data.unpublishedTalks ?? []),
  );
  const search = "?" + useSearchParams()[0].toString();

  return (
    <main className="container mx-auto">
      <div className="text-2xl font-bold">
        <time dateTime={data.conference.date}>{data.date}</time>
        <p>{data.conference.locationName}</p>
      </div>

      <Title as="h1" color="text-red-400">
        {data.conference.title}
      </Title>

      <p>{data.conference.description}</p>

      <section>
        <h2 className="inline-block py-2 text-4xl font-bold ">
          Foredragsholdere
        </h2>
        <ul className="flex overflow-scroll">
          {data.speakers.map((speaker) => (
            <li key={speaker.id}>{speaker.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <div className="my-12 mx-auto pt-12 pb-8 text-black">
          <div className="block">
            <Title as="h2" withBackground size="text-6xl">
              Program
            </Title>
            <div className="schedule" aria-labelledby="schedule-heading">
              <div
                className="trackSlot"
                style={{ gridColumn: "track1", gridRow: "tracks" }}
              >
                <div>Frontend</div>
              </div>
              <div
                className="trackSlot"
                style={{ gridColumn: "track2", gridRow: "tracks" }}
              >
                <div>TPU</div>
              </div>
              <div
                className="trackSlot"
                style={{ gridColumn: "track3", gridRow: "tracks" }}
              >
                <div>CloudNative</div>
              </div>

              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-0800` }}
              >
                08:00
              </h2>
              <h2
                className={`timeColumn hidden shadow-md laptop:inline `}
                style={{ gridRow: `time-0830` }}
              >
                08:30
              </h2>
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

        <table className="mt-6 w-full">
          <thead>
            <tr>
              <th />
              {data.tracks.map((track) => (
                <th
                  key={track.id}
                  className="bg-slate-500 py-1 px-2"
                  style={{ color: track.color }}
                >
                  {track.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.timeslots.map((timeslot) => {
              const talksByTrack = getTalksByTrack(
                talksByTimeslot[timeslot.id] ?? [],
              );

              return (
                <tr key={timeslot.id}>
                  <td>{timeslot.title}</td>
                  {data.tracks.map((track) => {
                    let d = new Date(data.conference.date);
                    d.setHours(
                      timeslot.startTime.hours,
                      timeslot.startTime.minutes,
                    );
                    return (
                      <td key={track.id}>
                        {talksByTrack[track.id]?.map((talk) => {
                          const start = new Date(d);
                          const end = new Date(start);
                          end.setMinutes(
                            start.getMinutes() + talk.duration.minutes,
                          );
                          d = end;
                          return (
                            <div key={talk.id} title={talk.title}>
                              <span className="inline-block bg-black p-1 text-sm font-bold leading-3 text-white">
                                {String(start.getHours()).padStart(2, "0")}
                                {String(start.getMinutes()).padStart(2, "0")}-
                                {String(end.getHours()).padStart(2, "0")}
                                {String(end.getMinutes()).padStart(2, "0")}
                              </span>
                              <Link
                                className="hover:underline"
                                to={`/talk/${slugify(talk.title)}${search}`}
                              >
                                {talk.title}
                              </Link>
                              <p className="text-sm">
                                {new Intl.ListFormat("no-nb").format(
                                  talk.speakers.map((speaker) => speaker.name),
                                )}
                              </p>
                              <span className="border py-0.5 px-1 text-xs">
                                {talk.duration.title}
                              </span>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
