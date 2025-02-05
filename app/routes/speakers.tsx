import type { V2_MetaFunction } from "@remix-run/cloudflare";

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
    <main className="mx-auto min-h-[90vh] p-4 sm:max-w-[1200px] sm:px-12">
      <Title as="h1" size="text-4xl" className="text-4xl tablet:text-5xl">
        {conference.foredragsholdereTitle}
      </Title>
      <div className="flex flex-col gap-6 tablet:gap-12">
        {sortedSpeakers.map((speaker) => (
          <article
            className="relative rounded-md border border-gray-200 bg-white px-3 py-4  dark:border-zinc-800 dark:bg-zinc-800 laptop:px-6 laptop:pb-8 laptop:pt-6"
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
                    className="sm:h-70 aspect-[3/2] w-full rounded object-cover grayscale tablet:aspect-[2/3] tablet:h-60 tablet:w-auto"
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
                  <span className="flex dark:hidden">
                    {speaker.company && (
                      <span className="text-base tablet:text-sm laptop:text-base">
                        {speaker.company.trim() === "Capra" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/capra.webp"
                          />
                        ) : speaker.company.trim() === "Liflig" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/liflig.webp"
                          />
                        ) : speaker.company.trim() === "Fryde" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/fryde.webp"
                          />
                        ) : (
                          speaker.company
                        )}
                      </span>
                    )}
                  </span>
                  <span className="hidden dark:flex">
                    {speaker.company && (
                      <span className="text-base tablet:text-sm laptop:text-base">
                        {speaker.company.trim() === "Capra" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/capra-dark.webp"
                          />
                        ) : speaker.company.trim() === "Liflig" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/liflig-dark.webp"
                          />
                        ) : speaker.company.trim() === "Fryde" ? (
                          <img
                            className="h-[21px]"
                            alt={speaker.company}
                            src="/fryde-dark.webp"
                          />
                        ) : (
                          speaker.company
                        )}
                      </span>
                    )}
                  </span>
                </div>

                {speaker.bio && <p className="mt-2 max-w-xl">{speaker.bio}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
