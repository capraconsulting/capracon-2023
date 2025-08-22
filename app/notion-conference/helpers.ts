import { timeZone } from "~/utils/consts";
import { groupBy } from "~/utils/misc";
import type { Talk } from "./domain";

export const getTalksByTimeslot = (talks: Talk[]) =>
  groupBy(talks, ({ timeslot }) => timeslot.id);

export const getTalksByTrack = (talks: Talk[]) =>
  groupBy(talks, ({ track }) => track.id);

export const sortedTalksByStartTime = (talks: Talk[]) =>
  talks
    .slice()
    ?.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

const getTalkTimes = (talk: Talk) => {
  const startTime = new Date(talk.startTime);
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + talk.duration.minutes);
  return { startTime, endTime };
};

// Formatter for talk start/end times.
// Previous implementation used `new Intl?.dateTimeFormat` (lowercase "d") which
// produced `(intermediate value) is not a constructor` in the Cloudflare runtime.
// We use the correct `Intl.DateTimeFormat` API and provide a graceful fallback
// in case the runtime lacks the locale or timeZone support.
const talkTimeFormatter: { format: (d: Date) => string } = (() => {
  try {
    // Use a canonical Norwegian locale. `nb-NO` is preferred; fall back handled by runtime.
    const fmt = new Intl.DateTimeFormat("nb-NO", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });
    return fmt;
  } catch {
    // Very small fallback: derive HH:MM in the specified timezone is not handled here;
    // we just return UTC substring to avoid crashing. Adjust if precise TZ formatting needed.
    return {
      format: (d: Date) => d.toISOString().substring(11, 16),
    };
  }
})();
export const getFormattedTalkTimes = (talk: Talk) => {
  const { startTime, endTime } = getTalkTimes(talk);
  return {
    startTime: talkTimeFormatter.format(startTime).split(":").join(""),
    endTime: talkTimeFormatter.format(endTime).split(":").join(""),
  };
};
export const getFormattedTalkTimesAlt = (talk: Talk) => {
  const { startTime, endTime } = getTalkTimes(talk);
  return {
    startTime: talkTimeFormatter.format(startTime),
    endTime: talkTimeFormatter.format(endTime),
  };
};

/**
 * Format an { hours, minutes } object
 *
 * { hours: 9, minutes: 45 } -> "0945"
 * { hours: 11, minutes: 0 } -> "1100"
 */
export const formattedHoursMinutes = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}) => String(hours).padStart(2, "0") + String(minutes).padStart(2, "0");

/**
 * Format an { hours, minutes } object
 *
 * { hours: 9, minutes: 45 } -> "09:45"
 * { hours: 11, minutes: 0 } -> "11:00"
 */
export const formattedHoursMinutesAlt = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}) => String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
