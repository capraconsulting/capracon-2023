import { groupBy } from "~/utils/misc";
import type { Conference, Talk, Timeslot } from "./domain";

export const getTalksByTimeslot = (talks: Talk[]) =>
  groupBy(talks, ({ timeslot }) => timeslot.id);

export const getTalksByTrack = (talks: Talk[]) =>
  groupBy(talks, ({ track }) => track.id);

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
