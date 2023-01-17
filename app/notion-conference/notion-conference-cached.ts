import type { AppLoadContext } from "@remix-run/cloudflare";

import { getData } from "~/notion-conference/client";
import { getEnvVariableOrThrow } from "~/utils/env";

type Metadata = {
  createdTime: number;
  swr: number;
  ttl: number;
};
const totalTtl = ({ ttl, swr }: Metadata) => ttl + swr;
const shouldRevalidate = (metadata: Metadata) =>
  metadata.createdTime + metadata.ttl < Date.now() && !isExpired(metadata);
const isExpired = (metadata: Metadata) =>
  metadata.createdTime + totalTtl(metadata) < Date.now();

interface Options<T> {
  kv: KVNamespace;
  waitUntil: (promise: Promise<any>) => void;
  key: string;
  // in milliseconds
  ttl: number;
  swr: number;

  getFreshValue: () => Promise<T>;
}

const kvCachified = async <T>({
  kv,
  waitUntil,
  key,
  ttl,
  swr,
  getFreshValue,
}: Options<T>): Promise<T> => {
  const getAndSet = async () => {
    const value = await getFreshValue();
    const metadata: Metadata = {
      createdTime: Date.now(),
      swr,
      ttl,
    };
    waitUntil(
      kv.put(key, JSON.stringify(value), {
        expirationTtl: totalTtl(metadata),
        metadata,
      }),
    );
    return value;
  };

  // try to get cached value
  let { value, metadata } = await kv.getWithMetadata<T, Metadata>(key, "json");

  // if it's empty or expired, wait for fresh value
  if (!(value && metadata) || isExpired(metadata)) {
    value = await getAndSet();
  }

  // if it's stale, revalidate it in the background
  // stale-while-revalidate
  if (metadata && shouldRevalidate(metadata)) {
    // Cloudflare needs to be told not to stop execution after the response has returned
    // it should wait for the cache to be updated in the background as well
    // when we are using `stale-while-revalidate`
    //
    // For this, it provides the `waitUntil` function
    waitUntil(getAndSet());
  }

  return value;
};

export const getDataCached = async (context: AppLoadContext) => {
  const kv = getEnvVariableOrThrow("KV", context) as KVNamespace;
  const waitUntil = getEnvVariableOrThrow("waitUntil", context) as (
    promise: Promise<any>,
  ) => void;

  const notionToken = getEnvVariableOrThrow("NOTION_TOKEN", context) as string;

  return kvCachified({
    kv,
    waitUntil,
    key: "all-data",
    getFreshValue: () => getData(notionToken),
    ttl: 1000 * 5,
    swr: 1000 * 60 * 60 * 24,
  });
};
