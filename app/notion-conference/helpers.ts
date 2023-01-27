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
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

const getTalkTimes = (talk: Talk) => {
  const startTime = new Date(talk.startTime);
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + talk.duration.minutes);
  return { startTime, endTime };
};

// Format using Intl.DateTimeFormat with the correct timezone to ensure
// same format on server as in browser
const talkTimeFormatter = new Intl.DateTimeFormat("no-nb", {
  timeZone,
  hour: "2-digit",
  minute: "2-digit",
});
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
