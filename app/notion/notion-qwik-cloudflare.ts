import { getEnvVariableOrThrow } from "~/utils/env";
import {
  getNotionClient,
  getDatabasePages,
  getPage,
  getDatabase,
  getBlocks,
  getBlocksWithChildren,
} from "./notion";

/**
 * Small helper for Qwik and Cloudflare Pages
 */
export const getClient = (platform: { env: Record<string, any> }) => {
  const notionClient = getNotionClient(
    getEnvVariableOrThrow("VITE_NOTION_TOKEN", platform.env),
  );

  return {
    getDatabasePages: getDatabasePages(notionClient),
    getPage: getPage(notionClient),
    getDatabase: getDatabase(notionClient),
    getBlocks: getBlocks(notionClient),
    getBlocksWithChildren: getBlocksWithChildren(notionClient),
  };
};
