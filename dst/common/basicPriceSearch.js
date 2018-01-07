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
const puppeteer = require("puppeteer");
const LINUX_CHROME_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36";
class BasicPriceTracker {
    constructor(_fromAirport, _toAirport, _checkInDate, _checkOutDate, _adultCount) {
        this._fromAirport = _fromAirport;
        this._toAirport = _toAirport;
        this._checkInDate = _checkInDate;
        this._checkOutDate = _checkOutDate;
        this._adultCount = _adultCount;
    }
    get page() {
        return this._page;
    }
    set page(newPage) {
        this._page = newPage;
    }
    get fromAirport() {
        return this._fromAirport;
    }
    get toAirport() {
        return this._toAirport;
    }
    get checkInDate() {
        return this._checkInDate;
    }
    get checkOutDate() {
        return this._checkOutDate;
    }
    get adultCount() {
        return this._adultCount;
    }
    set urlAddress(url) {
        this._urlAddress = url;
    }
    get urlAddress() {
        return this._urlAddress;
    }
    setHumanUserAgent() {
        this.page.setUserAgent(LINUX_CHROME_USER_AGENT);
    }
    setBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        });
    }
    setNewPage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.page = yield this.browser.newPage();
            this.setHumanUserAgent();
        });
    }
    closeBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
}
exports.BasicPriceTracker = BasicPriceTracker;
//# sourceMappingURL=basicPriceSearch.js.map