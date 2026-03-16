import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { config } from "~/config";
import { getClient } from "~/notion/notion";
import {
  parseConference,
  parseTimeslots,
  parseTracks,
  safeParseContacts,
  safeParseMemos,
  safeParseSpeakers,
  safeParseTalks,
} from "./domain";

export const getData = async (notionToken: string) => {
  // Fetch
  const client = getClient(notionToken);
  const [
    notionConferencePages,
    notionMasterProgramDatabase,
    notionMasterProgramPages,
    notionSpeakers,
    notionContacts,
    notionMemos,
  ] = await Promise.all([
    client.getDatabasePages(config.conferenceDatabaseId),
    client.getDatabase(config.masterProgramDatabaseId),
    client.getDatabasePages(config.masterProgramDatabaseId),
    client.getDatabasePages(config.speakersDatabaseId),
    client.getDatabasePages(config.contactsDatabaseId),
    client.getDatabasePages(config.memosDatabaseId),
  ]);

  const notionConference = notionConferencePages.find(
    (page) => page.id === config.conferenceId || page.id.replace(/-/g, "") === config.conferenceId,
  );
  if (!notionConference) {
    throw new Error(`Conference page ${config.conferenceId} not found in database ${config.conferenceDatabaseId}`);
  }

  const [contacts, invalidContacts] = safeParseContacts(notionContacts as unknown as PageObjectResponse[]);

  const [speakers, invalidSpeakers] = safeParseSpeakers(notionSpeakers as unknown as PageObjectResponse[]);
  const [allTalks, invalidTalks] = safeParseTalks(
    notionMasterProgramPages as unknown as PageObjectResponse[],
    speakers,
  );
  const publishedTalks = allTalks.filter((x) => x.isPublished);
  const unpublishedTalks = allTalks.filter((x) => !x.isPublished);

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
    memos: safeParseMemos(notionMemos as unknown as PageObjectResponse[]),
  };

  return data;
};
