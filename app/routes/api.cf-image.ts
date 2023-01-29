import type { AppLoadContext, LoaderArgs } from "@remix-run/cloudflare";

import { z } from "zod";

import { getClient } from "~/notion/notion";
import {
  safeParseContacts,
  safeParseSpeakers,
} from "~/notion-conference/domain";
import { getEnvVariableOrThrow } from "~/utils/env";

const imageOptionsSchema = z.object({
  size: z.enum(["thumbnail"]).default("thumbnail"),
});

const imageRequestSchema = z.discriminatedUnion("type", [
  imageOptionsSchema.extend({
    type: z.literal("speaker"),
    speakerId: z.string(),
  }),
  imageOptionsSchema.extend({
    type: z.literal("contact"),
    contactId: z.string(),
  }),
]);
type ImageRequest = z.infer<typeof imageRequestSchema>;

const getImageUrl = async (
  imageRequest: ImageRequest,
  context: AppLoadContext,
) => {
  const notionToken = getEnvVariableOrThrow("NOTION_TOKEN", context) as string;
  const client = getClient(notionToken);

  if (imageRequest.type === "speaker") {
    const [[speaker]] = safeParseSpeakers([
      await client.getPage(imageRequest.speakerId),
    ]);
    if (!speaker.image) return undefined;

    return speaker.image;
  }

  if (imageRequest.type === "contact") {
    const [[contact]] = safeParseContacts([
      await client.getPage(imageRequest.contactId),
    ]);
    if (!contact.image) return undefined;

    return contact.image;
  }
};

export const loader = async ({ context, request }: LoaderArgs) => {
  const imageRequest = imageRequestSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const imageUrl = await getImageUrl(imageRequest, context);
  if (!imageUrl) {
    // TODO: Return placeholder image
    throw new Error("No image");
  }

  return fetch(imageUrl, {
    cf: {
      image: {
        format: "webp",

        // For now we just show thumbnails, this might change in the future
        width: 50 * 3,
        height: 50 * 3,
      },
    },
  });
};
