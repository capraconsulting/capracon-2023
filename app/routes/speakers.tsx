import { ContentBox } from "~/components/content-box";
import { Title } from "~/components/title";
import { slugify } from "~/notion/helpers";
import { useRootData } from "~/root";
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
      {sortedSpeakers.map((speaker) => (
        <ContentBox key={speaker.id} id={slugify(speaker.name)}>
          <h2>{speaker.name}</h2>

          {speaker.image && (
            <img
              alt={`Bilde av ${speaker.name}`}
              src={buildImageUrl({ type: "speaker", id: speaker.id })}
              className="h-20 w-20 object-cover"
            />
          )}

          <p>{speaker.bio}</p>
        </ContentBox>
      ))}
    </main>
  );
}
