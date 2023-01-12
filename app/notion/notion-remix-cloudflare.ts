import {
  getBlocks,
  getBlocksWithChildren,
  getDatabase,
  getDatabasePages,
  getNotionClient,
  getPage,
} from "./notion";

/**
 * Small helper for Remix and Cloudflare Pages
 */
export const getClient = (token: string) => {
  const notionClient = getNotionClient(token);

  return {
    getDatabasePages: getDatabasePages(notionClient),
    getPage: getPage(notionClient),
    getDatabase: getDatabase(notionClient),
    getBlocks: getBlocks(notionClient),
    getBlocksWithChildren: getBlocksWithChildren(notionClient),
  };
};
