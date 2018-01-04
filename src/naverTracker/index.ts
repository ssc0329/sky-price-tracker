import * as puppeteer from "puppeteer";
import { BasicPriceTracker } from "../common/basicPriceSearch";

export default class NaverTracker extends BasicPriceTracker {
  private async getSearchResult() {
    await this.page.waitForSelector(".type_minimize", {
      visible: true,
    });
    await this.page.waitForSelector(".type_minimize", {
      visible: false,
    });
  }

  private async mapSearchResult() {
    // TODO: Map another attributes (Date, Airport, ...)
    const minPayText: string = await this.page.evaluate(() => document.querySelector(".txt_pay").textContent);
    const cleanMinPayString = minPayText.replace(/,/g, "");
    const minPay = parseInt(cleanMinPayString, 10);
    console.log("Naver minimum price", minPay);
    await this.page.screenshot({ path: "dst/naverExample.png" });

    return {
      minPay,
    };
  }

  private getFormatDate(date: Date) {
    const month = `0${date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${date.getFullYear()}.${month}.${day}.`;
  }

  private async getNaverSearchResultPage() {
    https: if (this.page) {
      await this.page.goto(
        `https://store.naver.com/flights/v2/results?trip=RT&scity1=${this.fromAirport}&ecity1=${
          this.toAirport
        }&scity2=${this.toAirport}&ecity2=${this.fromAirport}&adult=${
          this.adultCount
        }&child=0&infant=0&sdate1=${this.getFormatDate(this.checkInDate)}&sdate2=${this.getFormatDate(
          this.checkOutDate,
        )}&fareType=Y`,
      );
    } else {
      throw new Error("Had Error on loading Naver main page.");
    }
  }

  public async getPrices() {
    try {
      await this.setBrowser();
      await this.setNewPage();
      await this.getNaverSearchResultPage();
      await this.getSearchResult();
      return await this.mapSearchResult();
    } catch (err) {
      console.error(err);
      await this.page.screenshot({ path: "dst/naverError.png" });
    } finally {
      await this.closeBrowser();
    }
  }
}
