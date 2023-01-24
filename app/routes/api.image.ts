import type { LoaderArgs } from "@remix-run/cloudflare";

import { imageLoader, MemoryCache } from "remix-image/serverPure";

const cache = new MemoryCache();

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  return await imageLoader(
    {
      selfUrl: [url.protocol, url.hostname].join("//"),
      cache,
    },
    request,
  );
}
