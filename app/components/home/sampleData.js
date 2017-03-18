// Create sample events that have dates that are in the past, present and future
const nowDate = new Date();
const futureDate = new Date();
const pastDate = new Date();
futureDate.setHours(nowDate.getHours() + 48);
pastDate.setHours(nowDate.getHours() - 48);

const sampleEvents = [
  {
    name: 'New Year Wild Party',
    dateObj: nowDate,
    date: nowDate.toDateString(),
    venue: 'Adam\'s House',
    description: 'Party all night at Pasir Ris!',
  },
  {
    name: 'Geek Meet',
    dateObj: nowDate,
    date: nowDate.toDateString(),
    venue: 'Tanjung Pagar',
    description: 'Anime, Manga fans and that-weirdo-in-the-corner meeting.',
  },
  {
    name: 'Food Trail',
    dateObj: futureDate,
    date: futureDate.toDateString(),
    venue: 'Bedok',
    description: 'Eat till you drop!',
  },
  {
    name: 'IT Fair',
    dateObj: futureDate,
    date: futureDate.toDateString(),
    venue: 'Geylang',
    description: 'Cheap IT goods for sale!',
  },
  {
    name: 'STePS',
    dateObj: pastDate,
    date: pastDate.toDateString(),
    venue: 'NUS',
    description: 'Students showcase their projects they have done in that semester',
  },
  {
    name: 'Ku Klux Klan Bonfire',
    dateObj: pastDate,
    date: pastDate.toDateString(),
    venue: 'NUS',
    description: 'Halloween Event for NUS students and alumni',
  },
  {
    name: 'Mobile Gaming Conferences',
    dateObj: nowDate,
    date: nowDate.toDateString(),
    venue: 'NUS',
    description: 'For all gamers out there!',
  },
  {
    name: 'Cyber Security Convection',
    dateObj: futureDate,
    date: futureDate.toDateString(),
    venue: 'NUS',
    description: 'Mark Zuckerberg and Bill Gates will be attending!',
  },
  {
    name: 'Game Developers Conference 2017',
    dateObj: pastDate,
    date: pastDate.toDateString(),
    venue: 'NUS',
    description: 'See all the new tools at your disposal',
  },
  {
    name: 'CES 2017',
    dateObj: nowDate,
    date: nowDate.toDateString(),
    venue: 'NUS',
    description: 'Cool Gadgets Galore',
  },
  {
    name: 'WWDC 2017',
    dateObj: futureDate,
    date: futureDate.toDateString(),
    venue: 'NUS',
    description: 'New iPhone? Maybe? Come join us!',
  },
];

const sampleAttendance = [
  {
    name: 'New Year Wild Party',
  },
  {
    name: 'STePS',
  },
  {
    name: 'IT Fair',
  },
];

export { sampleEvents, sampleAttendance, nowDate, futureDate, pastDate };
