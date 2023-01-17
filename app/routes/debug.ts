import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { getDataCachedAndFiltered } from "~/notion-conference/notion-conference-cached";

// Open in firefox for nice json view
export const loader = async ({ request, context }: LoaderArgs) => {
  const data = await getDataCachedAndFiltered(request, context);
  return json(data);
};
