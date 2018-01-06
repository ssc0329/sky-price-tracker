const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;
import * as uuidv4 from "uuid/v4";

export interface PriceTicketParams {
  fromAirport: string;
  toAirport: string;
  minPrice: number;
  departTime: Date;
  arriveTime: Date;
  fromSite: string;
}

const priceTicketSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    fromAirport: String,
    toAirport: String,
    minPrice: Number,
    departTime: Date,
    arriveTime: Date,
    fromSite: String,
  },
  {
    timestamps: true,
  },
);

const PriceTicket = dynamoose.model("PriceTicket", priceTicketSchema);

export default class PriceTicketManager {
  private makeNewId() {
    return uuidv4();
  }

  public async saveNewTicket(params: PriceTicketParams) {
    const priceTicket = new PriceTicket({
      id: this.makeNewId(),
      fromAirport: params.fromAirport,
      toAirport: params.toAirport,
      minPrice: params.minPrice,
      departTime: params.departTime,
      arriveTime: params.arriveTime,
      fromSite: params.fromSite,
    });

    await priceTicket.save();
  }
}
