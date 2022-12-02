import http from "utils/http-common";

const debug = false;
class MarketService {
    static serviceApiPrefix = "/market"

    getFundingRate(symbol: string) {
        debug && console.log(`getFundingRate: symbol_${symbol}`)
        return http.get<any, any>(`${MarketService.serviceApiPrefix}/funding-rate?symbol=${symbol}`);
    }
}

export default new MarketService();