import NaverTracker from "./naverTracker";
const exampleCheckIn = new Date(2018, 1, 4);
const exampleCheckOut = new Date(2018, 1, 7);

const naverTracker = new NaverTracker(
  "ICN",
  "HKG",
  exampleCheckIn,
  exampleCheckOut,
  2
);

naverTracker.getPrices();
