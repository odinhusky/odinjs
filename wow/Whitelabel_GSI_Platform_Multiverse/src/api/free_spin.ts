import { requestApi } from "../common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

// 免費旋轉
export const getFreeSpinList = (params: Request.GetFreeSpinList) => {
  return requestApi<Request.GetFreeSpinList, Response.GetFreeSpinList>(
    `/v1/player/promotions/free_spin/list`,
    params,
    {
      name: "getFreeSpinList",
      method: "get"
    }
  )
}
