import http from "utils/http-common";
import { FavoriteSymbolRequest, GetOwnFinanceRecordRequest, GetOwnFuturesRequest } from "interfaces/request.interface";
import { ContractSide } from "common/types";

const debug = false;
class InvestorService {
    static serviceApiPrefix = "/investor"

    getFavoriteSymbol() {
        debug && console.log(`getFavoriteSymbol`)
        return http.get<any, ExchangeResponse<string[]>>(`${InvestorService.serviceApiPrefix}/favorite`);
    }

    addFavoriteSymbol(request: FavoriteSymbolRequest) {
        debug && console.log(`addFavoriteSymbol: ${request}`)
        return http.post<FavoriteSymbolRequest, ExchangeResponse<null>>(`${InvestorService.serviceApiPrefix}/favorite`, request);
    }

    deleteFavoriteSymbol(request: FavoriteSymbolRequest) {
        debug && console.log(`deleteFavoriteSymbol: ${request}`)
        return http.delete<FavoriteSymbolRequest, ExchangeResponse<null>>(`${InvestorService.serviceApiPrefix}/favorite`, { data: request });
    }

    getAvailableQuantity(symbol: string, side: ContractSide) {
        debug && console.log(`deleteFavoriteSymbol: symbol_${symbol}, side_${side}`)
        return http.get<any, ExchangeResponse<number>>(`${InvestorService.serviceApiPrefix}/available-quantity?symbol=${symbol}&side=${side}`);
    }

    getAvailableBalance() {
        debug && console.log(`getAvailableBalance`)
        return http.get<any, ExchangeResponse<number>>(`${InvestorService.serviceApiPrefix}/margin-balance`);
    }

    getLeverage(symbol: string) {
        debug && console.log(`getLeverage: symbol_${symbol}`)
        return http.get<any, ExchangeResponse<number>>(`${InvestorService.serviceApiPrefix}/leverage/${symbol}`);
    }

    getOwnFutures(request: GetOwnFuturesRequest) {
        debug && console.log(`list investor futures: ${JSON.stringify(request)}`)
        let queryParams = ""
        if (request.status !== undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}status=${request.status}`
        if (request.start !== undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}start=${request.start}`
        if (request.end !== undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}endDate=${request.end}`
        debug && console.log(`list investor futures: ${queryParams}`)
        return http.get<any, ExchangeResponse<Future[]>>(`${InvestorService.serviceApiPrefix}/future${queryParams}`);
    }

    getProperty() {
        return http.get<any, ExchangeResponse<Property>>(`${InvestorService.serviceApiPrefix}/property`);
    }

    getOwnFinanceRecord(request: GetOwnFinanceRecordRequest) {
        debug && console.log(`list investor finance record: ${JSON.stringify(request)}`)
        let queryParams = `?type=${request.type}`
        if (request.start !== undefined) queryParams = `&start=${request.start}`
        if (request.end !== undefined) queryParams = `&endDate=${request.end}`
        debug && console.log(`list investor finance record: ${queryParams}`)
        return http.get<any, ExchangeResponse<FinanceRecord[]>>(`${InvestorService.serviceApiPrefix}/finance${queryParams}`);
    }

    getWallet() {
        return http.get<any, ExchangeResponse<string>>(`${InvestorService.serviceApiPrefix}/wallet`);
    }

    getCommission() {
        return http.get<any, ExchangeResponse<CommissionInfo>>(`${InvestorService.serviceApiPrefix}/commission`);
    }

    getInviteCode() {
        return http.get<any, ExchangeResponse<string>>(`${InvestorService.serviceApiPrefix}/invite-code`);
    }
}

export default new InvestorService();