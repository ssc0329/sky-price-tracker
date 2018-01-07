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
const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;
const uuidv4 = require("uuid/v4");
const priceTicketSchema = new Schema({
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
    link: String,
}, {
    timestamps: true,
});
const PriceTicket = dynamoose.model("PriceTicket", priceTicketSchema);
class PriceTicketManager {
    makeNewId() {
        return uuidv4();
    }
    saveNewTicket(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceTicket = new PriceTicket({
                id: this.makeNewId(),
                fromAirport: params.fromAirport,
                toAirport: params.toAirport,
                minPrice: params.minPrice,
                departTime: params.departTime,
                arriveTime: params.arriveTime,
                fromSite: params.fromSite,
                link: params.link,
            });
            yield priceTicket.save();
        });
    }
}
exports.default = PriceTicketManager;
//# sourceMappingURL=priceTicket.js.map