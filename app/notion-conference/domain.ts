import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

import {
  getDatabasePropertySelectOptions,
  getDate,
  getEmail,
  getRelation,
  getSelect,
  getSelectAndColor,
  getText,
  getTitle,
} from "~/notion/helpers";
import type { DatabaseResponse } from "~/notion/notion";
import { typedBoolean } from "~/utils/misc";

const selectSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string(),
});

// Domain
const conferenceSchema = z.object({
  title: z.string(),
  date: z.string(),
  locationName: z.string(),
  description: z.string(),
});
export type Conference = z.infer<typeof conferenceSchema>;

const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  bio: z.string().optional(),

  // TODO: Not currently in notion database, but maybe they should be??
  // company: z.string(),
  // role: z.string(),
});
export type Person = z.infer<typeof personSchema>;

const timeslotSchema = selectSchema
  .extend({
    title: z
      .string()
      .regex(
        /^\d{2}:\d{2}-\d{2}:\d{2}$/,
        "must be a timerange, e.g. 10:45-11:15",
      ),
  })
  .transform((val) => {
    const [start, end] = val.title.split("-");
    const parse = (s: string) => {
      const [hours, minutes] = s.split(":").map(Number);
      return { hours, minutes };
    };
    return { ...val, startTime: parse(start), endTime: parse(end) };
  });

const durartionSchema = selectSchema
  .extend({
    title: z.string().regex(/^\d+$/, "must be a valid number"),
  })
  .transform((val) => {
    return { ...val, minutes: Number(val.title) };
  });

export type Timeslot = z.infer<typeof timeslotSchema>;

const talkSchema = z.object({
  id: z.string(),
  title: z.string(),
  abstract: z.string(),
  track: selectSchema,
  speakers: z.array(personSchema),
  timeslot: timeslotSchema,
  duration: durartionSchema,
  isPublished: z.boolean(),
});
export type Talk = z.infer<typeof talkSchema>;

export type Track = Talk["track"];

// Mappers
// The `!` operator is used here, usually that it bad idea, but here it's fine
// zod will catch those type errors runtime
// and we can then handle them properly
//
// We Typescript `satisfies` to make sure we remember to fill the exactly expected fields
export const parseConference = (fromPage: PageObjectResponse) => {
  return conferenceSchema.parse({
    title: getTitle(fromPage)!,
    description: getText("description", fromPage)!,
    date: getDate("date", fromPage)!,
    locationName: getText("location.name", fromPage)!,
  } satisfies Conference);
};

const mapPerson = (fromPage: PageObjectResponse) => {
  return {
    id: fromPage.id,
    name: getTitle(fromPage)!,
    email: getEmail("Epost", fromPage)!,
    bio: getText("Bio", fromPage),
  } satisfies Person;
};

interface FailedParsed<T> {
  unparsed: Partial<T>;
  errors: z.ZodIssue[];
}

export const safeParsePersons = (fromPages: PageObjectResponse[]) => {
  const success: Person[] = [];
  const failed: FailedParsed<Person>[] = [];

  fromPages
    .map(mapPerson)
    .map((unparsed) => ({
      unparsed,
      parsed: personSchema.safeParse(unparsed),
    }))
    .forEach(({ unparsed, parsed }) => {
      if (parsed.success) {
        success.push(parsed.data);
      } else {
        failed.push({
          unparsed,
          errors: parsed.error.errors,
        });
      }
    });

  return [success, failed] as const;
};

const mapTalk = (fromPage: PageObjectResponse, persons: Person[]) => {
  return {
    id: fromPage.id,
    title: getTitle(fromPage)!,
    speakers: getRelation("Foredragsholder", fromPage)
      ?.map((id) => persons.find((x) => x.id === id))
      .filter(typedBoolean)!,
    timeslot: getSelectAndColor("Tidspunkt", fromPage) as any,
    track: getSelectAndColor("Track", fromPage)!,
    abstract: getText("Abstract", fromPage)!,
    duration: getSelectAndColor("Lengde", fromPage) as any,
    isPublished:
      getSelect("Status", fromPage) ===
      "8. Tildelt slot i program (tid og rom)",
  } satisfies Talk;
};

export const safeParseTalks = (
  fromPages: PageObjectResponse[],
  persons: Person[],
) => {
  const success: Talk[] = [];
  const failed: FailedParsed<Talk>[] = [];

  fromPages
    .map((page) => mapTalk(page, persons))
    .map((unparsed) => ({
      unparsed,
      parsed: talkSchema.safeParse(unparsed),
    }))
    .forEach(({ unparsed, parsed }) => {
      if (parsed.success) {
        success.push(parsed.data);
      } else {
        failed.push({
          unparsed,
          errors: parsed.error.errors,
        });
      }
    });

  return [success, failed] as const;
};

export const parseTracks = (fromDatabase: DatabaseResponse) =>
  z
    .array(selectSchema)
    .parse(getDatabasePropertySelectOptions("Track", fromDatabase));

export const parseTimeslots = (fromDatabase: DatabaseResponse) =>
  z
    .array(timeslotSchema)
    .parse(getDatabasePropertySelectOptions("Tidspunkt", fromDatabase));
