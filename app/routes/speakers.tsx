import type { V2_MetaFunction } from "@remix-run/cloudflare";

import { CompanyLogo } from "~/components/company-logos";
import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import { slugify } from "~/notion/helpers";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";
import { classNames } from "~/utils/misc";
import { buildImageUrl } from "./api.image-optimized";

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"].conference.foredragsholdereTitle,
  },
  {
    name: "description",
    content: parentsData["root"].conference.foredragsholdereDescription,
  },
];
export default function Component() {
  const { conference, speakers } = useRootData();
  const sortedSpeakers = speakers.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return (
    <ContentBox>
      <Title
        as="h1"
        className="mt-8 text-3xl tablet:mb-8 tablet:mt-24 tablet:text-5xl"
      >
        {conference.foredragsholdereTitle}
      </Title>
      <div className="flex flex-col gap-6 tablet:gap-8">
        {sortedSpeakers.map((speaker) => (
          <article
            className="rounded-md border border-gray-200 bg-white px-3 py-4 laptop:px-6 laptop:pb-8 laptop:pt-6 dark:border-zinc-800 dark:bg-zinc-800"
            key={speaker.id}
            id={slugify(speaker.name)}
          >
            <div className="flex flex-col gap-4 tablet:flex-row">
              {speaker.image && (
                // Make the picture change orientation depending on screen size
                <picture className="contents">
                  <source
                    srcSet={buildImageUrl({
                      type: "speaker",
                      id: speaker.id,
                      mode: "landscape",
                    })}
                    media="(max-width: 480px)"
                    className="hidden"
                  />
                  <source
                    srcSet={buildImageUrl({
                      type: "speaker",
                      id: speaker.id,
                      mode: "portrait",
                    })}
                    media="(min-width: 481px)"
                    className="hidden"
                  />
                  <img
                    alt={`Bilde av ${speaker.name}`}
                    src={buildImageUrl({
                      type: "speaker",
                      id: speaker.id,
                      mode: "portrait",
                    })}
                    className="sm:h-70 aspect-[3/2] w-full rounded object-cover tablet:aspect-[2/3] tablet:h-60 tablet:w-auto"
                  />
                </picture>
              )}

              <div>
                <h2
                  className={classNames(
                    "tablet:font-primary break-words text-3xl font-semibold tracking-tight",
                  )}
                >
                  {speaker.name}
                </h2>

                <div className="mt-1 flex flex-col gap-1">
                  {speaker.role && (
                    <p className="text-base tablet:text-sm laptop:text-base">
                      {speaker.role}
                    </p>
                  )}
                  {speaker.company && <CompanyLogo company={speaker.company} />}
                </div>

                {speaker.bio && <p className="mt-4 max-w-xl">{speaker.bio}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </ContentBox>
  );
}
