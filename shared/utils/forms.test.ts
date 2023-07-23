import { makeRepeatingRide } from "./forms";

const ride = {
  name: "xxx",
  group: "Used to be fast",
  limit: -1,
  meetPoint: "Brunel Square",
  distance: 123,
  destination: "Somewhere",
  route: "https://link-to-ride",
  leader: "Mark Fairhurst",
  notes: "Some info",
};

const weeklyRide = {
  ...ride,
  date: "2023-07-25",
  time: "08:30",
  bymonthday: 25,
  byweekday: 1,
  winterStartTime: "08:30",
  interval: 1,
  freq: 2,
  startDate: "2023-07-25",
  endDate: "",
};

const monthlyByDay = {
  ...ride,
  date: "2023-07-25",
  time: "08:30",
  byweekday: 1,
  winterStartTime: "09:30",
  interval: 1,
  freq: 1,
  startDate: "2023-07-25",
  endDate: "2023-12-31",
  bymonthday: 25,
};

const monthlyByWeek = {
  ...ride,
  date: "2023-07-25",
  time: "08:30",
  byweekday: 1,
  winterStartTime: "09:30",
  bysetpos: -1,
  interval: 1,
  freq: 1,
  startDate: "2023-07-25",
  endDate: "2023-12-31",
};

describe("Forms utility functions", () => {
  describe("Repeating ride forms", () => {
    it("correctly transforms a weekly repeating ride payload", () => {
      expect(makeRepeatingRide(weeklyRide)).toEqual({
        ...ride,
        winterStartTime: "08:30",
        byweekday: 1,
        interval: 1,
        freq: 2,
        startDate: "2023-07-25T08:30:00Z",
        endDate: "",
      });
    });

    it("correctly transforms a monthly repeating ride (by day) payload", () => {
      expect(makeRepeatingRide(monthlyByDay)).toEqual({
        ...ride,
        winterStartTime: "09:30",
        interval: 1,
        freq: 1,
        startDate: "2023-07-25T08:30:00Z",
        endDate: "2023-12-31",
        bymonthday: 25,
      });
    });

    it("correctly transforms a monthly repeating ride (by week) payload", () => {
      expect(makeRepeatingRide(monthlyByWeek)).toEqual({
        ...ride,
        byweekday: 1,
        winterStartTime: "09:30",
        bysetpos: -1,
        interval: 1,
        freq: 1,
        startDate: "2023-07-25T08:30:00Z",
        endDate: "2023-12-31",
      });
    });

    it("adds ride time to startDate when a different date (with no time) was chosen", () => {
      expect(
        makeRepeatingRide({ ...monthlyByWeek, startDate: "2023-09-01" })
          .startDate
      ).toEqual("2023-09-01T08:30:00Z");
    });
  });
});
