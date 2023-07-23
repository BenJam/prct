import { RepeatingRide, RideFormValues } from "src/types";
import { makeUtcDate } from "./dates";

export const flattenArrayNumber = (
  value?: number[] | number | null
): number | undefined => {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
};

export const makeRide = (formData: RideFormValues) => {
  const {
    name,
    date,
    time,
    group,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    notes,
    limit,
  } = formData;
  const utcDate = makeUtcDate(date, time);

  return {
    name,
    date: utcDate,
    group,
    destination,
    distance: +distance,
    leader,
    route,
    meetPoint,
    notes,
    limit,
  };
};

// Filter ride form with repeating information into a valid API request shape
export const makeRepeatingRide = (formData: RideFormValues): RepeatingRide => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    date, // Remove from object
    time,
    distance: distanceString,
    startDate,
    bymonthday,
    bysetpos,
    byweekday,
    freq: freqString,
    ...data
  } = formData;
  // Cast string form values to numbers / date
  const freq = +freqString;
  const distance = +distanceString;
  const weekday = byweekday || 5;
  const weekno = bysetpos || 1;
  const monthday = bymonthday || 1;
  // Concatenate time onto startDate, to ensure that all generated rides are correct
  const startDateWithTime = makeUtcDate(startDate, time);

  let payload: RepeatingRide = {
    freq,
    distance,
    startDate: startDateWithTime,
    ...data,
  };
  // Remove unwanted keys
  // Weekly - remove all monthly and annual values
  if (freq === 2) {
    payload = { ...payload, byweekday: +weekday };
  }
  // Monthly
  if (freq === 1) {
    if (bymonthday) {
      payload = { ...payload, bymonthday: +monthday };
    } else {
      payload = { ...payload, bysetpos: +weekno, byweekday: +weekday };
    }
  }

  // Convert to RRule
  return payload;
};
