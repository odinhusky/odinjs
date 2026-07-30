import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { MEMBER_LEVEL } from "@/utils/constants"

import * as fakeData from "@/api/fakeData/member"
import { ERROR_CODE } from "@/utils/constants"
import { get, post, put, deleteData } from "@/utils/request"
import { format } from "date-fns"
import { useCommon } from "@/hook/useCommon"

export const getKolAccount = () => {
  return get<Response.AiKolAccount>(
    "/ai/kol/accounts",
    {},
    {
      name: "getKolAccount",
      usePlatform: true
    }
  )
}
export const getKolSystemInfo = () => {
  return get<Response.AiKolSystemInfo>(
    "/ai/kol/system-info",
    {},
    {
      name: "getKolSystemInfo",
      usePlatform: true
    }
  )
}

export const getKolDetail = (account: string) => {
  return get<Response.AiKolAnalysisInfo>(
    `ai/kol/${account}/detail`,
    {},
    {
      name: "getKolSystemInfo",
      usePlatform: true
    }
  )
}

export const getKolMessage = (id: number) => {
  return get<Response.AiKolAnalysisInfo>(
    `ai/kol/chat-detail/${id}`,
    {},
    {
      name: "getKolMessage",
      usePlatform: true
    }
  )
}

export const deleteKolPost = (id: number) => {
  return deleteData(
    `ai/kol/post/${id}`,
    {},
    {
      name: "deleteKolPost",
      usePlatform: true
    }
  )
}

export const updateKolNewStatu = async (id: string) => {
  return put(`ai/kol/chat-status/${id}`, {}, { name: "updateKolNewStatu", usePlatform: true })
}

export const getKolPost = (id: number) => {
  return get<Response.AiKolAnalysisInfo & { post_url: string }>(
    `ai/kol/post/${id}`,
    {},
    {
      name: "getKolMessage",
      usePlatform: true
    }
  )
}

export const createKolAiImg = async (params: Request.AiKolCreateImg) => {
  const payload: Request.AiKolCreateImg = {
    account: params.account,
    language_code: params.language_code,
    background_image_b64: params.background_image_b64,
    pose_image_b64: params.pose_image_b64,
    outfit_image_b64: params.outfit_image_b64,
    expression_image_b64: params.expression_image_b64,
    background_prompt: params.background_prompt,
    pose_prompt: params.pose_prompt,
    outfit_prompt: params.outfit_prompt,
    expression_prompt: params.expression_prompt
  }

  return post<Response.AiKolPost>(`ai/kol/generate-image`, payload, { name: "createKolAiImg", usePlatform: true })
}

export const createKolAiText = async (params: Request.AiKolCreateImg) => {
  const payload: Request.AiKolCreateImg = {
    account: params.account,
    language_code: params.language_code,
    background_image_b64: params.background_image_b64,
    pose_image_b64: params.pose_image_b64,
    outfit_image_b64: params.outfit_image_b64,
    expression_image_b64: params.expression_image_b64,
    background_prompt: params.background_prompt,
    pose_prompt: params.pose_prompt,
    outfit_prompt: params.outfit_prompt,
    expression_prompt: params.expression_prompt
  }

  return post<Response.AiKolPost>(`ai/kol/captions`, payload, { name: "createKolAiText", usePlatform: true })
}

export const createKolAiTextSingle = async (params: { post_id: string; post_content: string; add_prompt: string }) => {
  const payload = {
    post_content: params.post_content,
    add_prompt: params.add_prompt
  }

  return post<{ post_id: string; caption: string }>(`ai/kol/captions/${params.post_id}/regenerate`, payload, {
    name: "createKolAiTextSingle",
    usePlatform: true
  })
}

export const postKolAiImg = async (params: { description: string; account: string; image_path: string }) => {
  const payload: { account: string; image_path: string; description: string } = {
    account: params.account,
    image_path: params.image_path,
    description: params.description
  }

  return post(`ai/kol/create-post`, payload, { name: "postKolAiImg", usePlatform: true })
}

export const translateAiText = async (payload: Array<{ input_text: string; languages?: Array<string> }>) => {
  return post(`/translate`, payload, {
    name: "translateAiText",
    customizationURL: "https://translate.aimate.am"
  })
}

export const getAiMateInfo = () => {
  return get<Response.AiMateSetting>(
    "/ai/mate/setting",
    {},
    {
      name: "getAiMateInfo",
      usePlatform: true
    }
  )
}

export const bindAiMate = (payload: Request.BindAiMate) => {
  return post<Response.AiMateSetting>("/ai/mate/setting", payload, {
    name: "bindAiMate",
    usePlatform: true
  })
}
