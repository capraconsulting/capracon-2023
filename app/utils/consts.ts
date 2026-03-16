export const timeZone = "Europe/Oslo";

export enum Tracks {
  "Felles" = "Felles",
  "Menneske" = "Menneske",
  "Maskin" = "Maskin",
  "Workshop" = "Workshop",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.Menneske,
  Tracks.Maskin,
  Tracks.Workshop,
] as const;

export const TrackGridColumn: Record<Tracks, string> = {
  [Tracks.Felles]: "track1 / track4",
  [Tracks.Menneske]: "track1",
  [Tracks.Maskin]: "track2",
  [Tracks.Workshop]: "track3",
};

// Which tracks to show headings for
export const TRACK_HEADINGS = [
  Tracks.Menneske,
  Tracks.Maskin,
  Tracks.Workshop,
] as const;

export const YEARS = ["2023", "2024", "2025", "2026"] as const;
