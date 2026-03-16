import type { LoaderFunctionArgs } from "react-router";

import { getDataCachedAndFiltered } from "~/notion-conference/client-cached-and-filtered";

// Open in firefox for nice json view
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const data = await getDataCachedAndFiltered(request, context);
  return Response.json(data);
};
