import { ClosePositionRequest, GetStopPriceRequest, SetStopPriceRequest } from "interfaces/request.interface";
import http from "utils/http-common";

const debug = false;
class PositionService {
    static serviceApiPrefix = "/order"

    close(request: ClosePositionRequest){
        return http.post<ClosePositionRequest, ExchangeResponse<Position>>(`${PositionService.serviceApiPrefix}/position/close-position`, request);
    }

    getStopPrice(request: GetStopPriceRequest) {
        debug && console.log(`getStopPrice: ${JSON.stringify(request)}`)
        let queryParams = `?symbol=${request.symbol}`
        if (request.profitPrice!==undefined) queryParams = `${queryParams}&profitPrice=${request.profitPrice}`
        if (request.lossPrice!==undefined) queryParams = `${queryParams}&lossPrice=${request.lossPrice}`
        debug && console.log(`getStopPrice: ${queryParams}`)
        return http.get<any, ExchangeResponse<number>>(`${PositionService.serviceApiPrefix}/position/stop-price${queryParams}`);
    }

    setStopPrice(request: SetStopPriceRequest){
        return http.post<ClosePositionRequest, ExchangeResponse<Position>>(`${PositionService.serviceApiPrefix}/position/stop-price`, request);
    }
}

export default new PositionService();