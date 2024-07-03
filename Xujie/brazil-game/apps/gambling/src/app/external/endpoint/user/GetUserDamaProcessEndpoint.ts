import {GET_USER_DAMA_PROCESS_URL} from "../../ApiUrl";
import {ExternelEndpoint} from "../../types";
import {ResponseStructure} from "../ResponseStructure";

export type DamaProcessResponse = {
    status?: number, // 0：待解锁、1：进行中、2：已完成
    flow?: number // 完成的打码流水，单位：元
    dama_flow?: number, //需要的打码流水，单位：元
    process?: number // 当前打码进度
}
export const GetUserDamaProcessEndpoint = (builder: ExternelEndpoint) => builder.query<ResponseStructure<DamaProcessResponse>, null>({
    query: () => ({
        method: 'get',
        url: GET_USER_DAMA_PROCESS_URL,
    }),
})