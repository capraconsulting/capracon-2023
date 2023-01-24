export enum Tracks {
  "Felles" = "Felles",
  "Frontend" = "Frontend",
  "Ledelse" = "Ledelse",
  "CloudNative" = "CloudNative",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.Frontend,
  Tracks.Ledelse,
  Tracks.CloudNative,
] as const;

export const TrackGridColumn: Record<Tracks, string> = {
  [Tracks.Felles]: "track1 / track4",
  [Tracks.Frontend]: "track1",
  [Tracks.Ledelse]: "track2",
  [Tracks.CloudNative]: "track3",
};

// Which tracks to show headings for
export const TRACK_HEADINGS = [
  Tracks.Frontend,
  Tracks.Ledelse,
  Tracks.CloudNative,
] as const;
