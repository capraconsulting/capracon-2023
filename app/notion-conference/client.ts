import { config } from "~/config";
import { getClient } from "~/notion/notion-remix-cloudflare";
import {
  parseConference,
  parseTimeslots,
  parseTracks,
  safeParsePersons,
  safeParseTalks,
} from "./domain";

export const getData = async (notionToken: string) => {
  // Fetch
  const [
    notionConference,
    notionMasterProgramDatabase,
    notionMasterProgramPages,
    notionPersons,
  ] = await Promise.all([
    getClient(notionToken).getPage(config.conferenceId),
    getClient(notionToken).getDatabase(config.masterProgramDatabaseId),
    getClient(notionToken).getDatabasePages(config.masterProgramDatabaseId),
    getClient(notionToken).getDatabasePages(config.personsDatabaseId),
  ]);

  // Parse
  const [persons, invalidPersons] = safeParsePersons(notionPersons);
  const [talks, invalidTalks] = safeParseTalks(
    notionMasterProgramPages,
    persons,
  );

  const data = {
    conference: parseConference(notionConference),
    persons,
    invalidPersons,
    talks,
    invalidTalks,
    tracks: parseTracks(notionMasterProgramDatabase),
    timeslots: parseTimeslots(notionMasterProgramDatabase),
  };

  return data;
};
