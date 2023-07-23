Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Set next saturday and sunday dates for rides
const today = new Date();
today.setSeconds(0);
const dayOfWeek = today.getDay();

// Saturday rides: dayOfWeek === 6
const deltaToSaturday = 6 - dayOfWeek;
const saturday = today.addDays(deltaToSaturday);
saturday.setMinutes(0);
saturday.setHours(8);
const nextSaturday = saturday.toISOString();

// Sunday rides
const sunday = saturday.addDays(1);
sunday.setMinutes(30);
const nextSunday = sunday.toISOString();

const rides = [
  {
    name: "Sunday Ride",
    group: "DE",
    destination: "Cheddar",
    date: nextSunday,
    distance: 112,
    route: "https://ridegps.com/111111",
    leader: "David Stoyle",
  },
  {
    name: "Sunday Ride",
    group: "E",
    destination: "Cheddar",
    date: nextSunday,
    distance: 103,
    route: "https://ridegps.com/222222",
    leader: "David Oliver",
  },
  {
    name: "Sunday Ride",
    group: "DSL",
    destination: "Cheddar",
    date: nextSunday,
    distance: 90,
    route: "https://ridegps.com/333333",
    leader: "Michael Duble",
  },
  {
    name: "Sunday Ride",
    group: "A",
    destination: "Chew Magna",
    date: nextSunday,
    distance: 82,
    route: "https://ridegps.com/444444",
    leader: "Andy Mericano",
  },
  {
    name: "Sunday Ride",
    group: "C",
    destination: "Cheddar",
    date: nextSunday,
    distance: 78,
    route: "https://ridegps.com/555555",
    leader: "Julia Stoyle",
  },
  {
    name: "Paceline",
    group: "UBER",
    date: nextSaturday,
    distance: 70,
    speed: 39,
  },
  {
    name: "Paceline",
    group: "FAST1",
    date: nextSaturday,
    distance: 70,
    speed: 36,
  },
  {
    name: "Paceline",
    group: "FAST2",
    date: nextSaturday,
    distance: 70,
    speed: 34,
  },
  {
    name: "Paceline",
    group: "Mods",
    date: nextSaturday,
    distance: 70,
    speed: 29,
  },
  {
    name: "Paceline",
    group: "Rockers",
    date: nextSaturday,
    distance: 70,
    speed: 27,
  },
  {
    name: "Saturday Social",
    group: "Slow",
    date: nextSaturday,
    distance: 52,
    destination: "Sherston",
    route: "https://route-link",
  },
];

module.exports = { rides };
