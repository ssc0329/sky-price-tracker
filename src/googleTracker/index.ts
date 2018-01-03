import * as puppeteer from "puppeteer";
import { BasicPriceTracker } from "../common/basicPriceSearch";

export default class GoogleTracker extends BasicPriceTracker {
  private async getSearchResult() {
    await this.page.waitForSelector("[elm=ii]", {
        visible: true
    });
  }

  private async mapSearchResult() {
    // TODO: Map another attributes (Date, Airport, ...)
    const minPayText: string = await this.page.evaluate(
      () => document.querySelector("[elm=il]").querySelector("[elm=p]").querySelector("div").textContent
    );
    const cleanMinPayString = minPayText.replace(/,/g, "").replace(/k/g, "000").replace(/₩/g, "");
    const minPay = parseInt(cleanMinPayString, 10);
    console.log(minPay);
    await this.page.screenshot({ path: "dst/example.png" });

    return {
      minPay
    };
  }

  private getFormatDate(date: Date) {
    const month = `0${date.getMonth()}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    return `${date.getFullYear()}-${month}-${day}`
  }

  private async getGoogleSearchResultPage() {
    if (this.page) {
      await this.page.goto(`https://www.google.com/flights/?curr=KRW#search;f=${this.fromAirport};t=${this.toAirport};d=${this.getFormatDate(this.checkInDate)};r=${this.getFormatDate(this.checkOutDate)};px=${this.adultCount}`);
    } else {
      throw new Error("Had Error on loading Google main page.");
    }
  }

  public async getPrices() {
    try {
      await this.setBrowser();
      await this.setNewPage();
      await this.getGoogleSearchResultPage()
      await this.getSearchResult();
      return await this.mapSearchResult();
    } catch (err) {
      console.error(err);
      await this.page.screenshot({ path: "dst/error.png" });
    } finally {
      await this.closeBrowser();
    }
  }
}
