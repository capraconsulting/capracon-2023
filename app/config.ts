export const config = {
  conferenceId: "d3ea95168d01405caa4198c86af1224a",
  contactsDatabaseId: "4ad522bb07b54d4f9201ac0b481de224",
  speakersDatabaseId: "115cce311db481568dcdd7cdf3316246",
  masterProgramDatabaseId: "115cce311db4810ca0c9d6681a129081",
  memosDatabaseId: "197cce311db48130aac5cf1da74b882d",

  KV_NAMESPACE: "KV",
  KV_DATA_CACHE_KEY: "new-data-2025",

  KV_TTL_IN_MS: 1000 * 5,
  KW_SWR_IN_MS: 1000 * 60 * 60 * 24,

  cacheControlHeaders: {
    "Cache-Control": `public, s-maxage=${1}, stale-while-revalidate=${
      60 * 60 * 24 * 7
    }`,
  },
} as const;
