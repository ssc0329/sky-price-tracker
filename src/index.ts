import NaverTracker from "./naverTracker";
import GoogleTracker from "./googleTracker";
const exampleCheckIn = new Date(2018, 3, 10);
const exampleCheckOut = new Date(2018, 3, 17);

const naverTracker = new NaverTracker("ICN", "HKG", exampleCheckIn, exampleCheckOut, 2);

naverTracker.getPrices();

const googleTracker = new GoogleTracker("ICN", "HKG", exampleCheckIn, exampleCheckOut, 2);

googleTracker.getPrices();
