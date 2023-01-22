import { groupBy } from "~/utils/misc";
import type { Conference, Talk, Timeslot } from "./domain";

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

/**
 * Get exact dates (day and time) for a timeslot
 * Since a timeslot only includes the clock time,
 * this needs to be calculated using the global conference date
 */
export const getTimeslotDates = (
  timeslot: Timeslot,
  conference: Conference,
) => {
  const startDate = new Date(conference.date);
  startDate.setHours(startDate.getHours() + timeslot.startTime.hours);
  startDate.setMinutes(startDate.getMinutes() + timeslot.startTime.minutes);

  const endDate = new Date(conference.date);
  endDate.setHours(endDate.getHours() + timeslot.endTime.hours);
  endDate.setMinutes(endDate.getMinutes() + timeslot.endTime.minutes);

  return { startDate, endDate };
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
