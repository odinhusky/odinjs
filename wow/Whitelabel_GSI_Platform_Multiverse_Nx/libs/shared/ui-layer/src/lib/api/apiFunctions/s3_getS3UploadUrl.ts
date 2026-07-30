import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { S3_STORAGE_CATEGORY_ENUMS } from "@shared-lib/constants/enums/s3StorageCategory"

export interface GetS3UploadUrlParamsType {
  storage_category: S3_STORAGE_CATEGORY_ENUMS
  file_name?: string
  extension?: string
  content_type: string
  expiration: number
}

export type GetS3UploadUrlRequestType = GetS3UploadUrlParamsType

export interface GetS3UploadUrlResponseType {
  upload_url: string
  object_key: string
  expires_at: string
}

export const getS3UploadUrl = async (params: GetS3UploadUrlParamsType) => {
  return requestFn<GetS3UploadUrlRequestType, GetS3UploadUrlResponseType>(ENDPOINT_PATHS.S3.GET_UPLOAD_URL, params, {
    name: "getS3UploadUrl",
    method: "post"
  })
}
