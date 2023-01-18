export enum Tracks {
  "Felles" = "Felles",
  "TPU" = "TPU",
  "Frontend" = "Frontend",
  "CloudNative" = "CloudNative",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.TPU,
  Tracks.Frontend,
  Tracks.CloudNative,
] as const;

export const TrackGridColumn = {
  [Tracks.Frontend]: "track1",
  [Tracks.TPU]: "track2",
  [Tracks.CloudNative]: "track3",
  [Tracks.Felles]: "track1 / track4",
};
