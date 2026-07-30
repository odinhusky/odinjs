import { post, put } from "@/utils/request"
import { getS3UploadUrl, postS3Download } from "@/api/s3Upload"
import { useSearch } from "@/hook/useSearch"
import { ERROR_CODE, S3_STORAGE_CATEGORY } from "@/utils/constants"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

/**
 * *useS3Upload Hook*
 *
 * 提供單檔案、多檔案直接上傳至 AWS S3 的功能
 * 1. 先透過後端生成預簽名 upload url。
 * 2. 透過 upload url 直接將檔案上傳至 S3。
 *
 * 注意：
 * - file: 必填/欲上傳的 File
 * - storage_category: 必填/後端提供的分類
 */
export function useS3Upload() {
  /**
   * 單檔案上傳
   * @param params
   *   - file: File 檔案 (必填)
   *   - storage_category: S3 上的分類 (必填)
   *   - expiration: upload url 過期時間 (秒/選填/預設:600)
   *
   * 使用範例：
   * const { status, data, msg } = await uploadSingleFile({
   *   file: fileInput.files[0],
   *   storage_category: S3_STORAGE_CATEGORY.Enums.site_verification
   * });
   */
  async function uploadSingleFile(params: Request.UploadFileToS3): Promise<Response.UploadFileToS3> {
    const { file, storage_category, expiration = 600 } = params

    // storage_category 必填
    if (!storage_category) {
      console.warn("storage_category is required")
      return Promise.resolve({
        status: false,
        data: null,
        msg: "storage_category is required"
      })
    }

    // file 必填
    if (!file) {
      console.warn("file is required")
      return Promise.resolve({
        status: false,
        data: null,
        msg: "file is required"
      })
    }

    try {
      // 先從後端取得 S3 upload url
      const { search, tableData, status, message } = useSearch(getS3UploadUrl)
      const payload = {
        storage_category,
        file_name: file.name.replace(/\.[^/.]+$/, ""),
        extension: file.name.split(".").pop(),
        content_type: file.type,
        expiration
      }
      await search(payload)

      if (!status) {
        return { status, data: null, msg: message.value || "Get upload URL failed" }
      }

      const { upload_url, object_key, expires_at } = tableData.value

      // 透過 upload url 上傳到 S3
      const {
        status: uploadStatus,
        code: uploadCode,
        msg: uploadMsg
      } = await put<null>(upload_url, file, {
        headers: { "Content-Type": file.type },
        needToken: false,
        directCallAWS: true
      })

      if (!uploadStatus) {
        return Promise.resolve({
          status: uploadStatus,
          code: uploadCode,
          data: { file, objectKey: object_key, expiresAt: expires_at },
          msg: uploadMsg || message.value || "Upload to S3 failed"
        })
      }

      return Promise.resolve({
        status: uploadStatus,
        data: { file, objectKey: object_key, expiresAt: expires_at },
        msg: "Upload to S3 successful"
      })
    } catch (err: any) {
      return Promise.resolve({ status: false, data: null, msg: err.message || "Upload failed" })
    }
  }

  /**
   * 多檔案上傳
   * @param files Array<Request.UploadFileToS3>
   *   每個元素必須包含：
   *     - file: File 物件
   *     - storage_category: S3 存儲分類
   *
   * 使用範例：
   * const { status, data, msg } = await uploadMultipleFiles(
   *   Array.from(fileInput.files).map(file => ({
   *     file,
   *     storage_category: S3_STORAGE_CATEGORY.Enums.avatar
   *   }))
   * );
   */
  async function uploadMultipleFiles(files: Request.UploadFileToS3[]): Promise<Response.UploadFileToS3[]> {
    // 防呆檢查每個檔案
    const invalidFiles = files.filter((f) => !f.file || !f.storage_category)
    if (invalidFiles.length > 0) {
      return invalidFiles.map((f) => ({
        status: false,
        data: null,
        msg: !f.storage_category ? "storage_category is required" : !f.file ? "file is required" : "Invalid file"
      }))
    }

    return await Promise.all(files.map((f) => uploadSingleFile(f)))
  }

  /**
   * 下載檔案
   * @param params
   *   - object_key: object_key (必填)
   *   - expiration: upload url 過期時間 (秒/選填/預設:600)
   *   - file_name: 檔名 (選填)
   *
   * 使用範例：
   * const { status, data, msg } = await uploadSingleFile({
   *  file_name: siteVerificationItem.file_name,
   *  object_key: siteVerificationItem.storage_key
   * });
   */
  async function handlePostS3Download(
    params: Request.PostS3Download
  ): Promise<Response.BaseResponse<Response.PostS3Download | null>> {
    const { file_name, object_key, expiration = 600 } = params

    // object_key 必填
    if (!object_key) {
      console.warn("object_key is required")
      return Promise.resolve({
        status: false,
        data: null,
        msg: "object_key is required",
        code: ERROR_CODE.Enums.PAYLOAD_NOT_ALLOW
      })
    }

    try {
      const { search, tableData, status, message, resCode } = useSearch(postS3Download)
      const payload = {
        file_name,
        object_key,
        expiration
      }
      await search(payload)

      return {
        status: status.value,
        msg: message.value,
        data: tableData.value,
        code: resCode.value
      }
    } catch (err: any) {
      return Promise.resolve({
        status: false,
        data: null,
        msg: err.message || "Post S3 Download failed",
        code: ERROR_CODE.Enums.SERVER_EXCEPTION
      })
    }
  }

  return {
    S3_STORAGE_CATEGORY,
    uploadSingleFile,
    uploadMultipleFiles,
    handlePostS3Download
  }
}
