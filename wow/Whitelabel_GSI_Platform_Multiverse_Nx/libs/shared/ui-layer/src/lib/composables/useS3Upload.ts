import {
  getS3UploadUrl,
  type GetS3UploadUrlParamsType,
  type GetS3UploadUrlResponseType
} from "@shared-lib/api/apiFunctions/s3_getS3UploadUrl"
import {
  uploadFileToS3,
  type UploadFileToS3 as UploadToS3Input
} from "@shared-lib/api/apiFunctions/s3_uploadFileToS3"

interface UploadResult {
  status: boolean
  data: { file: File; objectKey: string; expiresAt: string } | null
  msg: string
}

export function useS3Upload() {
  async function uploadSingleFile(params: UploadToS3Input): Promise<UploadResult> {
    const { file, storage_category, expiration = 600 } = params

    if (!storage_category) {
      return {
        status: false,
        data: null,
        msg: "storage_category is required"
      }
    }

    if (!file) {
      return {
        status: false,
        data: null,
        msg: "file is required"
      }
    }

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
    const extension = file.name.split(".").pop() || "png"

    try {
      const uploadUrlPayload: GetS3UploadUrlParamsType = {
        storage_category,
        file_name: fileNameWithoutExt,
        extension,
        content_type: file.type,
        expiration
      }

      const uploadUrlResult = await getS3UploadUrl(uploadUrlPayload)
      if (!uploadUrlResult.status || !uploadUrlResult.data) {
        return {
          status: false,
          data: null,
          msg: uploadUrlResult.msg || "Get upload URL failed"
        }
      }

      const uploadPayload = {
        upload_url: (uploadUrlResult.data as GetS3UploadUrlResponseType).upload_url,
        file,
        storage_category,
        expiration
      }

      const uploadResult = await uploadFileToS3(uploadPayload)
      if (!uploadResult.status) {
        return {
          status: false,
          data: null,
          msg: uploadResult.msg || "Upload to S3 failed"
        }
      }

      return {
        status: true,
        data: {
          file,
          objectKey: (uploadUrlResult.data as GetS3UploadUrlResponseType).object_key,
          expiresAt: (uploadUrlResult.data as GetS3UploadUrlResponseType).expires_at
        },
        msg: "Upload to S3 successful"
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      return {
        status: false,
        data: null,
        msg: errorMessage
      }
    }
  }

  async function uploadMultipleFiles(files: UploadToS3Input[]) {
    const invalidFiles = files.filter((item) => !item.file || !item.storage_category)
    if (invalidFiles.length > 0) {
      return invalidFiles.map((item) => ({
        status: false,
        data: null,
        msg: !item.storage_category ? "storage_category is required" : !item.file ? "file is required" : "Invalid file"
      }))
    }

    return await Promise.all(files.map((item) => uploadSingleFile(item)))
  }

  return {
    S3_STORAGE_CATEGORY: S3_STORAGE_CATEGORY_ENUMS,
    uploadSingleFile,
    uploadMultipleFiles
  }
}
