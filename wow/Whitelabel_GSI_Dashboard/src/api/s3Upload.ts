import { post } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

export const getS3UploadUrl = async (params: Request.UploadFileToS3) => {
  return post<Response.GetS3UploadUrl>("/s3/upload-url", params, {
    name: "getS3UploadUrl",
    usePlatform: true
  })
}

export const postS3Download = async (params: Request.PostS3Download) => {
  return post<Response.PostS3Download>("/s3/download-url", params, {
    name: "postS3Download",
    usePlatform: true
  })
}
