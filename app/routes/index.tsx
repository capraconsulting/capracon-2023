import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { getEnvVariableOrThrow } from "~/utils/env";

export const loader = ({ context }: LoaderArgs) => {
  const token = getEnvVariableOrThrow("NOTION_TOKEN", context);
  return json({});
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Hello</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
