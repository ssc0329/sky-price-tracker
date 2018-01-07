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
class NaverTracker extends basicPriceSearch_1.BasicPriceTracker {
    getSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector(".type_minimize", {
                visible: true,
            });
            yield this.page.waitForSelector(".type_minimize", {
                visible: false,
            });
        });
    }
    mapSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const minPayText = yield this.page.evaluate(() => document.querySelector(".txt_pay").textContent);
            const cleanMinPayString = minPayText.replace(/,/g, "");
            const minPay = parseInt(cleanMinPayString, 10);
            console.log("Naver minimum price", minPay);
            yield this.page.screenshot({ path: "dst/naverExample.png" });
            return {
                minPrice: minPay,
                from: "naver filght",
                link: this.urlAddress,
            };
        });
    }
    getFormatDate(date) {
        const month = `0${date.getMonth()}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${date.getFullYear()}.${month}.${day}.`;
    }
    setDestinationUrl() {
        this.urlAddress = `https://store.naver.com/flights/v2/results?trip=RT&scity1=${this.fromAirport}&ecity1=${this.toAirport}&scity2=${this.toAirport}&ecity2=${this.fromAirport}&adult=${this.adultCount}&child=0&infant=0&sdate1=${this.getFormatDate(this.checkInDate)}&sdate2=${this.getFormatDate(this.checkOutDate)}&fareType=Y`;
    }
    getNaverSearchResultPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.goto(this.urlAddress);
            }
            else {
                throw new Error("Had Error on loading Naver main page.");
            }
        });
    }
    getPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.setBrowser();
                yield this.setNewPage();
                this.setDestinationUrl();
                yield this.getNaverSearchResultPage();
                yield this.getSearchResult();
                return yield this.mapSearchResult();
            }
            catch (err) {
                console.error(err);
                yield this.page.screenshot({ path: "dst/naverError.png" });
            }
            finally {
                yield this.closeBrowser();
            }
        });
    }
}
exports.default = NaverTracker;
//# sourceMappingURL=index.js.map