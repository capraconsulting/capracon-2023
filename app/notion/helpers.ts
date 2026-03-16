import type { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

import type { DatabasePage, PageResponse } from "./notion";
import type { DatabaseResponse } from "./notion";

export function slugify(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")

      // Norwegian æøå
      .replace("æ¨", "ae")
      .replace("ø", "o")
      .replace("å", "a")

      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  );
}

export const getTitle = (fromPage: PageResponse | DatabasePage) => {
  const title = Object.values(fromPage.properties)?.find(
    (property) => property.type === "title",
  );
  if (title?.type !== "title")
    throw new Error("Could not get title from passed notion page");

  return getTextFromRichText(title?.title).trim();
};

export const getBoolean = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "checkbox") {
    return property.checkbox;
  }
  return undefined;
};

export const getUrl = (name: string, fromPage: DatabasePage): string | undefined => {
  const property = fromPage.properties[name];
  if (property?.type === "url") {
    return (property.url as string | null) ?? undefined;
  }
  return undefined;
};

export const getFileUrl = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "files") {
    const files = property.files as any[];
    if (!files?.length) return undefined;

    const file = files[0];
    if (file?.type === "external") {
      return file.external.url as string;
    } else if (file?.type === "file") {
      return file.file.url as string;
    }
  }
  return undefined;
};

export const getRichText = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "rich_text") {
    return property.rich_text as RichTextItem[];
  }
  return undefined;
};

export const getText = (name: string, fromPage: DatabasePage): string | undefined => {
  const richText = getRichText(name, fromPage);
  if (richText) return getTextFromRichText(richText);
  return undefined;
};

export const getEmail = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "email") {
    return (property.email as string | null) ?? undefined;
  }
  return undefined;
};

export const getRelation = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "relation") {
    const relation = property.relation as { id: string }[];
    return relation?.map((x) => x.id);
  }
  return undefined;
};

export const getDate = (name: string, fromPage: DatabasePage): string | undefined => {
  const property = fromPage.properties[name];
  if (property?.type === "date") {
    return (property?.date as any)?.start ?? undefined;
  }
  return undefined;
};

export const getImage = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "files") {
    const files = property.files as any[];
    return files
      ?.map((it: any) =>
        it.type === "external"
          ? it.external.url
          : it.type === "file"
          ? it.file.url
          : undefined,
      )
      ?.find((it: string | undefined) => !!it?.length);
  }
  return undefined;
};

export const getDateRange = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "date") {
    return property?.date;
  }
  return undefined;
};

export const getCheckbox = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "checkbox") {
    return property.checkbox;
  }
  return undefined;
};

export const getSelectAndColor = (name: string, fromPage: DatabasePage) => {
  const property = fromPage.properties[name];
  if (property?.type === "select") {
    const select = property.select as
      | { id: string; name: string; color: string }
      | null
      | undefined;
    if (select?.name && select.color) {
      return {
        id: select.id,
        title: select.name,
        color: select.color,
      };
    }
  }
  return undefined;
};

export const getSelect = (name: string, fromPage: DatabasePage) =>
  getSelectAndColor(name, fromPage)?.title;

export const getMultiSelectAndColor = (
  name: string,
  fromPage: DatabasePage,
) => {
  const property = fromPage.properties[name];
  if (property?.type === "multi_select") {
    const multiSelect = property.multi_select as {
      id: string;
      name: string;
      color: string;
    }[];
    return multiSelect?.map((x) => ({
      id: x.id,
      title: x.name,
      color: x.color,
    }));
  }
  return undefined;
};

export const getMultiSelect = (name: string, fromPage: DatabasePage) =>
  getMultiSelectAndColor(name, fromPage)?.map((x: any) => x?.title);

export const getTextFromRichText = (richText: RichTextItem[]) =>
  richText?.map((richTextBlock) => richTextBlock.plain_text).join("");

export const getDatabasePropertySelectOptions = (
  name: string,
  fromDatabase: DatabaseResponse,
) => {
  const property = fromDatabase.properties[name];
  if (property?.type === "select") {
    return property.select.options?.map((x) => ({
      id: x.id,
      color: x.color,
      title: x.name,
    }));
  }

  return undefined;
};

export const findPageBySlugPredicate =
  (slug: string) => (page: PageResponse | DatabasePage) =>
    slugify(getTitle(page) ?? "") === slug;

// Some typescript magic to extract the correct type
type MaybeBlockResponse = ListBlockChildrenResponse["results"][number];
const assertBlockObjectResponse = (block: MaybeBlockResponse) => {
  if ("type" in block) return block;
  throw new Error("passed block is not a BlockObjectResponse");
};
export type Block = ReturnType<typeof assertBlockObjectResponse>;
export type BlockType = Block["type"];

export type BlockWithChildren = Block & {
  children?: BlockWithChildren;
};

export type RichText = Extract<Block, { type: "heading_1" }>["heading_1"];

export type RichTextItem = Extract<
  Block,
  { type: "paragraph" }
>["paragraph"]["rich_text"][number];

export type RichTextColor = RichTextItem["annotations"]["color"];

// TODO: Infer from @notionhq/client
export type SelectColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";
