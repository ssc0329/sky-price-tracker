import { PriceSearchParams } from "./types/priceSearchParams";

class NaverTracker implements PriceSearchParams {
  fromAirport: string;
  toAirport: string;
  checkInDate: Date;
  checkOutDate: Date;

  constructor(
    fromAirport: string,
    toAirport: string,
    checkInDate: Date,
    checkOutDate: Date
  ) {
    this.fromAirport = fromAirport;
    this.toAirport = toAirport;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
  }

  public getPrices() {}
}
