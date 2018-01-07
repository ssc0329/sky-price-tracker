import * as puppeteer from "puppeteer";

export interface PriceResult {
  minPrice: number;
  from: string;
  link: string;
}

const LINUX_CHROME_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36";

export class BasicPriceTracker {
  private browser: puppeteer.Browser;
  private _page: puppeteer.Page | null;
  private _urlAddress: string;

  constructor(
    private _fromAirport: string,
    private _toAirport: string,
    private _checkInDate: Date,
    private _checkOutDate: Date,
    private _adultCount: number,
  ) {}

  get page() {
    return this._page;
  }

  set page(newPage: puppeteer.Page) {
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

  set urlAddress(url: string) {
    this._urlAddress = url;
  }

  get urlAddress() {
    return this._urlAddress;
  }

  private setHumanUserAgent() {
    this.page.setUserAgent(LINUX_CHROME_USER_AGENT);
  }

  public async setBrowser() {
    this.browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  }

  public async setNewPage() {
    this.page = await this.browser.newPage();
    this.setHumanUserAgent();
  }

  public async closeBrowser() {
    await this.browser.close();
  }
}
