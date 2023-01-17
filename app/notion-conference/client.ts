import { config } from "~/config";
import { getClient } from "~/notion/notion-remix-cloudflare";
import {
  parseConference,
  parseTimeslots,
  parseTracks,
  safeParseContacts,
  safeParseSpeakers,
  safeParseTalks,
} from "./domain";

export const getData = async (notionToken: string) => {
  // Fetch
  const [
    notionConference,
    notionMasterProgramDatabase,
    notionMasterProgramPages,
    notionSpeakers,
    notionContacts,
  ] = await Promise.all([
    getClient(notionToken).getPage(config.conferenceId),
    getClient(notionToken).getDatabase(config.masterProgramDatabaseId),
    getClient(notionToken).getDatabasePages(config.masterProgramDatabaseId),
    getClient(notionToken).getDatabasePages(config.speakersDatabaseId),
    getClient(notionToken).getDatabasePages(config.contactsDatabaseId),
  ]);

  // Parse
  const [contacts, invalidContacts] = safeParseContacts(notionContacts);
  const [speakers, invalidSpeakers] = safeParseSpeakers(notionSpeakers);
  const [talks, invalidTalks] = safeParseTalks(
    notionMasterProgramPages,
    speakers,
  );
  const publishedTalks = talks.filter((x) => x.isPublished);
  const unpublishedTalks = talks.filter((x) => x.isPublished);

  const data = {
    conference: parseConference(notionConference),
    contacts,
    invalidContacts,
    speakers,
    invalidSpeakers,
    talks: publishedTalks,
    unpublishedTalks,
    invalidTalks,
    tracks: parseTracks(notionMasterProgramDatabase),
    timeslots: parseTimeslots(notionMasterProgramDatabase),
  };

  return data;
};
