import { AgentApplicationRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class AgentService {
    static serviceApiPrefix = "/agent"

    get() {
        return http.get<any, ExchangeResponse<AgentApplication>>(`${AgentService.serviceApiPrefix}/application`);
    }

    create(request: AgentApplicationRequest){
        return http.post<any, ExchangeResponse<AgentApplication>>(`${AgentService.serviceApiPrefix}/application`, request);
    }
}

export default new AgentService();