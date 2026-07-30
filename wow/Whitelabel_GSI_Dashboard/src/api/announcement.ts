import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"
import { format, parse, getTime } from "date-fns"
import { idText } from "typescript"

export const getMemberList = (params: { offset: number; size: number }) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMemberList>("/member/list", payload, {
    name: "getMemberList"
  })
}

export const getMemberAnnouncementType = async () => {
  return await get<Response.getMemberAnnouncementType[]>(
    `/announcement/member/types`,
    {},
    {
      name: "getMemberAnnouncementType"
    }
  )
}

export const addMemberAnnouncement = async (params: Request.AddMemberAnnouncement) => {
  let payload = {
    type: params.type,
    start_time: params.start_time,
    end_time: params.end_time,
    enable: 1,
    details: params.details,
    target_member_ids: params.target_member_ids,
    display_options: params.display_options
  }

  return await post<Response.GetAnnouncementList>(`/announcement/member`, payload, {
    name: "addMemberAnnouncement"
  })
}
export const updateMemberAnnouncement = async (params: Request.AddMemberAnnouncement) => {
  console.log("updateMemberAnnouncement", params)
  let payload = {
    id: params.id,
    type: params.type,
    start_time: params.start_time,
    end_time: params.end_time,
    enable: 1,
    details: params.details,
    target_member_ids: params.target_member_ids,
    display_options: params.display_options
  }

  return await put<Response.GetAnnouncementList>(`/announcement/member`, payload, {
    name: "updateMemberAnnouncement"
  })
}
export const deleteMemberAnnouncement = async (id: number) => {
  return await deleteData<Response.GetAnnouncementList>(
    `/announcement/member`,
    {
      id
    },
    {
      name: "deleteMemberAnnouncement"
    }
  )
}
export const putMemberAnnouncementSorts = async (params: { announcement_id: number; sort_number: number }) => {
  return put(`/announcement/member/sorts`, params, {
    name: "putMemberAnnouncementSorts"
  })
}
export const putMemberAnnouncementToggle = async (params: { announcement_id: number; enable: number }) => {
  return put(`/announcement/member/toggle`, params, {
    name: "putMemberAnnouncementToggle"
  })
}

export const getMemberAnnouncementList = async (params: Request.GetAnnouncementList) => {
  const payload = {
    type: params.announcementType,
    key_word: params.title,
    target_member_id: params.displayObjectType,
    start_time: params.start as any,
    end_time: params.end as any,
    offset: params.offset,
    size: params.size,
    enable: 0
  }
  if (params.enable !== undefined) {
    payload.enable = params.enable ? 1 : 2
  }
  return await get<Response.GetAnnouncementList>("/announcement/member/list", payload, {
    name: "getMemberAnnouncementList"
  })
}
export const getMemberAnnouncementDetail = async (params: { id: number }) => {
  return await get<Response.GetMemberAnnouncementDetail>("/announcement/member", params, {
    name: "getMemberAnnouncementDetail"
  })
}

export const getAnnouncementList = async (params: Request.GetAnnouncementList) => {
  const payload = {
    type: params.announcementType,
    target: params.displayObjectType,
    start_date: params.start as any,
    end_date: params.end as any,
    title: (params as any).keyword,
    enabled: params.enable
  }
  return await get<Response.GetAnnouncementList>("/announcement/list", payload, {
    name: "getAnnouncementList"
  })
}

export const getAnnouncementDetail = async (params: Request.GetAnnouncementList) => {
  return await get<Response.GetAnnouncementList>(
    `/announcement/${params.id}/info`,
    {},
    {
      name: "getAnnouncementDetail"
    }
  )
}

// 公告管理总理列表
export const getAnnouncementMasterList = async () => {
  return await get<Response.GetAnnouncementList>(
    "/announcement/master",
    {},
    {
      name: "getAnnouncementMasterList"
    }
  )
}
// 公告管理代理列表
export const getAnnouncementAgentList = async () => {
  return await get<Response.GetAnnouncementList>(
    "/announcement/agent",
    {},
    {
      name: "getAnnouncementAgentList"
    }
  )
}
export const addAnnouncementDetail = async (params: Request.GetAnnouncementDetail) => {
  let payload = {
    desc: params.desc,
    enabled: params.enabled,
    file: params.file,
    announcement_type: params.type,
    target: params.target,
    target_audience: params.agent_name_group,
    title: params.title,
    announcement_start_time: params.announcement_start_time
      ? format(params.announcement_start_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : undefined,
    announcement_end_time: params.announcement_end_time
      ? format(params.announcement_end_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : undefined
  }

  return await post<Response.GetAnnouncementList>(`/announcement`, payload, {
    useFormData: true,
    name: "addAnnouncementDetail"
  })
}

export const updateAnnouncementDetail = async (params: Request.GetAnnouncementDetail) => {
  let payload = {
    desc: params.desc,
    enabled: params.enabled,
    file: params.file,
    announcement_type: params.type,
    target: params.target,
    target_audience: params.agent_name_group,
    title: params.title,
    announcement_start_time: params.announcement_start_time
      ? format(params.announcement_start_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : undefined,
    announcement_end_time: params.announcement_end_time
      ? format(params.announcement_end_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : undefined
  }

  return await put<Response.GetAnnouncementList>(`/announcement/${params.id}`, payload, {
    name: "updateAnnouncementDetail"
  })
}

export const getAnnouncementSequence = async (params: Request.GetAnnouncementList) => {
  return await put<Response.GetAnnouncementList>(`/announcement/sequence`, params, {
    name: "getAnnouncementSequence"
  })
}
export const deleteAnnouncementDetail = async (params: Request.GetSingleAnnouncementDetail) => {
  return await deleteData<Response.GetAnnouncementList>(
    `/announcement/${params.id}`,
    {},
    {
      name: "deleteAnnouncementDetail"
    }
  )
}
