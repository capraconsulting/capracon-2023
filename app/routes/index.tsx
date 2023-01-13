import type { LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import {
  getTalksByTimeslot,
  getTalksByTrack,
} from "~/notion-conference/domain";
import { getDataCached } from "~/utils/notion-conference-cached";

export const loader = async ({ context }: LoaderArgs) => {
  const data = await getDataCached(context);

  const formattedConferenceDate = new Intl.DateTimeFormat("no-nb", {
    dateStyle: "medium",
  }).format(new Date(data.conference.date));

  return json({ ...data, date: formattedConferenceDate });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: data.conference.title,
  description: data.conference.description,
});

export default function Component() {
  const data = useLoaderData<typeof loader>();
  const talksByTimeslot = getTalksByTimeslot(data.talks);
  return (
    <main className="container mx-auto">
      <div className="text-2xl font-bold">
        <time dateTime={data.conference.date}>{data.date}</time>
        <p>{data.conference.venue}</p>
      </div>

      <h1 className="text-7xl font-bold text-red-400">
        {data.conference.title}
      </h1>

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
        <h2 className="inline-block bg-black py-2 px-4 text-6xl font-bold text-white">
          Program
        </h2>
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
                talksByTimeslot[timeslot.id],
              );
              return (
                <tr key={timeslot.id}>
                  <td>{timeslot.title}</td>
                  {data.tracks.map((track) => (
                    <td key={track.id}>
                      {talksByTrack[track.id]?.map((talk) => (
                        <div key={talk.id} title={talk.title}>
                          <p>{talk.title}</p>
                          <p className="text-sm">
                            {new Intl.ListFormat("no-nb").format(
                              talk.speakers.map((speaker) => speaker.name),
                            )}
                          </p>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* For dev purposes */}
      <details open className="mt-12">
        <summary className="cursor-pointer font-mono font-bold">
          JSON DATA
        </summary>
        <pre className="overflow-scroll border p-2">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </details>
    </main>
  );
}
