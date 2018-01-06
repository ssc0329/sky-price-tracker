import * as _ from "lodash";
import NaverTracker from "./naverTracker";
import GoogleTracker from "./googleTracker";
import SkyScannerTracker from "./skyScannerTarcker";
import PriceTicketManager, { PriceTicketParams } from "./model/priceTicket";
import { PriceResult } from "./common/basicPriceSearch";

const exampleFromAirport = "ICN";
const exampleToAirport = "HKG";
const exampleCheckIn = new Date(2018, 3, 10);
const exampleCheckOut = new Date(2018, 3, 17);

const naverTracker = new NaverTracker(exampleFromAirport, exampleToAirport, exampleCheckIn, exampleCheckOut, 2);
const googleTracker = new GoogleTracker(exampleFromAirport, exampleToAirport, exampleCheckIn, exampleCheckOut, 2);
const skyScannerTracker = new SkyScannerTracker(
  exampleFromAirport,
  exampleToAirport,
  exampleCheckIn,
  exampleCheckOut,
  2,
);

function getMinimumPrice(ticketArray: PriceResult[]): PriceResult {
  const sortedArray = _.sortBy(ticketArray, ["minPrice"]);
  console.log(sortedArray);
  return sortedArray[0];
}

async function saveMinPriceToDynamoDB(params: PriceTicketParams) {
  const priceTicketManager = new PriceTicketManager();
  try {
    await priceTicketManager.saveNewTicket(params);
  } catch (err) {
    console.error("Failed to save price data to AWS DynamoDB", err);
  }
}

(async () => {
  const priceSearchPromiseArray = [naverTracker.getPrices(), googleTracker.getPrices(), skyScannerTracker.getPrices()];
  const prices = await Promise.all(priceSearchPromiseArray);
  const minPriceResult = getMinimumPrice(prices);

  await saveMinPriceToDynamoDB({
    fromAirport: exampleFromAirport,
    toAirport: exampleToAirport,
    minPrice: minPriceResult.minPrice,
    departTime: exampleCheckIn,
    arriveTime: exampleCheckOut,
    fromSite: minPriceResult.from,
  });
})();
