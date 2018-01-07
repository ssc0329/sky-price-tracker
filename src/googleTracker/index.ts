import * as puppeteer from "puppeteer";
import { BasicPriceTracker, PriceResult } from "../common/basicPriceSearch";

export default class GoogleTracker extends BasicPriceTracker {
  private async getSearchResult() {
    await this.page.waitForSelector("[elm=ii]", {
      visible: true,
    });
  }

  private parsePayText(minPayText: string) {
    return minPayText
      .replace(/,/g, "")
      .replace(/k/g, "000")
      .replace(/₩/g, "");
  }

  private async mapSearchResult() {
    // TODO: Map another attributes (Date, Airport, ...)
    const minPayText: string = await this.page.evaluate(
      () =>
        document
          .querySelector("[elm=il]")
          .querySelector("[elm=p]")
          .querySelector("div").textContent,
    );

    const minPay = parseInt(this.parsePayText(minPayText), 10) / this.adultCount;
    console.log("google minimum price", minPay);
    await this.page.screenshot({ path: "dst/googleResult.png" });

    return {
      minPrice: minPay,
      from: "google flight",
      link: this.urlAddress,
    };
  }

  private getFormatDate(date: Date) {
    const month = `0${date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private setDestinationUrl() {
    this.urlAddress = `https://www.google.com/flights/?curr=KRW#search;f=${this.fromAirport};t=${
      this.toAirport
    };d=${this.getFormatDate(this.checkInDate)};r=${this.getFormatDate(this.checkOutDate)};px=${this.adultCount}`;
  }

  private async getGoogleSearchResultPage() {
    if (this.page) {
      await this.page.goto(this.urlAddress);
    } else {
      throw new Error("Had Error on loading Google main page.");
    }
  }

  public async getPrices(): Promise<PriceResult> {
    try {
      await this.setBrowser();
      await this.setNewPage();
      this.setDestinationUrl();
      await this.getGoogleSearchResultPage();
      await this.getSearchResult();
      return await this.mapSearchResult();
    } catch (err) {
      console.error(err);
      await this.page.screenshot({ path: "dst/googleError.png" });
    } finally {
      await this.closeBrowser();
    }
  }
}
