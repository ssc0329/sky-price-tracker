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
const basicPriceSearch_1 = require("../common/basicPriceSearch");
class GoogleTracker extends basicPriceSearch_1.BasicPriceTracker {
    getSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector("[elm=ii]", {
                visible: true,
            });
        });
    }
    parsePayText(minPayText) {
        return minPayText
            .replace(/,/g, "")
            .replace(/k/g, "000")
            .replace(/₩/g, "");
    }
    mapSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const minPayText = yield this.page.evaluate(() => document
                .querySelector("[elm=il]")
                .querySelector("[elm=p]")
                .querySelector("div").textContent);
            const minPay = parseInt(this.parsePayText(minPayText), 10) / this.adultCount;
            console.log("google minimum price", minPay);
            yield this.page.screenshot({ path: "dst/googleResult.png" });
            return {
                minPrice: minPay,
                from: "google flight",
                link: this.urlAddress,
            };
        });
    }
    getFormatDate(date) {
        const month = `0${date.getMonth()}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${date.getFullYear()}-${month}-${day}`;
    }
    setDestinationUrl() {
        this.urlAddress = `https://www.google.com/flights/?curr=KRW#search;f=${this.fromAirport};t=${this.toAirport};d=${this.getFormatDate(this.checkInDate)};r=${this.getFormatDate(this.checkOutDate)};px=${this.adultCount}`;
    }
    getGoogleSearchResultPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.goto(this.urlAddress);
            }
            else {
                throw new Error("Had Error on loading Google main page.");
            }
        });
    }
    getPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.setBrowser();
                yield this.setNewPage();
                this.setDestinationUrl();
                yield this.getGoogleSearchResultPage();
                yield this.getSearchResult();
                return yield this.mapSearchResult();
            }
            catch (err) {
                console.error(err);
                yield this.page.screenshot({ path: "dst/googleError.png" });
            }
            finally {
                yield this.closeBrowser();
            }
        });
    }
}
exports.default = GoogleTracker;
//# sourceMappingURL=index.js.map