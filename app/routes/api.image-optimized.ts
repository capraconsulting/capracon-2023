import type { LoaderArgs } from "@remix-run/cloudflare";

import { z } from "zod";

import { assertUnreachable } from "~/utils/misc";
import type { ImageRequest } from "./api.image-original";
import { imageRequestSchema } from "./api.image-original";

const imageOptionsSchema = z.object({
  provider: z.enum(["imagekit", "cloudinary"]).default("cloudinary"),
  // Here we put options like format, height, width, cropping options
  // For now these are just hardcoded
});
export type ImageOptions = z.infer<typeof imageOptionsSchema>;

const buildImagekitUrl = (src: string, options: ImageOptions) => {
  return `https://ik.imagekit.io/y0rnxuzer/tr:w-300,h-300,c-at_max,fo-face/${encodeURIComponent(
    src,
  )}`;
};
const buildCloudinaryUrl = (src: string, options: ImageOptions) => {
  return `https://res.cloudinary.com/dyq7ofn3z/image/fetch/f_auto,c_thumb,w_300,h_300,g_face/${encodeURIComponent(
    src,
  )}`;
};
const buildExternalProviderOptimizedImageUrl = (
  src: string,
  options: ImageOptions,
) => {
  switch (options.provider) {
    case "cloudinary":
      return buildCloudinaryUrl(src, options);
    case "imagekit":
      return buildImagekitUrl(src, options);
    default:
      assertUnreachable(options.provider);
  }
};

const buildOriginalImageUrl = ({ type, id }: ImageRequest) =>
  `https://capracon.no/api/image-original?type=${type}&id=${id}`;

export const buildImageUrl = ({ type, id }: ImageRequest) => {
  // Link the user directly to the image cdn
  return buildExternalProviderOptimizedImageUrl(
    buildOriginalImageUrl({ type, id }),
    {
      provider: "cloudinary",
    },
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
