import { Client as NotionClient } from "@notionhq/client";
import type { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

export const getClient = (token: string) => {
  const notionClient = new NotionClient({
    auth: token,
  });

  return {
    getDatabasePages: getDatabasePages(notionClient),
    getPage: getPage(notionClient),
    getDatabase: getDatabase(notionClient),
    getBlocks: getBlocks(notionClient),
    getBlocksWithChildren: getBlocksWithChildren(notionClient),
  };
};

type Sorts = Parameters<NotionClient["dataSources"]["query"]>[0]["sorts"];
type Filter = Parameters<NotionClient["dataSources"]["query"]>[0]["filter"];

const getDataSourceId = async (notion: NotionClient, databaseId: string) => {
  const database = await notion.databases.retrieve({
    database_id: databaseId,
  });
  if (!("data_sources" in database) || !database.data_sources?.length) {
    throw new Error(`Database ${databaseId} has no data sources`);
  }
  return database.data_sources[0].id;
};

const getDatabasePages =
  (notion: NotionClient) =>
  async (databaseId: string, sorts?: Sorts, filter?: Filter) => {
    const dataSourceId = await getDataSourceId(notion, databaseId);

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts,
      filter,
    });

    return onlyDatabasePages(response.results);
  };

const getPage = (notion: NotionClient) => async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return assertPageResponse(response);
};

const getDatabase = (notion: NotionClient) => async (databaseId: string) => {
  const dataSourceId = await getDataSourceId(notion, databaseId);
  const response = await notion.dataSources.retrieve({
    data_source_id: dataSourceId,
  });
  return assertDatabaseResponse(response);
};

const getBlocks = (notion: NotionClient) => async (blockId: string) => {
  const blocks = [];
  let cursor;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { results, next_cursor } = (await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })) as ListBlockChildrenResponse;
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks.filter(isBlockObjectResponse);
};

const getBlocksWithChildren =
  (notion: NotionClient) =>
  async (blockId: string): Promise<BlockWithChildren[]> => {
    const blocks = await getBlocks(notion)(blockId);
    // Retrieve block children for nested blocks (one level deep), for example toggle blocks
    // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = await Promise.all(
      blocks
        .filter((block) => block.has_children)
        ?.map(async (block) => {
          return {
            id: block.id,
            children: await getBlocksWithChildren(notion)(block.id),
          };
        }),
    );

    const blocksWithChildren = blocks?.map((block) => {
      const innerBlock = block as Record<string, any>;
      // Add child blocks if the block should contain children but none exists
      if (innerBlock.has_children && !innerBlock[innerBlock.type].children) {
        innerBlock[innerBlock.type]["children"] = childBlocks?.find(
          (x) => x.id === innerBlock.id,
        )?.children;
      }
      return innerBlock;
    }) as BlockWithChildren[];

    return blocksWithChildren;
  };

// Some typescript magic to extract the correct type
type MaybeBlockResponse = ListBlockChildrenResponse["results"][number];
const assertBlockObjectResponse = (block: MaybeBlockResponse) => {
  if ("type" in block) return block;
  throw new Error("passed block is not a BlockObjeectResponse");
};
type Block = ReturnType<typeof assertBlockObjectResponse>;
function isBlockObjectResponse(block: MaybeBlockResponse): block is Block {
  return "type" in block;
}

type BlockWithChildren = Block & {
  children?: BlockWithChildren;
};

// Database
type MaybeDatabasePageResponse = Awaited<
  ReturnType<NotionClient["dataSources"]["query"]>
>["results"][number];
export type DatabasePage = ReturnType<typeof onlyDatabasePages>[number];
const onlyDatabasePages = (databasePages: MaybeDatabasePageResponse[]) => {
  const result = [];
  for (const databasePage of databasePages) {
    if ("properties" in databasePage) {
      result.push(databasePage);
    }
  }
  return result;
};

// Page
type MaybePageResponse = Awaited<ReturnType<NotionClient["pages"]["retrieve"]>>;
export type PageResponse = ReturnType<typeof assertPageResponse>;
const assertPageResponse = (page: MaybePageResponse) => {
  if ("properties" in page) return page;
  throw new Error("passed page is not a PageResponse");
};

// Database / Data Source
type MaybeDatabaseResponse = Awaited<
  ReturnType<NotionClient["dataSources"]["retrieve"]>
>;
export type DatabaseResponse = ReturnType<typeof assertDatabaseResponse>;
const assertDatabaseResponse = (page: MaybeDatabaseResponse) => {
  if ("properties" in page) return page;
  throw new Error("passed page is not a DatabaseResponse");
};
