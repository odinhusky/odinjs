import AdminRequest from "../utils/adminRequest"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

export const getAgencyOperationsManagement = async (params: Request.GetAgencyOperationsManagementList) => {
  console.log("get member list payload:")
  console.log(params)

  const { id, offset, size } = params

  let fakeList: Response.GetAgencyOperationsManagementList = [
    {
      id: 10,
      master_agent_name: "一路發集團",
      agent_account: "a16888",
      agent_name: "澳門銀河娛樂城",
      website_name: "澳門銀河娛樂城",
      frontend_URL: "www.16888.com",
      frontend_active_disable: 0,
      bo_active_disable: 0
    },
    {
      id: 11,
      master_agent_name: "666集團",
      agent_account: "b66666",
      agent_name: "輝煌娛樂城",
      website_name: "輝煌娛樂城",
      frontend_URL: "www.16888.com",
      frontend_active_disable: 0,
      bo_active_disable: 0
    },
    {
      id: 12,
      master_agent_name: "888集團",
      agent_account: "c88888",
      agent_name: "亞博娛樂城",
      website_name: "亞博娛樂城",
      frontend_URL: "www.16888.com",
      frontend_active_disable: 0,
      bo_active_disable: 0
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetAgencyOperationsManagementList> = {
    code: 0,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  if (id) {
    fakeList = fakeList.filter((item) => item.id.includes(id))
  }

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}
