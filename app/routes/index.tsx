import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "~/config";
import { getClient } from "~/notion/notion-remix-cloudflare";
import { getEnvVariableOrThrow } from "~/utils/env";

export const loader = async ({ context }: LoaderArgs) => {
  const token = getEnvVariableOrThrow("NOTION_TOKEN", context);

  // Fetch
  const [masterProgram] = await Promise.all([
    getClient(token).getDatabasePages(config.masterProgramDatabaseId),
  ]);

  return json({
    masterProgram,
  });
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
