"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const naverTracker_1 = require("./naverTracker");
const googleTracker_1 = require("./googleTracker");
const skyScannerTarcker_1 = require("./skyScannerTarcker");
const priceTicket_1 = require("./model/priceTicket");
const cron = require("node-cron");
const exampleFromAirport = "ICN";
const exampleToAirport = "TAS";
const exampleCheckIn = new Date(2018, 3, 1);
const exampleCheckOut = new Date(2018, 3, 7);
const naverTracker = new naverTracker_1.default(exampleFromAirport, exampleToAirport, exampleCheckIn, exampleCheckOut, 2);
const googleTracker = new googleTracker_1.default(exampleFromAirport, exampleToAirport, exampleCheckIn, exampleCheckOut, 2);
const skyScannerTracker = new skyScannerTarcker_1.default(exampleFromAirport, exampleToAirport, exampleCheckIn, exampleCheckOut, 2);
function getMinimumPrice(ticketArray) {
    const sortedArray = _.sortBy(ticketArray, ["minPrice"]);
    console.log(sortedArray);
    return sortedArray[0];
}
function saveMinPriceToDynamoDB(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const priceTicketManager = new priceTicket_1.default();
        try {
            yield priceTicketManager.saveNewTicket(params);
        }
        catch (err) {
            console.error("Failed to save price data to AWS DynamoDB", err);
        }
    });
}
function searchPriceAndSaveIt() {
    return __awaiter(this, void 0, void 0, function* () {
        const priceSearchPromiseArray = [naverTracker.getPrices(), googleTracker.getPrices(), skyScannerTracker.getPrices()];
        const prices = yield Promise.all(priceSearchPromiseArray);
        const minPriceResult = getMinimumPrice(prices);
        yield saveMinPriceToDynamoDB({
            fromAirport: exampleFromAirport,
            toAirport: exampleToAirport,
            minPrice: minPriceResult.minPrice,
            departTime: exampleCheckIn,
            arriveTime: exampleCheckOut,
            fromSite: minPriceResult.from,
            link: minPriceResult.link,
        });
    });
}
cron.schedule("*/1 * * * *", () => __awaiter(this, void 0, void 0, function* () {
    for (let i = 0; i < 30; i++) {
        yield searchPriceAndSaveIt();
        exampleCheckIn.setDate(exampleCheckIn.getDate() + 1);
        exampleCheckOut.setDate(exampleCheckOut.getDate() + 1);
    }
    console.log("running a task every minutes");
}));
//# sourceMappingURL=index.js.map