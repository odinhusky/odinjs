import http from "utils/http-common";
import { CreateAdvertisementRequest, GetAdvertisementRequest, OtcOrderInfo } from "interfaces/request.interface";

const debug = false;
class AdvertisementService {
    static serviceApiPrefix = "/otc/api/advertisement"

    getAdvertisement(request: GetAdvertisementRequest){
        debug && console.log(`getAdvertisement: ${JSON.stringify(request)}`)
        let queryParams = ""
        if (request.all!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}all=${request.all}`
        if (request.cryptoAsset!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}cryptoAsset=${request.cryptoAsset}`
        if (request.fiatCurrency!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}fiatCurrency=${request.fiatCurrency}`
        if (request.my!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}my=${request.my}`
        if (request.type!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}type=${request.type}`
        debug && console.log(`getAdvertisement: ${queryParams}`)
        return http.get<any, Advertisement[]>(`${AdvertisementService.serviceApiPrefix}/${queryParams}`);
    }

    create(request: CreateAdvertisementRequest){
        return http.post<OtcOrderInfo, OtcOrder>(`${AdvertisementService.serviceApiPrefix}/`, request);
    }

    createOtcOrder(id: string,request: OtcOrderInfo){
        debug && console.log(`createOtcOrder: ${JSON.stringify(request)}`)
        return http.post<OtcOrderInfo, OtcOrder>(`${AdvertisementService.serviceApiPrefix}/${id}/otcOrder/`, request);
    }

    getCryptoAsset() {
        return http.get<any, CryptoAsset[]>(`${AdvertisementService.serviceApiPrefix}/support/cryptoAsset`);
    }

    getFiatCurrency() {
        return http.get<any, FiatCurrency[]>(`${AdvertisementService.serviceApiPrefix}/support/fiatCurrency`);
    }

    offline(id: string){
        return http.put<OtcOrderInfo, OtcOrder>(`${AdvertisementService.serviceApiPrefix}/${id}/offline/`);
    }

    close(id: string){
        return http.put<OtcOrderInfo, OtcOrder>(`${AdvertisementService.serviceApiPrefix}/${id}/close/`);
    }

    online(id: string){
        return http.put<OtcOrderInfo, OtcOrder>(`${AdvertisementService.serviceApiPrefix}/${id}/online/`);
    }

    static levelServiceApiPrefix = "/otc/api/advertisementLevel"

    getLevels(){
        return http.get<any, AdvertiserLevel[]>(`${AdvertisementService.levelServiceApiPrefix}/`);
    }
}

export default new AdvertisementService();