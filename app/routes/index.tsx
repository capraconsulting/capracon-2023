import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "~/config";
import { getClient } from "~/notion/notion-remix-cloudflare";
import {
  parseConference,
  parsePerson,
  parseTalk,
  parseTimeslots,
  parseTracks,
} from "~/notion-conference/domain";
import { getEnvVariableOrThrow } from "~/utils/env";

export const loader = async ({ context }: LoaderArgs) => {
  const token = getEnvVariableOrThrow("NOTION_TOKEN", context);

  // Fetch
  const [notionConference, notionTalksDatabase, notionTalks, notionPersons] =
    await Promise.all([
      getClient(token).getPage(config.conferenceId),
      getClient(token).getDatabase(config.talksDatabaseId),
      getClient(token).getDatabasePages(config.talksDatabaseId),
      getClient(token).getDatabasePages(config.personsDatabaseId),
    ]);

  const persons = notionPersons.map(parsePerson);
  const talks = notionTalks.map((x) => parseTalk(x, persons));
  return json({
    conference: parseConference(notionConference),
    persons,
    talks,
    tracks: parseTracks(notionTalksDatabase),
    timeslots: parseTimeslots(notionTalksDatabase),
  });
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-4xl text-red-400">Julian er kul</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
