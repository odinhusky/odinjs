import { CancelFutureRequest, CreateFutureRequest } from "interfaces/request.interface";
import http from "utils/http-common";
import { AdjustLeverageRequest } from "interfaces/request.interface";
class FutureService {
    static serviceApiPrefix = "/order"

    openOrder(request: CreateFutureRequest) {
        return http.post<CreateFutureRequest, ExchangeResponse<Future>>(`${FutureService.serviceApiPrefix}/futures/open-order`, request);
    }

    adjustLeverage(request: AdjustLeverageRequest){
        return http.post<AdjustLeverageRequest, ExchangeResponse<null>>(`${FutureService.serviceApiPrefix}/position/adjust-leverage`, request);
    }

    cancel(request: CancelFutureRequest){
        return http.post<AdjustLeverageRequest, ExchangeResponse<null>>(`${FutureService.serviceApiPrefix}/futures/cancel-order`, request);
    }
}

export default new FutureService();