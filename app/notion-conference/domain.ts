import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

import type { RichTextItem } from "~/notion/helpers";
import {
  getDatabasePropertySelectOptions,
  getDate,
  getEmail,
  getImage,
  getRelation,
  getRichText,
  getSelect,
  getSelectAndColor,
  getText,
  getTitle,
  getUrl,
} from "~/notion/helpers";
import type { DatabaseResponse } from "~/notion/notion";
import { TRACKS, YEARS } from "~/utils/consts";
import type { Relaxed } from "~/utils/misc";
import { typedBoolean } from "~/utils/misc";
import { formattedHoursMinutes, sortedTalksByStartTime } from "./helpers";

const selectSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string(),
});

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

  foredragsholdereTitle: z.string(),
  foredragsholdereDescription: z.string(),
});
export type Conference = z.infer<typeof conferenceSchema>;

const speakerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  image: z.string().url().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
});
export type Speaker = z.infer<typeof speakerSchema>;

const contactPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url().optional(),
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
      return { hours, minutes };
    };
    return { ...val, startTime: parse(start), endTime: parse(end) };
  });
export type Timeslot = z.infer<typeof timeslotSchema>;

const durationSchema = selectSchema
  .extend({
    title: z.string().regex(/^\d+$/, "must be a valid number"),
  })
  .transform((val) => {
    return { ...val, minutes: Number(val.title) };
  });

const trackSchema = selectSchema.extend({ title: z.enum(TRACKS) });
export type Track = z.infer<typeof trackSchema>;

const talkSchema = z.object({
  id: z.string(),
  title: z.string(),
  abstract: richTextSchema,
  abstractShort: richTextSchema,
  track: trackSchema,
  speakers: z.array(speakerSchema),
  timeslot: timeslotSchema,
  duration: durationSchema,
  isPublished: z.boolean(),
  startTime: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val).toISOString()),
  year: z.string(),
});
export type Talk = z.infer<typeof talkSchema>;

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

    foredragsholdereTitle: getText("foredragsholdereTitle", fromPage),
    foredragsholdereDescription: getText(
      "foredragsholdereDescription",
      fromPage,
    ),
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
    image: getImage("Bilde", fromPage),
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

const mapSpeaker = (fromPage: PageObjectResponse) => {
  return {
    id: fromPage.id,
    name: getTitle(fromPage),
    email: getEmail("Epost", fromPage),
    bio: getText("Bio", fromPage),
    image: getImage("Bilde", fromPage),
    company: getText("Selskap", fromPage),
    role: getText("Stilling", fromPage),
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
    track: getSelectAndColor("Track", fromPage) as any,
    abstract: getRichText("Abstract", fromPage),
    abstractShort: getRichText("Abstract_short", fromPage),
    duration: getSelectAndColor("Lengde", fromPage) as any,
    isPublished:
      getSelect("Status", fromPage) ===
      "8. Tildelt slot i program (tid og rom)",
    startTime: getDate("Starttid", fromPage),
    year: (getSelectAndColor("Årgang", fromPage)?.title ?? "2023") as string,
  } satisfies Relaxed<Talk>;
};

export const safeParseTalks = (
  fromPages: PageObjectResponse[],
  speakers: Speaker[],
) => {
  let success: Talk[] = [];
  const failed: FailedParsed<Talk>[] = [];

  fromPages
    .map((page) => mapTalk(page, speakers))
    .filter((talk) => talk.year === "2024")
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

  // Pre-sort the talks in correct order
  success = sortedTalksByStartTime(success);

  console.log(
    "Successfull talks: ",
    success.length,
    " failed talks:",
    failed.length,
  );

  return [success, failed] as const;
};

export const parseTracks = (fromDatabase: DatabaseResponse) =>
  z
    .array(trackSchema)
    .parse(getDatabasePropertySelectOptions("Track", fromDatabase));

export const parseTimeslots = (fromDatabase: DatabaseResponse) =>
  z
    .array(timeslotSchema)
    // Ensure correct order based on the startTime
    // regardless of the order the notion api gives the timeslots
    // 0900 -> 1015 -> 1200
    .transform((timeslots) =>
      timeslots.sort(
        (a, b) =>
          Number(formattedHoursMinutes(a.startTime)) -
          Number(formattedHoursMinutes(b.startTime)),
      ),
    )
    .parse(getDatabasePropertySelectOptions("Tidspunkt", fromDatabase));
