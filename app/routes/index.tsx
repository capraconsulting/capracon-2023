import type { MetaFunction } from "@remix-run/cloudflare";

import { Title } from "~/components/title";
import {
  getTalksByTimeslot,
  getTalksByTrack,
} from "~/notion-conference/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const meta: MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => ({
  title: parentsData["root"].conference.title,
  description: parentsData["root"].conference.description,
});

export default function Component() {
  const data = useRootData();
  const talksByTimeslot = getTalksByTimeslot(data.talks);
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
        <h2 className="inline-block py-2 text-4xl font-bold ">Personer</h2>
        <ul className="flex overflow-scroll">
          {data.persons.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <Title as="h2" withBackground size="text-6xl">
          Program
        </Title>
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
                              <p>{talk.title}</p>
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
