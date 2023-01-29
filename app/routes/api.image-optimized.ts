import type { LoaderArgs } from "@remix-run/cloudflare";

import { z } from "zod";

import type { ImageRequest } from "./api.image-original";
import { imageRequestSchema } from "./api.image-original";

const imageOptionsSchema = z.object({
  provider: z.enum(["imagekit", "cloudinary"]).default("imagekit"),
  // Here we put options like format, height, width, cropping options
  // For now these are just hardcoded
});
export type ImageOptions = z.infer<typeof imageOptionsSchema>;

export const buildImagekitUrl = (src: string, options: ImageOptions) => {
  return `https://ik.imagekit.io/y0rnxuzer/tr:w-300,h-300,c-at_max,fo-face/${src}`;
};
export const buildCloudinaryUrl = (src: string, options: ImageOptions) => {
  throw new Error("not yet implemented");
};

const buildOriginalImageUrl = ({ type, id }: ImageRequest) =>
  `https://capracon.no/api/image-original?type=${type}&id=${id}`;

export const buildImageUrl = ({ type, id }: ImageRequest) => {
  return `/api/image-optimized/?type=${type}&id=${id}`;
};

export const loader = async ({ request }: LoaderArgs) => {
  const imageRequest = imageRequestSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const imageOptions = imageOptionsSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  // This endpoint fetches the actual image from notion and aws
  const proxiedOriginalImageUrl = buildOriginalImageUrl(imageRequest);

  // This fetches image above and transforms it
  let imageProviderUrl = "";
  if (imageOptions.provider === "cloudinary")
    imageProviderUrl = buildCloudinaryUrl(
      proxiedOriginalImageUrl,
      imageOptions,
    );
  if (imageOptions.provider === "imagekit")
    imageProviderUrl = buildImagekitUrl(proxiedOriginalImageUrl, imageOptions);

  // Here we serve it as it was us doing the magic all along
  // allows us to control cache-control headers and use the same domain
  const response = await fetch(imageProviderUrl);
  return response;
};
