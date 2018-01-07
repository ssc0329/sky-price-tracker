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
class SkyScannerTracker extends basicPriceSearch_1.BasicPriceTracker {
    getSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector(".bpk-ticket__paper", {
                visible: true,
            });
        });
    }
    mapSearchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const minPayText = yield this.page.evaluate(() => document.querySelector(".fqs-price").textContent);
            const numberOnlyRegExp = /\D+/g;
            const cleanMinPayString = minPayText.replace(numberOnlyRegExp, "");
            const minPay = parseInt(cleanMinPayString, 10);
            console.log("SkyScanner minimum price", minPay);
            yield this.page.screenshot({ path: "dst/skyScannerExample.png" });
            return {
                minPrice: minPay,
                from: "skyScanner",
                link: this.urlAddress,
            };
        });
    }
    getFormatDate(date) {
        const year = date
            .getFullYear()
            .toString()
            .slice(2, 4);
        const month = `0${date.getMonth()}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}${month}${day}`;
    }
    setDestinationUrl() {
        this.urlAddress = `https://www.skyscanner.co.kr/transport/flights/${this.fromAirport}/${this.toAirport}/${this.getFormatDate(this.checkInDate)}/${this.getFormatDate(this.checkOutDate)}?adults=${this.adultCount}&children=0&adultsv2=${this.adultCount}&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=day-view#results`;
    }
    getSearchResultPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.goto(this.urlAddress);
            }
            else {
                throw new Error("Had Error on loading SkyScanner page.");
            }
        });
    }
    getPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.setBrowser();
                yield this.setNewPage();
                this.setDestinationUrl();
                yield this.getSearchResultPage();
                yield this.getSearchResult();
                return yield this.mapSearchResult();
            }
            catch (err) {
                console.error(err);
                yield this.page.screenshot({ path: "dst/skyScannerError.png" });
            }
            finally {
                yield this.closeBrowser();
            }
        });
    }
}
exports.default = SkyScannerTracker;
//# sourceMappingURL=index.js.map