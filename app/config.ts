export const config = {
  conferenceId: "d3ea95168d01405caa4198c86af1224a",
  contactsDatabaseId: "4ad522bb07b54d4f9201ac0b481de224",
  speakersDatabaseId: "cc4333b912e244c499538b93fe94cebf",
  masterProgramDatabaseId: "43afb7a3986f493193ec208dd2080543",
  memosDatabaseId: "197cce311db48130aac5cf1da74b882d",

  KV_NAMESPACE: "KV",
  KV_DATA_CACHE_KEY: "all-data-2024",

  KV_TTL_IN_MS: 1000 * 5,
  KW_SWR_IN_MS: 1000 * 60 * 60 * 24,

  cacheControlHeaders: {
    "Cache-Control": `public, s-maxage=${1}, stale-while-revalidate=${
      60 * 60 * 24 * 7
    }`,
  },
} as const;
