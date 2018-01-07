import { BasicPriceTracker, PriceResult } from "../common/basicPriceSearch";

export default class SkyScannerTracker extends BasicPriceTracker {
  private async getSearchResult() {
    await this.page.waitForSelector(".bpk-ticket__paper", {
      visible: true,
    });
  }

  private async mapSearchResult() {
    // TODO: Map another attributes (Date, Airport, ...)
    const minPayText: string = await this.page.evaluate(() => document.querySelector(".fqs-price").textContent);
    const numberOnlyRegExp = /\D+/g;
    const cleanMinPayString = minPayText.replace(numberOnlyRegExp, "");
    const minPay = parseInt(cleanMinPayString, 10);

    console.log("SkyScanner minimum price", minPay);
    await this.page.screenshot({ path: "dst/skyScannerExample.png" });

    return {
      minPrice: minPay,
      from: "skyScanner",
      link: this.urlAddress,
    };
  }

  private getFormatDate(date: Date) {
    const year = date
      .getFullYear()
      .toString()
      .slice(2, 4);
    const month = `0${date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}${month}${day}`;
  }

  private setDestinationUrl() {
    this.urlAddress = `https://www.skyscanner.co.kr/transport/flights/${this.fromAirport}/${
      this.toAirport
    }/${this.getFormatDate(this.checkInDate)}/${this.getFormatDate(this.checkOutDate)}?adults=${
      this.adultCount
    }&children=0&adultsv2=${
      this.adultCount
    }&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=day-view#results`;
  }

  private async getSearchResultPage() {
    if (this.page) {
      await this.page.goto(this.urlAddress);
    } else {
      throw new Error("Had Error on loading SkyScanner page.");
    }
  }

  public async getPrices(): Promise<PriceResult> {
    try {
      await this.setBrowser();
      await this.setNewPage();
      this.setDestinationUrl();
      await this.getSearchResultPage();
      await this.getSearchResult();
      return await this.mapSearchResult();
    } catch (err) {
      console.error(err);
      await this.page.screenshot({ path: "dst/skyScannerError.png" });
    } finally {
      await this.closeBrowser();
    }
  }
}
