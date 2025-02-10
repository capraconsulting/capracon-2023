import type { LoaderArgs } from "@remix-run/cloudflare";

import { z } from "zod";

import { assertUnreachable } from "~/utils/misc";
import type { ImageRequest } from "./api.image-original";
import { imageRequestSchema } from "./api.image-original";

const imageOptionsSchema = z.object({
  mode: z.enum(["face", "portrait", "landscape"]),
});
export type ImageOptions = z.infer<typeof imageOptionsSchema>;

const buildCloudinaryUrl = (src: string, options: ImageOptions) => {
  // Square, using 1:1 ratio
  if (options.mode === "face") {
    return `https://res.cloudinary.com/dyq7ofn3z/image/fetch/f_auto,c_thumb,w_300,h_300,g_face/${encodeURIComponent(
      src,
    )}`;
  }

  // Portrait, using 12:13 ratio (300w, 325h)
  if (options.mode === "portrait") {
    return `https://res.cloudinary.com/dyq7ofn3z/image/fetch/f_auto,c_fill,w_600,h_650,g_face/${encodeURIComponent(
      src,
    )}`;
  }

  // Portrait, using 3:2 ratio (300w,200h)
  if (options.mode === "landscape") {
    return `https://res.cloudinary.com/dyq7ofn3z/image/fetch/f_auto,c_fill,w_1200,h_800,g_face/${encodeURIComponent(
      src,
    )}`;
  }

  assertUnreachable(options.mode);
};
const buildExternalProviderOptimizedImageUrl = (
  src: string,
  options: ImageOptions,
) => buildCloudinaryUrl(src, options);

const buildOriginalImageUrl = ({ type, id }: ImageRequest) =>
  `https://capracon.no/api/image-original?type=${type}&id=${id}`;

export const buildImageUrl = ({
  type,
  id,
  ...options
}: ImageRequest & ImageOptions) => {
  // Link the user directly to the image cdn
  return buildExternalProviderOptimizedImageUrl(
    buildOriginalImageUrl({ type, id }),
    options,
  );

  // return `/api/image-optimized/?type=${type}&id=${id}`;
};

export const loader = async ({ request }: LoaderArgs) => {
  const imageRequest = imageRequestSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const imageOptions = imageOptionsSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  // This endpoint fetches the actual image from notion and aws
  const originalImage = buildOriginalImageUrl(imageRequest);

  // This fetches image above and transforms it
  const imageProviderUrl = buildExternalProviderOptimizedImageUrl(
    originalImage,
    imageOptions,
  );

  // Here we serve it as it was us doing the magic all along
  // allows us to control cache-control headers and use the same domain
  //
  // At the moment this does not work, probably due to bot protection
  // or that they simply don't want this kind of proxying to happen 🤷
  return fetch(imageProviderUrl);
};
