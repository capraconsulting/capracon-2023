export const config = {
  conferenceId: "d84d4b2667ff40c49103e3455b7c98c8",
  contactsDatabaseId: "bb1685286d344870814bc826001bae01",
  speakersDatabaseId: "2503c0352cc0487986d711c3266f7dac",
  masterProgramDatabaseId: "27077cab001149a19398a3fedda6884d",

  KV_NAMESPACE: "KV",
  KV_DATA_CACHE_KEY: "all-data",

  KV_TTL_IN_MS: 1000 * 5,
  KW_SWR_IN_MS: 1000 * 60 * 60 * 24,

  cacheControlHeaders: {
    "Cache-Control": `public, s-maxage=${1}, stale-while-revalidate=${
      60 * 60 * 24 * 7
    }`,
  },
} as const;
