import { Title } from "~/components/title";
import { slugify } from "~/notion/helpers";
import { useRootData } from "~/root";
import { classNames } from "~/utils/misc";
import { buildImageUrl } from "./api.image-optimized";

export default function Component() {
  const { speakers } = useRootData();
  const sortedSpeakers = speakers.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return (
    <main className="container mx-auto">
      <Title
        as="h1"
        withBackground
        size="text-4xl"
        className="tablet:text-5xl sm:text-6xl"
      >
        Foredragsholdere
      </Title>
      <div className="flex flex-col gap-6 tablet:gap-12">
        {sortedSpeakers.map((speaker) => (
          <article
            className="scroll-m-6 bg-white p-4 pb-6 text-black shadow-md tablet:scroll-m-12 laptop:max-w-5xl laptop:px-6 laptop:pt-6 laptop:pb-8"
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

              <div className="flex flex-col gap-2">
                <h2
                  className={classNames(
                    "break-words text-3xl font-semibold tracking-tight tablet:font-black",
                  )}
                >
                  {speaker.name}
                </h2>

                <p>{speaker.bio}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
