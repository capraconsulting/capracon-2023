import type { AppLoadContext } from "@remix-run/cloudflare";

import type { Cache as CachifiedCache } from "cachified";
import cachified, { totalTtl } from "cachified";

import { getData } from "~/notion-conference/client";
import { getEnvVariableOrThrow } from "./env";

function cloudflareKVAdapter(
  kv: KVNamespace,
  waitUntil: (promise: Promise<any>) => void,
): CachifiedCache {
  return {
    name: "KV",
    set(key, value) {
      const ttl = totalTtl(value?.metadata);

      // Cloudflare needs to be told not to stop execution after the response has returned
      // it should wait for the cache to be updated in the background as well
      // when we are using `stale-while-revalidate`
      //
      // For this, it provides the `waitUntil` function
      return waitUntil(
        kv.put(key, JSON.stringify(value), {
          expirationTtl: ttl === Infinity ? undefined : ttl,
        }),
      );
    },
    get(key) {
      return kv.get(key, "json");
    },
    delete(key) {
      return kv.delete(key);
    },
  };
}

export const getDataCached = (context: AppLoadContext) => {
  const kv = getEnvVariableOrThrow("KV", context) as KVNamespace;
  const waitUntil = getEnvVariableOrThrow("waitUntil", context) as (
    promise: Promise<any>,
  ) => void;

  const notionToken = getEnvVariableOrThrow("NOTION_TOKEN", context) as string;

  return cachified({
    key: "notion-data",
    cache: cloudflareKVAdapter(kv, waitUntil),
    getFreshValue: () => getData(notionToken),
    ttl: 5000,
    staleWhileRevalidate: 1000 * 60 * 60 * 24,
  });
};
