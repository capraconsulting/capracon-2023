export enum Tracks {
  "Felles" = "Felles",
  "Frontend" = "Frontend",
  "TPU" = "TPU",
  "CloudNative" = "CloudNative",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.Frontend,
  Tracks.TPU,
  Tracks.CloudNative,
] as const;

export const TrackGridColumn: Record<Tracks, string> = {
  [Tracks.Felles]: "track1 / track4",
  [Tracks.Frontend]: "track1",
  [Tracks.TPU]: "track2",
  [Tracks.CloudNative]: "track3",
};

// Which tracks to show headings for
export const TRACK_HEADINGS = [
  Tracks.Frontend,
  Tracks.TPU,
  Tracks.CloudNative,
] as const;
