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
      <Title as="h1" withBackground>
        Foredragsholdere
      </Title>
      <div className="flex flex-col gap-6 tablet:gap-12">
        {sortedSpeakers.map((speaker) => (
          <article
            className="scroll-m-6 bg-white p-4 pb-6 text-black shadow-md tablet:scroll-m-12 laptop:max-w-5xl laptop:px-6 laptop:pt-6 laptop:pb-8"
            key={speaker.id}
            id={slugify(speaker.name)}
          >
            <h2
              className={classNames(
                "break-words text-3xl font-semibold tracking-tight tablet:font-black",
              )}
            >
              {speaker.name}
            </h2>

            <div className="mt-3" />

            <div className="flex flex-row gap-4">
              {speaker.image && (
                <img
                  alt={`Bilde av ${speaker.name}`}
                  src={buildImageUrl({
                    type: "speaker",
                    id: speaker.id,
                    mode: "portrait",
                  })}
                  className="h-60 w-40 rounded object-cover"
                />
              )}

              <p>{speaker.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
