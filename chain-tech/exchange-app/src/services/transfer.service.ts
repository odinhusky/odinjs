import { SpotOtcTransferRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class TransferService {
    static serviceApiPrefix = "/api"

    transferMaster(request: SpotOtcTransferRequest){
        return http.post<SpotOtcTransferRequest, ExchangeResponse<any>>(`${TransferService.serviceApiPrefix}/transfer/`, request);
    }

    static otcServiceApiPrefix = "/otc/api"

    transferOtc(request: SpotOtcTransferRequest){
        return http.post<SpotOtcTransferRequest, ExchangeResponse<any>>(`${TransferService.otcServiceApiPrefix}/transfer/`, request);
    }
}

export default new TransferService();