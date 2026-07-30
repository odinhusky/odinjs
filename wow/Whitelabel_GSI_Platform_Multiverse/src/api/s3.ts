import { requestApi } from "src/common/utils/request"
import { ERROR_CODE_TYPE, S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getS3UploadUrl = async (params: Request.GetS3UploadUrl) => {
  return requestApi<Request.GetS3UploadUrl, Response.GetS3UploadUrl>(`/platform/v1/player/s3/upload-url`, params, {
    name: "getS3UploadUrl",
    method: "post"
  })
}

export const getS3DownloadUrl = async (params: Request.GetS3DownloadUrl) => {
  return requestApi<Request.GetS3DownloadUrl, Response.GetS3DownloadUrl>(
    `/platform/v1/player/s3/download-url`,
    params,
    {
      name: "getS3DownloadUrl",
      method: "post"
    }
  )
}

export const uploadFileToS3 = async (params: Request.UploadFileToS3 & { upload_url: string }) => {
  return requestApi<File, Response.UploadFileToS3>(params.upload_url, params.file, {
    name: "uploadFileToS3",
    method: "put",
    headers: {
      "Content-Type": params.file.type
    },
    needToken: false,
    directCallAWS: true
  })
}
