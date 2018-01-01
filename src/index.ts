import NaverTracker from "./naverTracker";
const exampleCheckIn = new Date(2018, 3, 5);
const exampleCheckOut = new Date(2018, 3, 10);

const naverTracker = new NaverTracker(
  "인천",
  "타쉬켄트",
  exampleCheckIn,
  exampleCheckOut,
  2
);

naverTracker.getPrices();
