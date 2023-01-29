import type { AppLoadContext, LoaderArgs } from "@remix-run/cloudflare";

import { z } from "zod";

import { getClient } from "~/notion/notion";
import {
  safeParseContacts,
  safeParseSpeakers,
} from "~/notion-conference/domain";
import { getEnvVariableOrThrow } from "~/utils/env";

// Schema
export const imageRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("speaker"),
    id: z.string(),
  }),
  z.object({
    type: z.literal("contact"),
    id: z.string(),
  }),
]);
export type ImageRequest = z.infer<typeof imageRequestSchema>;

/**
 * Get a conferencee specific image url
 */
const getNotionConferenceImageUrl = async (
  imageRequest: ImageRequest,
  context: AppLoadContext,
) => {
  const notionToken = getEnvVariableOrThrow("NOTION_TOKEN", context) as string;
  const client = getClient(notionToken);

  if (imageRequest.type === "speaker") {
    const [[speaker]] = safeParseSpeakers([
      await client.getPage(imageRequest.id),
    ]);
    if (!speaker.image) return undefined;

    return speaker.image;
  }

  if (imageRequest.type === "contact") {
    const [[contact]] = safeParseContacts([
      await client.getPage(imageRequest.id),
    ]);
    if (!contact.image) return undefined;

    return contact.image;
  }
};

/**
 * Proxy conference specific images hosted on notion
 *
 * the image links are long, dynamic, and only available for a short period
 * the image optimization services will cache based on the url, therfor
 * it makes sense to provide them a nice static url
 */
export const loader = async ({ context, request }: LoaderArgs) => {
  const imageRequest = imageRequestSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const imageUrl = await getNotionConferenceImageUrl(imageRequest, context);
  if (!imageUrl) {
    // TODO: Return placeholder image
    throw new Error("No image");
  }

  return fetch(imageUrl);
};
