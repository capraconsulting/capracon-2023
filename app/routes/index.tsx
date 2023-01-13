import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { getDataCached } from "~/utils/notion-conference-cached";

export const loader = async ({ context }: LoaderArgs) => {
  const data = await getDataCached(context);

  return json(data);
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-4xl text-red-400">Julian er kul</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
