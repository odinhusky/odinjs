import dayjs from "dayjs"
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import { getSetting } from "src/api/setting"
import { getS3DownloadUrl } from "src/api/s3"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useS3Upload } from "src/common/composables/useS3Upload"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { useEnvInfoStore } from "src/stores/envStore"
import { KYC_STATUS_CODE, KYC_TYPE, S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

export function useKyc() {
  const $q = useQuasar()

  const { getUserKyc, setUserKycV2 } = useUserInfo()
  const { uploadSingleFile } = useS3Upload()
  const { isOnBoarding } = useAuth()
  const userInfoStore = useUserInfoStore()
  const { userKyc } = storeToRefs(userInfoStore)
  const { setStoreUserKyc } = userInfoStore
  const { updateEnvAgentSetting } = useEnvInfoStore()

  const isLoading = ref<boolean>(true)
  const kycSetting = ref<Response.kycSetting[]>([])

  // KYC 拖曳事件 event
  const dragCounter = ref(0)
  const dragEnter = ref<number | null>(null)

  // 視窗 dragging 為外部事件需從props傳入
  const dragging = ref(false)

  const imageModules = import.meta.globEagerDefault("../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const resultImages = (url: string) => imageModules[`../assets/images/${url}`] || ""

  const placeholderImg = resultImages("kyc/placeholder.png")
  const pendingImg = resultImages("kyc/pending.png")
  const successImg = resultImages("kyc/verified.png")
  const failedImg = resultImages("kyc/reject.png")

  const fileConfig = {
    format: ["image/png", "image/jpeg", "image/jpg"],
    maxSizeInMB: 10,
    previewRatio: 268 / 164
  }

  async function getKycSetting() {
    isLoading.value = true
    const { status, data } = await useApi(getSetting)

    if (status) {
      if ("kyc_setting" in data) {
        kycSetting.value = JSON.parse(data.kyc_setting)
        matcheKycItemToSetting()
      }
      updateEnvAgentSetting(data)
    }

    isLoading.value = false
  }

  // 驗證檔案類型
  const isValidImageType = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    return validTypes.includes(file.type)
  }

  const isValidFileSize = (file: File) => {
    return file.size / (1024 * 1024) < fileConfig.maxSizeInMB
  }

  const setKycItemValue = (
    settingID: number,
    img: string,
    status: KYC_STATUS_CODE.Enums,
    kycType: KYC_TYPE.Enums,
    fileName = "",
    objectKey = ""
  ) => {
    const _kycItem = userKyc.value.find((i) => i.correspondence === settingID)

    if (status == KYC_STATUS_CODE.Enums.NONE) {
      if (_kycItem) {
        userKyc.value.splice(userKyc.value.indexOf(_kycItem), 1)
        setStoreUserKyc(userKyc.value)
      }
      return
    }

    if (_kycItem) {
      _kycItem.img = img
      _kycItem.status = status
      _kycItem.object_key = objectKey
    } else {
      userKyc.value.push({
        id: settingID,
        img: img,
        object_key: objectKey,
        status: status,
        type: kycType,
        correspondence: settingID,
        updated_time: 0,
        updated_at: 0,
        fileName: fileName
      })
      setStoreUserKyc(userKyc.value)
    }
  }

  const setUploadImage = async (itemId: number, file: any, kycType: KYC_TYPE.Enums) => {
    if (!isValidImageType(file)) {
      $q.notify({
        type: "negative",
        message: `Invalid file type, only accept ${fileConfig.format.join(",")}`
      })
      return
    }

    if (!isValidFileSize(file)) {
      $q.notify({
        type: "negative",
        message: `Invalid file size, max ${fileConfig.maxSizeInMB}MB`
      })
      return
    }

    // onBoarding 階段拿到的是短效 UUID token（非 JWT），S3 upload-url（/platform/v1/player/s3/upload-url）
    // 只認 JWT，會回「JWT token invalid token」。此階段後端 KYC 端點（/v1/player/auth/onboarding/kyc）
    // 直接吃 base64，因此略過 S3，直接以 base64 存為 preupload 的 img。
    if (isOnBoarding.value) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        setKycItemValue(itemId, e.target.result, KYC_STATUS_CODE.Enums.PREUPLOAD, kycType, file.name, "")
      }
      reader.readAsDataURL(file)
      return
    }

    $q.loading.show()
    const { status, data, msg } = await uploadSingleFile({
      file,
      storage_category: S3_STORAGE_CATEGORY.Enums.kyc
    })
    $q.loading.hide()

    if (!status || !data || !("objectKey" in data) || !data.objectKey) {
      $q.notify({
        type: "negative",
        message: String(msg || "Upload failed"),
        position: "top",
        timeout: 1500
      })
      return
    }

    const objectKey = data.objectKey
    const reader = new FileReader()
    reader.onload = (e: any) => {
      setKycItemValue(itemId, e.target.result, KYC_STATUS_CODE.Enums.PREUPLOAD, kycType, file.name, objectKey)
    }
    reader.readAsDataURL(file)
  }

  const onDeleteImage = (settingID: number, kycType: KYC_TYPE.Enums) => {
    setKycItemValue(settingID, "", KYC_STATUS_CODE.Enums.NONE, kycType)
  }

  // Dropzone 事件
  const onDragEnter = (settingID: number) => {
    dragEnter.value = settingID
  }
  const onDragLeave = () => {
    dragEnter.value = null
  }
  const onDrop = (itemId: number, e: any, kycType: KYC_TYPE.Enums) => {
    dragEnter.value = null
    const files = e.dataTransfer.files

    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setUploadImage(itemId, files[0], kycType)
    }
  }

  // File 上傳事件
  const triggerFileSelect = ($event: any) => {
    $event.target.closest(".kyc-placeholder").querySelector("input").click()
  }

  const onFileChange = (itemId: number, $event: any, kycType: KYC_TYPE.Enums) => {
    const files = $event.target.files
    if (files.length > 0) {
      setUploadImage(itemId, files[0], kycType)

      // input 的值重置，避免相同文件第二次無法觸發
      $event.target.value = ""
    }
  }

  // window 視窗拖曳事件
  const handleWindowDragEnter = () => {
    dragCounter.value += 1
    dragging.value = true
  }

  const handleWindowDragLeave = () => {
    dragCounter.value -= 1
    if (dragCounter.value === 0) {
      dragging.value = false
    }
  }

  const handleWindowDragDrop = () => {
    dragCounter.value = 0
    dragging.value = false
  }

  const isUploadedStatus = (status: KYC_STATUS_CODE.Enums) => {
    switch (status) {
      case KYC_STATUS_CODE.Enums.REVIEWING:
      case KYC_STATUS_CODE.Enums.VERIFIED:
      case KYC_STATUS_CODE.Enums.REJECTED:
      case KYC_STATUS_CODE.Enums.UNSUBMITTED:
        return true
    }
  }

  const uploadStatusToString = (status: KYC_STATUS_CODE.Enums) => {
    switch (status) {
      case KYC_STATUS_CODE.Enums.PREUPLOAD:
        return "preupload"
      case KYC_STATUS_CODE.Enums.NONE:
        return "none"
      case KYC_STATUS_CODE.Enums.REVIEWING:
        return "pending"
      case KYC_STATUS_CODE.Enums.VERIFIED:
        return "success"
      case KYC_STATUS_CODE.Enums.REJECTED:
      case KYC_STATUS_CODE.Enums.UNSUBMITTED:
        return "failed"
    }
  }

  const getFilename = (url: string) => {
    if (url.startsWith("data:image/")) {
      return ""
    }

    try {
      let filename = url.split(".")
      const ext = filename[1]
      filename = filename[0].split("/")

      return `${filename[3]}.${ext}`
    } catch (error) {
      return ""
    }
  }

  const getFilename2 = (kycItem: Response.UserKycItem) => {
    if (kycItem.fileName) return kycItem.fileName
    if (kycItem.img.startsWith("data:image/")) {
      return ""
    }

    try {
      let filename = kycItem.img.split(".")
      const ext = filename[1]
      filename = filename[0].split("/")

      return `${filename[3]}.${ext}`
    } catch (error) {
      return ""
    }
  }

  const getUploadDate = (unixtime: number | null) => {
    if (!unixtime) unixtime = dayjs().unix()
    return dayjs.unix(unixtime).format("YYYY/MM/DD")
  }

  const resolvePreviewUrl = async (img: string): Promise<string> => {
    if (!img) return ""
    // S3 新版路徑 → 換成 presigned GET URL
    if (img.startsWith("player/")) {
      const { status, data } = await useApi(getS3DownloadUrl, { object_key: img, expiration: 300 })
      if (status && data && "download_url" in data && data.download_url) {
        return data.download_url
      }
      return ""
    }
    // legacy uploads/... 等舊路徑，沿用原值由 CDN/既有 endpoint 處理
    return img
  }

  const getKycItem = async () => {
    await getUserKyc()

    // 後端回傳 S3 object key 時，img 需換成 presigned URL 才能顯示
    await Promise.all(
      userKyc.value.map(async (item) => {
        if (!item.img || !item.img.startsWith("player/")) return
        item.object_key = item.img
        item.img = await resolvePreviewUrl(item.object_key)
      })
    )
  }

  const matcheKycItemToSetting = () => {
    kycSetting.value.forEach((setting) => {
      const matchedItem = userKyc.value.find((item) => {
        return item.correspondence == setting.id
      })

      if (matchedItem) {
        setting.kycItemId = matchedItem.id
      }
    })
  }

  const handleSubmit = async () => {
    const canSubmit = showSubmit()
    if (!canSubmit) return

    // 比對已上傳的kyc資料
    // 如果沒有配對到setting則不需要上傳，避免上傳失敗
    let isUpdate = true

    const preUploadKycItem: {
      id: number
      kycItemId?: number
      img: string
      object_key?: string
      type: KYC_TYPE.Enums
      status: KYC_STATUS_CODE.Enums
      correspondence: number
      updated_at: number
    }[] = []

    userKyc.value.forEach((item) => {
      const matchedSetting = kycSetting.value.find((setting) => {
        return setting.id === item.correspondence
      })

      // onBoarding 走 base64（item.img），一般會員中心走 S3（item.object_key）
      const hasPayload = isOnBoarding.value ? !!item.img : !!item.object_key
      if (matchedSetting && item.status === KYC_STATUS_CODE.Enums.PREUPLOAD && hasPayload) {
        preUploadKycItem.push({ ...item, kycItemId: matchedSetting.kycItemId })
      }
    })

    const updateItemCount = preUploadKycItem.filter((i) => {
      return i.kycItemId
    })
    if (updateItemCount.length === 0) isUpdate = false

    const sendData = {
      imgs: preUploadKycItem.map((i) => {
        // onBoarding 端點吃 base64 img（新增，不帶 id/object_key）
        if (isOnBoarding.value) {
          return {
            img: i.img,
            type: i.type,
            correspondence: i.correspondence
          }
        }
        return {
          id: i.kycItemId,
          object_key: i.object_key,
          type: i.type,
          correspondence: i.correspondence
        }
      })
    }

    const { status } = await setUserKycV2(sendData, isUpdate)

    await getKycItem()
    await getKycSetting()

    return status
  }

  const showSubmit = () => {
    let show = false

    userKyc.value.forEach((item) => {
      if (item.status === KYC_STATUS_CODE.Enums.NONE || item.status === KYC_STATUS_CODE.Enums.PREUPLOAD) {
        show = true
      }
    })

    return show
  }

  return {
    isLoading,
    handleSubmit,
    showSubmit,
    getKycItem,
    getKycSetting,
    resolvePreviewUrl,
    kycSetting,
    dragEnter,
    dragging,
    fileConfig,
    isValidImageType,
    isValidFileSize,
    isUploadedStatus,
    uploadStatusToString,
    getFilename,
    getFilename2,
    getUploadDate,
    placeholderImg,
    pendingImg,
    successImg,
    failedImg,
    triggerFileSelect,
    onFileChange,
    onDeleteImage,
    onDragEnter,
    onDragLeave,
    onDrop,
    handleWindowDragEnter,
    handleWindowDragLeave,
    handleWindowDragDrop
  }
}
