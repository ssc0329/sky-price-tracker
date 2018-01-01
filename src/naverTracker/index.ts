import * as puppeteer from "puppeteer";
import { BasicPriceTracker } from "../common/basicPriceSearch";

export default class NaverTracker extends BasicPriceTracker {
  private async selectDestination() {
    await this.page.click(".trip_info_route_off .tit_airport");
    await this.page.keyboard.type(this.toAirport);
    await this.page.waitForSelector("li.city", { timeout: 5000 });
    await this.page.keyboard.press("ArrowDown");
    await this.page.waitFor(100);
    await this.page.keyboard.press("Enter");
    await this.page.waitFor(100);

    const destinationText: string = await this.page.evaluate(
      () =>
        document.querySelector(
          ".sp_flight.trip_info_route.ng-isolate-scope.trip_info_route_arrival > a.tit_airport.selectAutocomplete.ng-binding"
        ).textContent
    );

    const selectResultIsRight =
      destinationText && destinationText.includes(this.toAirport);

    if (!selectResultIsRight) {
      throw new Error(
        "Had Error on selecting destination airport in Naver flights."
      );
    }
  }

  private async selectDate(targetDate: Date) {
    const currentDateString: string = await this.page.evaluate(
      () => document.querySelector(".calendar-title").textContent
    );
    const targetMonth = targetDate.getMonth();
    const currentMonth = parseInt(currentDateString.split(".")[1], 10);
    const targetDayString = targetDate.getDate().toString();

    if (targetMonth > currentMonth) {
      await this.page.click(
        "div.layer_calendar:not(.ng-hide) > div > div:nth-child(2) > div.calendar_head > a"
      );
      await this.selectDate(targetDate);
    } else {
      const daysElementsInNaverCalendar = await this.page.$$(
        "div.layer_calendar:not(.ng-hide) .btn_days"
      );

      for (let dayElement of daysElementsInNaverCalendar) {
        const innerHtmlInDayElement = await this.page.evaluate(
          el => el.innerHTML,
          dayElement
        );
        const cleanHtml = innerHtmlInDayElement.replace(/<!--[\s\S]*?-->/g, "");

        if (cleanHtml === targetDayString) {
          await dayElement.click();
          break;
        }
      }
    }
  }

  private async selectCheckInDate() {
    await this.page.click(
      ".trip_option.ng-scope > div.btn_trip.ng-isolate-scope.btn_trip_departure"
    );

    await this.page.waitForSelector(".layer_calendar", {
      visible: true,
      timeout: 5000
    });

    await this.selectDate(this.checkInDate);
  }

  private async selectCheckOutDate() {
    await this.selectDate(this.checkOutDate);
  }

  private async selectCountOfPeople() {
    await this.page.click(".txt_trip[aria-label='인원']");

    const currentCountStringOfPeople: string = await this.page.evaluate(() =>
      document.querySelector("input.txt_count").getAttribute("value")
    );

    const currentCountOfPeople = parseInt(currentCountStringOfPeople, 10);
    if (currentCountOfPeople === this.adultCount) {
      await this.page.click(".txt_trip[aria-label='인원']");
    } else {
      const repeatCount = this.adultCount - currentCountOfPeople;
      for (let i = 0; i < repeatCount; i++) {
        this.page.click(".sp_flight.btn_increase");
      }
      await this.page.click(".txt_trip[aria-label='인원']");
    }
  }

  private async insertSearchParamsToInputFields() {
    await this.selectDestination();
    await this.selectCheckInDate();
    await this.selectCheckOutDate();
    await this.selectCountOfPeople();
  }

  private async getNaverSearchMainPage() {
    if (this.page) {
      await this.page.goto("https://store.naver.com/flights/");
    } else {
      throw new Error("Had Error on loading Naver main page.");
    }
  }

  private async submitSearchButton() {
    await this.page.click(".sp_flight.btn_search");
  }

  private async getSearchResult() {
    await this.page.waitForSelector(".sp_flight.lst_apply", { visible: true });
  }

  private async mapSearchResult() {
    // TODO: Map another attributes (Date, Airport, ...)
    const minPayText: string = await this.page.evaluate(
      () => document.querySelector(".txt_pay").textContent
    );
    const cleanMinPayString = minPayText.replace(/,/g, "");
    const minPay = parseInt(cleanMinPayString, 10);
    console.log(minPay);
    await this.page.screenshot({ path: "dst/example.png" });

    return {
      minPay
    };
  }

  public async getPrices() {
    try {
      await this.setBrowser();
      await this.setNewPage();
      await this.getNaverSearchMainPage();
      await this.insertSearchParamsToInputFields();
      await this.submitSearchButton();
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
