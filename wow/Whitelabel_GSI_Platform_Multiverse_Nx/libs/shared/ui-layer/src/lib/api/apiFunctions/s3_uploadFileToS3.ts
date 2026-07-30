import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { S3_STORAGE_CATEGORY_ENUMS } from "@shared-lib/constants/enums/s3StorageCategory"

export interface UploadFileToS3 {
  file: File
  storage_category: S3_STORAGE_CATEGORY_ENUMS
  expiration?: number
}

export type UploadFileToS3ParamsType = UploadFileToS3 & { upload_url: string }

export type UploadFileToS3ResponseType = {
  file: File
  objectKey: string
  expiresAt: string
}

export const uploadFileToS3 = async (params: UploadFileToS3ParamsType) => {
  return requestFn<File, UploadFileToS3ResponseType>(params.upload_url, params.file, {
    name: "uploadFileToS3",
    method: "put",
    headers: {
      "Content-Type": params.file.type
    },
    needToken: false,
    directCallAWS: true
  })
}
