import { SpotContractTransferRequest, WithdrawRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class WalletService {
    static serviceApiPrefix = "/wallet"

    transfer(request: SpotContractTransferRequest){
        return http.post<SpotContractTransferRequest, ExchangeResponse<any>>(`${WalletService.serviceApiPrefix}/transfer`, request);
    }

    withdraw(request: WithdrawRequest){
        return http.post<SpotContractTransferRequest, ExchangeResponse<any>>(`${WalletService.serviceApiPrefix}/withdraw`, request);
    }
}

export default new WalletService();