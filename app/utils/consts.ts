export const timeZone = "Europe/Oslo";

export enum Tracks {
  "Felles" = "Felles",
  "Frontend" = "Frontend",
  "Ledelse" = "Teknologiledelse",
  "Cloud" = "Cloud / Backend / Plattform",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.Frontend,
  Tracks.Ledelse,
  Tracks.Cloud,
] as const;

export const TrackGridColumn: Record<Tracks, string> = {
  [Tracks.Felles]: "track1 / track4",
  [Tracks.Frontend]: "track1",
  [Tracks.Ledelse]: "track2",
  [Tracks.Cloud]: "track3",
};

// Which tracks to show headings for
export const TRACK_HEADINGS = [
  Tracks.Frontend,
  Tracks.Ledelse,
  Tracks.Cloud,
] as const;

export const YEARS = ["2023", "2024"] as const;
