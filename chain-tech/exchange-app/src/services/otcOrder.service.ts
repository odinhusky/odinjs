import { GetOtcOrderRequest, PaidRequest, PaymentId } from "interfaces/request.interface";
import http from "utils/http-common";

const debug = false;
class OtcOrderService {
    static serviceApiPrefix = "/otc/api/otcOrder"

    list(request: GetOtcOrderRequest){
        debug && console.log(`list otc order: ${JSON.stringify(request)}`)
        let queryParams = ""
        if (request.all!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}all=${request.all}`
        if (request.status!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}status=${request.status}`
        if (request.type!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}type=${request.type}`
        if (request.advertisement!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}advertisement=${request.advertisement}`
        if (request.buyUser!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}buyUser=${request.buyUser}`
        if (request.sellUser!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}sellUser=${request.sellUser}`
        if (request.startDate!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}startDate=${request.startDate}`
        if (request.endDate!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}endDate=${request.endDate}`
        debug && console.log(`list otc order: ${queryParams}`)
        return http.get<any, OtcOrder[]>(`${OtcOrderService.serviceApiPrefix}/${queryParams}`);
    }

    get(orderId: string){
        return http.get<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}`);
    }

    getPayments(orderId: string){
        return http.get<any, Payment[]>(`${OtcOrderService.serviceApiPrefix}/${orderId}/payments/`);
    }

    cancel(orderId: string){
        return http.post<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}/cancel/`);
    }

    check(orderId: string){
        return http.post<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}/check/`);
    }

    paid(orderId: string, request: PaidRequest){
        return http.post<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}/paid/`, request);
    }

    confirm(orderId: string){
        return http.post<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}/confirm/`);
    }

    appeal(orderId: string){
        return http.post<any, OtcOrder>(`${OtcOrderService.serviceApiPrefix}/${orderId}/appeal/`);
    }
}

export default new OtcOrderService();