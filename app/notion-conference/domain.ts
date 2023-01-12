import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

import {
  getDatabasePropertySelectOptions,
  getDate,
  getDateRange,
  getEmail,
  getRelation,
  getSelectAndColor,
  getText,
  getTitle,
} from "~/notion/helpers";
import type { DatabaseResponse } from "~/notion/notion";
import { groupBy, typedBoolean } from "~/utils/misc";

const selectSchema = z.object({
  title: z.string(),
  color: z.string(),
});

// Domain
const conferenceSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
});
export type Conference = z.infer<typeof conferenceSchema>;

const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  company: z.string(),
  role: z.string(),
});
type Person = z.infer<typeof personSchema>;

export type TalkWithContent = Talk & {
  content: string;
};

const talkSchema = z.object({
  id: z.string(),
  title: z.string(),
  timeslot: selectSchema,
  startDateTime: z.string(),
  endDateTime: z.string(),
  track: selectSchema,
  speakers: z.array(personSchema),
});
type Talk = z.infer<typeof talkSchema>;

export type Track = z.infer<typeof selectSchema>;
export type Timeslot = z.infer<typeof selectSchema>;

const scheduleSchema = z.array(talkSchema);
export type Schedule = z.infer<typeof scheduleSchema>;

// Mappers
export const parseConference = (fromPage: PageObjectResponse): Conference => {
  return conferenceSchema.parse({
    title: getTitle(fromPage),
    description: getText("Beskrivelse", fromPage) ?? "",
    date: getDate("Dato", fromPage) ?? "",
  });
};

export const parsePerson = (fromPage: PageObjectResponse): Person => {
  return personSchema.parse({
    id: fromPage.id,
    name: getTitle(fromPage),
    email: getEmail("E-post", fromPage) ?? "",
    company: getText("Selskap", fromPage) ?? "",
    role: getText("Stilling", fromPage) ?? "",
  });
};

export const parseTalk = (
  fromPage: PageObjectResponse,
  persons: Person[],
): Talk => {
  return talkSchema.parse({
    id: fromPage.id,
    title: getTitle(fromPage),
    speakers: getRelation("Personer", fromPage)
      .map((id) => persons.find((x) => x.id === id))
      .filter(typedBoolean),
    timeslot: getSelectAndColor("Timeslot", fromPage) ?? {
      color: "red",
      title: "unknown",
    },
    startDateTime: getDateRange("Datetime Range", fromPage)?.start ?? "",
    endDateTime: getDateRange("Datetime Range", fromPage)?.end ?? "",
    track: getSelectAndColor("Track", fromPage) ?? {
      color: "red",
      title: "unknown",
    },
  });
};

export const parseTracks = (fromDatabase: DatabaseResponse) =>
  z
    .array(selectSchema)
    .parse(getDatabasePropertySelectOptions("Track", fromDatabase));

export const parseTimeslots = (fromDatabase: DatabaseResponse) =>
  z
    .array(selectSchema)
    .parse(getDatabasePropertySelectOptions("Timeslot", fromDatabase));

export const talksByTimeslot = (talks: Talk[]) =>
  groupBy(talks, ({ timeslot }) => timeslot.title);

export const talksByTrack = (talks: Talk[]) =>
  groupBy(talks, ({ track }) => track.title);

/**
 * Sort timeslots strings
 *
 * NOTE: Unsure if the is needed, we get the sorting from notion
 * If someone have made a mistake there,
 * it should be fixed in notion as it will look wrong there as well
 *
 * 8:00
 * 14:00
 * 17:45
 * 20:30
 */
const sortTimeslot = (a: string, b: string) => {
  const _a = a.padStart(5, "0");
  const _b = b.padStart(5, "0");
  if (_a < _b) return -1;
  if (_a > _b) return 1;
  return 0;
};
export const talksByTimeslotSorted = (talks: Talk[]) =>
  Object.entries(talksByTimeslot(talks)).sort(([a], [b]) => sortTimeslot(a, b));
