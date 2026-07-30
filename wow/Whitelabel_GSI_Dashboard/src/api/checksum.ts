import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post } from "@/utils/request"

export const getChecksumLogs = async (params?: { offset?: number; size?: number }) => {
  return await get<Response.GetChecksumLogs>("/checksum/logs", params || {}, {
    name: "getChecksumLogs",
    usePlatformJob: true
  })
}

export const verifyChecksum = async () => {
  return await post<Response.VerifyChecksum>("/checksum/verify", {}, { name: "verifyChecksum", usePlatformJob: true })
}
