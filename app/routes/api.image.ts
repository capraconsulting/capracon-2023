import type { LoaderArgs } from "@remix-run/cloudflare";

import { imageLoader, MemoryCache } from "remix-image/serverPure";

import { createSpeakerResolver } from "~/notion/notion";

const cache = new MemoryCache();

export async function loader({ request, context }: LoaderArgs) {
  const url = new URL(request.url);
  return await imageLoader(
    {
      selfUrl: [url.protocol, url.hostname].join("//"),
      cache,
      resolver: createSpeakerResolver(context),
    },
    request,
  );
}
