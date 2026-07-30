import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { STATUS } from "@/utils/constants"
import { get, deleteData, put, post } from "@/utils/request"

// export const getIpWhiteList = async (params: Request.GetIpWhiteList) => {
//   const { id, offset, size } = params

//   let fakeList: Response.GetIpWhiteList = [
//     {
//       id: 1,
//       group_name: "客服人員IP",
//       creation_date: 1692417720000,
//       enable_or_disable: STATUS.Enums.Disable,
//       remark: "",
//       ip_list: ""
//     },
//     {
//       id: 2,
//       group_name: "總代IP",
//       creation_date: 1692417720000,
//       enable_or_disable: STATUS.Enums.Disable,
//       remark: "",
//       ip_list: ""
//     }
//   ]

//   const fakeRes: Response.BaseResponse<Response.GetIpWhiteList> = {
//     code: 0,
//     msg: "",
//     data: []
//   }

//   fakeRes.data = fakeList
//   return await fakeRes
// }

export const authWhiteIp = () => {
  return get("/white_ip/auth", null, {
    name: "authWhiteIp"
  })
}

export const addIpWhiteList = (params: Request.GetIpWhiteList) => {
  const payload = {
    ip_address: params.ip,
    remark: params.remark
  }
  return post<Response.GetIpWhiteList>("/white_ip", payload, {
    name: "addIpWhiteList"
  })
}

export const getIpWhiteList = (params: Request.GetIpWhiteList) => {
  const payload = {
    ip_address: params.ip
  }
  return get<Response.GetIpWhiteList>("/white_ip/list", payload, {
    name: "getIpWhiteList"
  })
}

export const getIpWhiteListDetail = (params: Request.GetIpWhiteList) =>
  get<Response.IpWhiteListItem>(
    "/white_ip/" + params.id + "/info",
    {},
    {
      name: "getIpWhiteListDetail"
    }
  )

export const updateIpWhiteListDetail = (params: Request.GetIpWhiteList) =>
  put<Response.GetIpWhiteList>(
    "/white_ip/" + params.id,
    { ip_address: params.ip, remark: params.remark },
    {
      name: "updateIpWhiteListDetail",
      needToken: true
    }
  )

export const deleteIpWhiteList = (params: Request.GetIpWhiteList) => {
  return deleteData<Response.GetIpWhiteList>(
    `/white_ip/${params.id}`,
    {},
    {
      name: "deleteIpWhiteListItem"
    }
  )
}

export const getNoteSettingList = async (params: Request.GetNoteSettingList) => {
  let payload = {
    title: params.keyword
  }
  return await get<Response.GetNoteSettingList>("/remark/list", payload, {
    name: "getNoteSettingList"
  })
}

export const deleteNoteSetting = async (params: Request.GetNoteSettingList) => {
  return await deleteData<Response.GetNoteSettingList>(
    `/remark/${params.id}`,
    {},
    {
      name: "deleteNoteSetting"
    }
  )
}

export const updateNoteSetting = async (params: Request.GetNoteSettingList) => {
  return await put<Response.GetNoteSettingList>(`/remark/update`, params, {
    name: "updateNoteSetting"
  })
}

export const addNoteSetting = async (params: Request.GetNoteSettingList) => {
  return await post<Response.GetNoteSettingList>(`/remark`, params, {
    name: "addNoteSetting"
  })
}
