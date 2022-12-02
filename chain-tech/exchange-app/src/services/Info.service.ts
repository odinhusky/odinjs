import { GetAnnouncementRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class InfoService {
    static serviceApiPrefix = "/info"

    getCarousals(lang: string) {
        return http.get<any, ExchangeResponse<Carousal[]>>(`${InfoService.serviceApiPrefix}/carousel?lang=${lang}`);
    }

    getAnnouncements(request: GetAnnouncementRequest){
        let queryParams = `?lang=${request.lang}`
        if (request.topic!==undefined) queryParams = `&topic=${request.topic}`
        return http.get<any, ExchangeResponse<Announcement[]>>(`${InfoService.serviceApiPrefix}/announcement${queryParams}`);
    }

    getAnnouncement(id: string){
        return http.get<any, ExchangeResponse<Announcement>>(`${InfoService.serviceApiPrefix}/announcement/${id}`);
    }

    getMarquees(lang: string){
        return http.get<any, ExchangeResponse<Marquee[]>>(`${InfoService.serviceApiPrefix}/marquee?lang=${lang}`);
    }

    getSymbol(){
        return http.get<any, ExchangeResponse<string[]>>(`${InfoService.serviceApiPrefix}/future/symbol`);
    }
}

export default new InfoService();