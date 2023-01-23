import { groupBy } from "~/utils/misc";
import type { Talk, Timeslot } from "./domain";

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

export const getFormattedTalkTimes = (talk: Talk) => {
  const { startTime, endTime } = getTalkTimes(talk);
  return {
    startTime: formattedHoursMinutes({
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
    }),
    endTime: formattedHoursMinutes({
      hours: endTime.getHours(),
      minutes: endTime.getMinutes(),
    }),
  };
};

/**
 * Get exact dates (day and time) for a timeslot
 * Since a timeslot only includes the clock time,
 * this needs to be calculated using the global conference date
 */
export const getTimeslotDates = (timeslot: Timeslot, date: Date) => {
  const startDate = new Date(date);
  startDate.setHours(startDate.getHours() + timeslot.startTime.hours);
  startDate.setMinutes(startDate.getMinutes() + timeslot.startTime.minutes);

  const endDate = new Date(date);
  endDate.setHours(endDate.getHours() + timeslot.endTime.hours);
  endDate.setMinutes(endDate.getMinutes() + timeslot.endTime.minutes);

  return { startDate, endDate };
};

export const getTimeslotDurationInMinutes = (timeslot: Timeslot) => {
  const { startDate, endDate } = getTimeslotDates(
    timeslot,
    new Date("2023-01-01"),
  );
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60);
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
