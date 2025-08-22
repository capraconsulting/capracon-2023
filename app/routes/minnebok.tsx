import type { HeadersFunction, V2_MetaFunction } from "@remix-run/cloudflare";

import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import { config } from "~/config";
import { type RootLoader, useRootData } from "~/root";
import { buildImageUrl } from "./api.image-optimized";

export const headers: HeadersFunction = () => config.cacheControlHeaders;

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"]?.conference?.title,
  },
  {
    name: "description",
    content: parentsData["root"]?.conference?.description,
  },
];

export default function Minnebok() {
  const { memos } = useRootData();
  return (
    <ContentBox>
      <Title
        as="h1"
        className="mt-8 text-3xl tablet:mb-8 tablet:mt-24 tablet:text-5xl"
      >
        Minnebok
      </Title>
      <div className="lg:columns-4 columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 [&>img:not(:first-child)]:mt-8">
        {memos?.map((memo, index) => (
          <img
            key={index}
            alt={memo.name}
            src={buildImageUrl({
              type: "speaker",
              id: memo.id,
              mode: index % 5 === 0 ? "landscape" : "portrait",
            })}
            className="h-auto max-w-full rounded-lg"
          />
        ))}
      </div>
    </ContentBox>
  );
}
