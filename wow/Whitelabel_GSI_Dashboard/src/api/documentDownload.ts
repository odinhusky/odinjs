import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"

export const getdocumentDownloadList = async (params: Request.GetdocumentDownloadList) => {
  const payload = {
    type: params.documentType,
    file_type: params.documentType,
    target: params.displayObjectType,
    enabled: params.enable,
    title: params.keyword,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetdocumentDownloadList>("/file/list", payload, {
    name: "getdocumentDownloadList"
  })
}

// 总理列表
export const getDocumentDownloadMasterList = async () => {
  return await get<Response.GetdocumentDownloadList>(
    "/file/master",
    {},
    {
      name: "getDocumentDownloadMasterList"
    }
  )
}
// 代理列表
export const getDocumentDownloadAgentList = async () => {
  return await get<Response.GetdocumentDownloadList>(
    "/file/agent",
    {},
    {
      name: "getDocumentDownloadAgentList"
    }
  )
}

export const getDocumentDownloadSequence = async (params: Request.GetdocumentDownloadList) => {
  return await put<Response.GetdocumentDownloadList>(`/file/sequence`, params, {
    name: "getDocumentDownloadSequence"
  })
}

export const deleteDocumentDownloadDetail = async (params: Request.GetSingleDocumentDownload) => {
  return await deleteData<Response.GetdocumentDownloadList>(
    `/file/${params.id}`,
    {},
    {
      name: "deleteDocumentDownloadDetail"
    }
  )
}

export const getDocumentDownloadDetail = async (params: Request.GetdocumentDownloadList) => {
  return await get<Response.GetdocumentDownloadList>(
    `/file/${params.id}/info`,
    {},
    {
      name: "getDocumentDownloadDetail"
    }
  )
}

export const addDocumentDownloadDetail = async (params: Request.GetdocumentDownloadDetail) => {
  const { genTimeFormat } = useCommon()

  let payload = {
    desc: params.desc,
    enabled: params.enabled,
    file: params.file,
    file_type: params.file_type,
    target: params.target,
    target_audience: params.target_audience,
    title: params.title,
    file_start_time: params.file_start_time
      ? genTimeFormat(params.file_start_time, "yyyy-MM-dd'T'HH:mm:ss'Z'", false)
      : undefined,
    file_end_time: params.file_end_time
      ? genTimeFormat(params.file_end_time, "yyyy-MM-dd'T'HH:mm:ss'Z'", false)
      : undefined
  }

  return await post<Response.GetdocumentDownloadList>(`/file`, payload, {
    useFormData: true,
    name: "addDocumentDownloadDetail"
  })
}

export const updateDocumentDownloadDetail = async (params: Request.GetdocumentDownloadDetail) => {
  const { genTimeFormat } = useCommon()

  let payload = {
    desc: params.desc,
    enabled: params.enabled,
    file: params.file,
    file_type: params.file_type,
    target: params.target,
    target_audience: params.target_audience,
    title: params.title,
    file_start_time: params.file_start_time
      ? genTimeFormat(params.file_start_time, "yyyy-MM-dd'T'HH:mm:ss'Z'", false)
      : undefined,
    file_end_time: params.file_end_time
      ? genTimeFormat(params.file_end_time, "yyyy-MM-dd'T'HH:mm:ss'Z'", false)
      : undefined
  }

  return await put<Response.GetdocumentDownloadList>(`/file/${params.id}`, payload, {
    useFormData: true,
    name: "updateDocumentDownloadDetail"
  })
}

export const getDocumentDownloadDialogFileList = async (params: Request.GetdocumentDownloadDetail) => {
  return await get<Response.GetdocumentDownloadList>(
    `/file/filelist/${params.id}`,
    {},
    {
      name: "getDocumentDownloadDialogFileList"
    }
  )
}

export const getDocumentDownloadDialogFileFolderList = async (params: Request.GetdocumentDownloadDetail) => {
  return await get<Response.GetdocumentDownloadList>(
    `/file/folder/${params.id}`,
    {},
    {
      name: "getDocumentDownloadDialogFileFolderList"
    }
  )
}
