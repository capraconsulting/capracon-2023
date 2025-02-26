export const timeZone = "Europe/Oslo";

export enum Tracks {
  "Felles" = "Felles",
  "SjetteEtasje" = "6. etasje",
  "SyvendeEtasje" = "7. etasje",
  "ÅttendeEtasje" = "8. etasje",
}

export const TRACKS = [
  Tracks.Felles,
  Tracks.SjetteEtasje,
  Tracks.SyvendeEtasje,
  Tracks.ÅttendeEtasje,
] as const;

export const TrackGridColumn: Record<Tracks, string> = {
  [Tracks.Felles]: "track1 / track4",
  [Tracks.SjetteEtasje]: "track1",
  [Tracks.SyvendeEtasje]: "track2",
  [Tracks.ÅttendeEtasje]: "track3",
};

// Which tracks to show headings for
export const TRACK_HEADINGS = [
  Tracks.SjetteEtasje,
  Tracks.SyvendeEtasje,
  Tracks.ÅttendeEtasje,
] as const;

export const YEARS = ["2023", "2024"] as const;
