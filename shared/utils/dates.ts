import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Current local time
export const getNow = () => {
  const delta = dayjs().utcOffset();

  return dayjs().utc().add(delta, "minutes").toISOString();
};

// Determine whether a ride can be joined yet
// Allow join and leave up to 12 hours after ride starts
const JOIN_DELAY = 12; // 12 hours
export const isJoinable = (date: string) => {
  const latestChange = dayjs(date).add(JOIN_DELAY, "hour").toISOString();

  return getNow() < latestChange;
};

export const getDateFromString = (dateString: string, end?: boolean) => {
  const delta = dayjs().utcOffset();

  return end
    ? dayjs(dateString)
        .utc()

        .toISOString()
    : dayjs(dateString).utc().add(delta, "minutes").toISOString();
};

// Set ISO time in db; no offset calculation
export const makeUtcDate = (day: string, time: string): string =>
  dayjs(`${day}T${time}:00.000Z`).utc().format();

export const getNextWeek = () => {
  const nextWeek = dayjs().add(7, "day").toISOString();

  return nextWeek;
};

export const getNextTwoWeeks = () => {
  const nextWeek = dayjs().add(14, "day").toISOString();

  return nextWeek;
};

// Get next Day of Week
export const findNextDay = (day = 6, startInDays = 0) => {
  const today = dayjs().day();

  let delta = day - today;
  if (delta <= 0) {
    delta += 7;
  }

  delta += startInDays;
  return dayjs().add(delta, "day").toISOString();
};

export const getQueryDateRange = ({
  start,
  end,
}: {
  start?: string;
  end?: string;
}) => {
  // Show all rides until end of day
  const delta = dayjs().utcOffset();
  const now = dayjs()
    .utc()
    .set("hour", delta / 60)
    .set("minute", 0)
    .set("second", 0)
    .toISOString();

  const st = start ? getDateFromString(start) : now;
  // st.set("hour", 0);
  let en = end ? getDateFromString(end, true) : getNextTwoWeeks();

  // Set end of day on en
  en = dayjs(en)
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .toISOString();

  return { start: st, end: en };
};

export const isSaturday = (date: string) => dayjs(date).day() === 6;

export const formatDate = (date: string) =>
  dayjs(date).utc().format("dddd DD MMMM");

export const formatCalendarDate = (date: string) =>
  dayjs(date).utc().format("MMMM YYYY");

export const getDay = (date?: string): number => +(dayjs(date).date() || 1);

export const formatTime = (date: string) => dayjs(date).utc().format("HH:mm");

export const formatFormDate = (date: string = getNow()) =>
  dayjs(date).utc().format("YYYY-MM-DD");

export const getRideDateAndTime = (date: string) => ({
  day: formatDate(date),
  time: formatTime(date),
});

// Formatted for form inputs:
// date = "yyyy-mm-dd" and time = "hh:mm"
export const getFormRideDateAndTime = (date: string) => ({
  date: formatFormDate(date),
  time: formatTime(date),
});

// Calendar view helpers
export const getMonth = () => dayjs().month();

export const getLastMonth = (date?: string) =>
  dayjs(date).subtract(1, "month").toISOString();

export const getNextMonth = (date?: string) =>
  dayjs(date).add(1, "month").toISOString();

export const firstDayOfMonth = (date?: string) =>
  date ? dayjs(date).startOf("month").day() : dayjs().startOf("month").day();

export const daysInMonth = (date?: string) =>
  date ? dayjs(date).daysInMonth() : dayjs().daysInMonth();

// Winter is 01 Dec - end Feb
export const isWinter = (date: string): boolean => {
  const month = dayjs(date).month();

  return month > 10 || month < 2;
};

const getDateStub = (date: string) => {
  const parts = date.split("-");
  return `${parts[0]}-${parts[1]}`;
};

// Get start and end dates for a month view in planner
export const getMonthDateRange = (date: string) => {
  // Extract month and year from date
  const year = dayjs(date).year();
  const month = dayjs(date).month() + 1;
  const formattedMonth = month.toString().padStart(2, "0");
  let start = `${year}-${formattedMonth}-01`;
  let end = `${year}-${formattedMonth}-${dayjs(date).daysInMonth()}`;

  const startDay = firstDayOfMonth(date);
  const lastDay = daysInMonth(date);

  // If first day > 0 (Sunday) we need to include days from end of previous month
  if (startDay > 0) {
    const lastMonth = getLastMonth(date);
    const endOfLastMonth = daysInMonth(lastMonth);
    const day = endOfLastMonth - startDay + 1;

    start = `${getDateStub(lastMonth)}-${day.toString().padStart(2, "0")}`;
  }

  const remainder = (startDay + lastDay) % 7;

  if (remainder > 0) {
    const nextMonth = getNextMonth(date);
    const endDays = 7 - remainder;

    end = `${getDateStub(nextMonth)}-${endDays.toString().padStart(2, "0")}`;
  }

  return { start, end };
};

export const getDateInWeeks = (weeks: string) => {
  const weeksNumber = parseInt(weeks, 10);

  // Check for 'forever' code (-1) and return long future date
  if (weeksNumber === -1) {
    return "3000-12-31";
  }

  const nextWeek = dayjs().add(weeksNumber, "week").toISOString();

  return nextWeek.split("T")[0];
};

export const sqlDate = (date: string) => date.replace("T", " ").slice(0, 16);

// Get day of week (integer) in RRule format
// Monday = 0, instead of Sunday
export const rruleDay = (date?: string) => {
  const day = date ? new Date(date).getDay() - 1 : new Date().getDay() - 1;

  return day < 0 ? 7 + day : day;
};

export const rruleDaysInMonth = (month: number) => {
  const mm = month.toString().padStart(2, "0");
  const date = `2023-${mm}-01T00:00:00.000Z`;

  return dayjs(date).daysInMonth();
};
