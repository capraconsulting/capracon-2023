import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

import type { RichTextItem } from "~/notion/helpers";
import { getTrackSelectAndColor } from "~/notion/helpers";
import {
  getDatabasePropertySelectOptions,
  getDate,
  getEmail,
  getRelation,
  getRichText,
  getSelect,
  getSelectAndColor,
  getText,
  getTitle,
  getUrl,
} from "~/notion/helpers";
import type { DatabaseResponse } from "~/notion/notion";
import { TRACKS } from "~/utils/consts";
import { typedBoolean } from "~/utils/misc";

const selectSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string(),
});

const trackSchema = selectSchema.merge(z.object({ title: z.enum(TRACKS) }));

const richTextSchema = z.array(
  z.custom<RichTextItem>(
    (val) => val && typeof val === "object" && "type" in val !== undefined,
  ),
);

// Domain
const conferenceSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),

  locationTitle: z.string(),
  locationName: z.string(),
  locationAddress: z.string(),
  locationHomepage: z.string().url(),

  praktiskTitle: z.string(),
  praktiskSubheading: z.string(),
  praktiskDescription: richTextSchema,

  kontaktTitle: z.string(),
  kontaktDescription: z.string(),
});
export type Conference = z.infer<typeof conferenceSchema>;

const speakerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  bio: z.string().optional(),

  // TODO: Not currently in notion database, but maybe they should be??
  // company: z.string(),
  // role: z.string(),
});
export type Speaker = z.infer<typeof speakerSchema>;

const contactPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
});
export type ContactPerson = z.infer<typeof contactPersonSchema>;

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
      return new Date(`2023-03-24T${hours}:${minutes}`);
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
  abstract: richTextSchema,
  track: trackSchema,
  speakers: z.array(speakerSchema),
  timeslot: timeslotSchema,
  duration: durartionSchema,
  isPublished: z.boolean(),
  startTime: z.string(),
});
export type Talk = z.infer<typeof talkSchema>;

export type Track = Talk["track"];

// Like the built-in Partial, but requires all keys
type Relaxed<T extends object> = {
  [K in keyof T]: T[K] | undefined;
};

// Mapper and parsers
export const parseConference = (fromPage: PageObjectResponse) => {
  return conferenceSchema.parse({
    title: getTitle(fromPage),
    description: getText("description", fromPage),
    date: getDate("date", fromPage),

    locationTitle: getText("locationTitle", fromPage),
    locationName: getText("locationName", fromPage),
    locationAddress: getText("locationAddress", fromPage),
    locationHomepage: getUrl("locationHomepage", fromPage),

    praktiskTitle: getText("praktiskTitle", fromPage),
    praktiskSubheading: getText("praktiskSubheading", fromPage),
    praktiskDescription: getRichText("praktiskDescription", fromPage),

    kontaktTitle: getText("kontaktTitle", fromPage),
    kontaktDescription: getText("kontaktDescription", fromPage),
  } satisfies Relaxed<Conference>);
};

interface FailedParsed<T> {
  unparsed: Partial<T>;
  errors: z.ZodIssue[];
}

const mapContactPerson = (fromPage: PageObjectResponse) => {
  return {
    id: fromPage.id,
    name: getTitle(fromPage),
    email: getEmail("Epost", fromPage),
    role: getText("Stilling", fromPage),
  } satisfies Relaxed<ContactPerson>;
};
export const safeParseContacts = (fromPages: PageObjectResponse[]) => {
  const success: ContactPerson[] = [];
  const failed: FailedParsed<ContactPerson>[] = [];

  fromPages
    .map(mapContactPerson)
    .map((unparsed) => ({
      unparsed,
      parsed: contactPersonSchema.safeParse(unparsed),
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

export const safeParse = (fromPages: PageObjectResponse[]) => {
  const success: Speaker[] = [];
  const failed: FailedParsed<Speaker>[] = [];

  fromPages
    .map(mapSpeaker)
    .map((unparsed) => ({
      unparsed,
      parsed: speakerSchema.safeParse(unparsed),
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

const mapSpeaker = (fromPage: PageObjectResponse) => {
  return {
    id: fromPage.id,
    name: getTitle(fromPage),
    email: getEmail("Epost", fromPage),
    bio: getText("Bio", fromPage),
  } satisfies Relaxed<Speaker>;
};

export const safeParseSpeakers = (fromPages: PageObjectResponse[]) => {
  const success: Speaker[] = [];
  const failed: FailedParsed<Speaker>[] = [];

  fromPages
    .map(mapSpeaker)
    .map((unparsed) => ({
      unparsed,
      parsed: speakerSchema.safeParse(unparsed),
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

const mapTalk = (fromPage: PageObjectResponse, speakers: Speaker[]) => {
  return {
    id: fromPage.id,
    title: getTitle(fromPage),
    speakers: getRelation("Foredragsholder", fromPage)
      ?.map((id) => speakers.find((x) => x.id === id))
      .filter(typedBoolean),
    timeslot: getSelectAndColor("Tidspunkt", fromPage) as any,
    track: getTrackSelectAndColor("Track", fromPage),
    abstract: getRichText("Abstract", fromPage),
    duration: getSelectAndColor("Lengde", fromPage) as any,
    isPublished:
      getSelect("Status", fromPage) ===
      "8. Tildelt slot i program (tid og rom)",
    startTime: getDate("Starttid", fromPage),
  } satisfies Relaxed<Talk>;
};

export const safeParseTalks = (
  fromPages: PageObjectResponse[],
  speakers: Speaker[],
) => {
  const success: Talk[] = [];
  const failed: FailedParsed<Talk>[] = [];

  fromPages
    .map((page) => mapTalk(page, speakers))
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
