/* eslint-disable @typescript-eslint/no-unused-vars */
import { RRule } from "rrule";
import { RepeatingRideDb, RepeatingRide, TemplateRide } from "src/types";
import { daysInMonth, getNextMonth, isWinter } from "./dates";

export const convertToRRule = (data: RepeatingRide): string => {
  const {
    freq,
    interval = 1,
    startDate,
    endDate,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
  } = data;

  const dtstart = new Date(startDate);
  const until = endDate ? new Date(endDate) : undefined;

  const rrule = new RRule({
    freq,
    interval,
    byweekday, // 0 == RRule.MO
    bysetpos,
    bymonth,
    bymonthday,
    dtstart,
    until,
  });

  return rrule.toString();
};

export const updateRRuleStartDate = (schedule: string, startDate?: string) => {
  if (!startDate) {
    return schedule;
  }

  // Convert rrule back into editable variables
  const rrule = RRule.fromString(schedule);
  const {
    freq,
    interval,
    byweekday, // 0 == RRule.MO
    bysetpos,
    bymonth,
    bymonthday,
    until,
  } = rrule.options;
  // Add one day to start date
  const dtstart = new Date(startDate.valueOf());
  dtstart.setDate(dtstart.getDate() + 1);

  // Update start date
  const updatedSchedule = new RRule({
    freq,
    dtstart,
    until,
    interval,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
  });

  return updatedSchedule.toString();
};

export const repeatingRideToDb = (ride: RepeatingRide): RepeatingRideDb => {
  const {
    freq,
    interval,
    startDate,
    endDate,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    ...rest
  } = ride;
  const schedule = convertToRRule(ride);

  return {
    schedule,
    ...rest,
  };
};

export const repeatingRideFromDb = (ride: RepeatingRideDb): RepeatingRide => {
  const { schedule, ...rest } = ride;
  // Convert rrule back into editable variables
  const rrule = RRule.fromString(schedule);
  const textRule = rrule.toText();

  const {
    freq,
    interval,
    dtstart,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    until,
  } = rrule.options;

  return {
    ...rest,
    freq,
    interval,
    startDate: new Date(dtstart).toISOString(),
    endDate: until ? new Date(until).toISOString() : null,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    textRule,
  };
};

export const changeToWinterTime = (
  dateTime: Date,
  winterStartTime: string
): string => {
  const dateString = dateTime.toISOString();

  if (!isWinter(dateString)) {
    return dateString;
  }

  const [hours, minutes] = winterStartTime.split(":");

  if (hours) {
    dateTime.setHours(+hours);
  }
  if (minutes) {
    dateTime.setMinutes(+minutes);
  }

  return dateTime.toISOString();
};

// Generate ride for a given template and date
export const generateRide = (
  {
    id,
    name,
    destination,
    group,
    distance,
    meetPoint,
    route,
    leader,
    speed,
    notes,
    limit,
  }: RepeatingRideDb,
  date: string
) => {
  const ride = {
    name,
    date,
    destination,
    group,
    distance,
    meetPoint,
    route,
    leader,
    speed,
    notes,
    limit,
    scheduleId: id,
  };

  return Object.fromEntries(
    Object.entries(ride).filter(([, val]) => val)
  ) as unknown as TemplateRide;
};

export type RideSet = {
  id?: string;
  schedule: string;
  rides: TemplateRide[];
};

export const makeRidesInPeriod = (template: RepeatingRideDb): RideSet => {
  const { id, schedule } = template;
  const start = new Date();
  const nextMonth = getNextMonth();
  const lastDay = daysInMonth(nextMonth);
  const end = new Date(`${nextMonth.substring(0, 8)}${lastDay.toString()}`);
  const rideDates = RRule.fromString(schedule).between(start, end);

  // Update timings if winterStartTime is set
  const rides =
    typeof template.winterStartTime === "string"
      ? rideDates.map((r) =>
          generateRide(
            template,
            changeToWinterTime(r, template.winterStartTime as string)
          )
        )
      : rideDates.map((r) => generateRide(template, r.toISOString()));

  return {
    id,
    schedule,
    rides,
  };
};
