export const config = {
  conferenceId: "229cce311db4800988d9fbc119df0d8f",
  conferenceDatabaseId: "b3e3e53d2a744d47a841d29071a023e8",
  contactsDatabaseId: "323cce311db481c387c4e63e6eba94df",
  speakersDatabaseId: "323cce311db481ed89efc48410e14d07",
  masterProgramDatabaseId: "324cce311db4807689fcee945450ba74",
  memosDatabaseId: "323cce311db481c0954fe2aac4d4a4fb",

  KV_NAMESPACE: "KV",
  KV_DATA_CACHE_KEY: "updated-data-2026",

  KV_TTL_IN_MS: 1000 * 5,
  KW_SWR_IN_MS: 1000 * 60 * 60 * 24,

  cacheControlHeaders: {
    "Cache-Control": `public, s-maxage=${1}, stale-while-revalidate=${
      60 * 60 * 24 * 7
    }`,
  },
} as const;
