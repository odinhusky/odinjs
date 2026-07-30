import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post } from "@/utils/request"

export const getAIVoiceBotList = async (params: Request.GetAIVoiceBotList) => {
  const payload = {
    intent: params.intent,
    status: params.enable ? 1 : 0,
    offset: params.offset,
    size: params.size
  }
  if (typeof params.enable === "undefined") {
    delete payload.status
  }
  return get<Response.GetAIVoiceBotList>("/ai_voice_bot/list", payload, {
    name: "getAIVoiceBotList",
    usePlatform: true
  })
}

export const getVoiceBotList = async () => {
  return get<Response.GetVoiceBotList>(
    "/ai_voice_bot/voice_bot",
    {},
    {
      name: "getVoiceBotList",
      usePlatform: true
    }
  )
}

export const dialOut = async (params: Request.DialOut) => {
  let payload = {
    voice_type: params.voice_type,
    to_number: params.to_number
  }

  return await post(`/ai_voice_bot/dial_out`, payload, {
    name: "dialOut",
    usePlatform: true
  })
}

export const getVoiceBotLanguageList = async () => {
  return get<Response.GetVoiceBotLanguageList>(
    "/ai_voice_bot/language",
    {},
    {
      name: "getVoiceBotLanguageList",
      usePlatform: true
    }
  )
}
