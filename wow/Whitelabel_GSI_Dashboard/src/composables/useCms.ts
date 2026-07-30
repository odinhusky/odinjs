import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import type { QTableProps } from "quasar"
import { useQuasar } from "quasar"
import { clone } from "ramda"
import { useSearch } from "@/hook/useSearch"
import { useCommon } from "src/hook/useCommon"
import { useLanguage } from "src/composables/useLanguage"
import { useS3Upload } from "src/composables/useS3Upload"
import { useSiteStore } from "src/stores/siteStore"
import { useFileStore } from "src/stores/fileStore"
import { useQueryStore } from "src/stores/queryStore"
import relativeToAbsoluteResource from "@/utils/relativeToAbsoluteResource"
import type { LANGUAGE_TYPE } from "src/utils/constants"
import {
  CMS_TYPE,
  CMS_ARRANGEMENT,
  CMS_ENTRANCE_SORT,
  CMS_ENTRANCE_TYPE,
  CMS_DISPLAY_LOGIN,
  CMS_DISPLAY_DEVICE,
  CMS_OPENING_METHOD,
  CMS_VIEW_SHOW,
  CMS_PAGE_COMPONENT_TYPE,
  GAME_TYPE,
  ENTRANCE_TYPE
} from "src/utils/constants"
import {
  getCmsList,
  getCmsDetail,
  updateCmsItemSort,
  updateCmsItemStatus,
  addCmsItem,
  editCmsItem,
  delCmsItem,
  updateCmsItemPopup
} from "src/api/cms"
import {
  getEntranceTypeList,
  getIntegrationList,
  getAgentGameTypeList,
  getProductList,
  getCmsGameDropdown
} from "@/api/productV2"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useEnv } from "src/hook/useEnv"
import { usePermission } from "@/hook/usePermission"
import { useImage } from "src/hook/useImage"

// 模組級別的單例狀態，確保所有組件共享同一個 cmsForm
const sharedCmsForm = ref<Request.CmsForm | null>(null)

export function useCms() {
  const $q = useQuasar()
  const { t } = useI18n()
  const router = useRouter()
  const siteStore = useSiteStore()
  const queryStore = useQueryStore()
  const { langList } = storeToRefs(siteStore)
  const { numberEnumToArray, isBase64Image } = useCommon()
  const { S3_STORAGE_CATEGORY, uploadSingleFile } = useS3Upload()
  const { getLanguage } = useLanguage()
  const { envData, removePrefixDeep } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { permission } = usePermission()
  const fileStore = useFileStore()
  const { setFile, getFile, removeFile, clearFiles } = fileStore
  const { getGamePublicImg, getProductPublicImg, cmsCustomPage } = useImage()

  const isOld = siteStore.product_v2_agent

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Failed to convert blob to base64"))
      reader.readAsDataURL(blob)
    })

  type productType = {
    product_code: number
    product_name: string
  }
  const productData = ref<productType[]>([])
  const optionsSort = {
    min: 1,
    minimumFractionDigits: "0",
    precision: "0",
    nullValue: ""
  }

  // 排列方式
  const arrangementList = computed(() =>
    numberEnumToArray(CMS_ARRANGEMENT.Enums).map((e) => {
      const value = e as CMS_ARRANGEMENT.Enums
      return {
        label: t(CMS_ARRANGEMENT.I18nKeys[value]),
        value
      }
    })
  )

  // 入口排序
  const entranceSortList = computed(() =>
    numberEnumToArray(CMS_ENTRANCE_SORT.Enums).map((e) => {
      const value = e as CMS_ENTRANCE_SORT.Enums
      return {
        label: t(CMS_ENTRANCE_SORT.I18nKeys[value]),
        value
      }
    })
  )

  // 入口連結類型
  const entranceTypeList = computed(() =>
    numberEnumToArray(CMS_ENTRANCE_TYPE.Enums).map((e) => {
      const value = e as CMS_ENTRANCE_TYPE.Enums
      return {
        label: t(CMS_ENTRANCE_TYPE.I18nKeys[value]),
        value
      }
    })
  )

  // 登入前後
  const displayLoginList = computed(() =>
    numberEnumToArray(CMS_DISPLAY_LOGIN.Enums).map((e) => {
      const value = e as CMS_DISPLAY_LOGIN.Enums
      return {
        label: t(CMS_DISPLAY_LOGIN.I18nKeys[value]),
        value
      }
    })
  )

  // 顯示裝置
  const displayDeviceList = computed(() =>
    numberEnumToArray(CMS_DISPLAY_DEVICE.Enums).map((e) => {
      const value = e as CMS_DISPLAY_DEVICE.Enums
      return {
        label: t(CMS_DISPLAY_DEVICE.I18nKeys[value]),
        value
      }
    })
  )

  // 入口連結類型
  const openingMethodList = computed(() =>
    numberEnumToArray(CMS_OPENING_METHOD.Enums).map((e) => {
      const value = e as CMS_OPENING_METHOD.Enums
      return {
        label: t(CMS_OPENING_METHOD.I18nKeys[value]),
        value
      }
    })
  )

  // 遊戲入口類型
  const gameTypeEntranceTypeList = computed(() =>
    numberEnumToArray(GAME_TYPE.ENTRANCE_TYPE).map((e) => {
      const value = e as GAME_TYPE.ENTRANCE_TYPE
      return {
        label: t(GAME_TYPE.EntranceTypeI18nKeys[value]),
        value
      }
    })
  )

  //遊戲類別
  const agent_code = siteStore.agent_code.toLocaleLowerCase()
  const gameTypeList = computed(() =>
    queryStore.gameTypeList.map((item) => {
      let label = t(GAME_TYPE.I18nKeys[item.value as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")

      if (agent_code === "anip") {
        if (item.value === GAME_TYPE.Enums.SLOT) {
          label = t("common.ecasino")
        } else if (item.value === GAME_TYPE.Enums.SPORTBOOK) {
          label = t("common.sports_betting")
        }
      }
      return {
        ...item,
        label
      }
    })
  )
  //cms 類別管理
  const cateGoryList = computed(() =>
    queryStore.cmsCategoryList.map((item) => {
      return {
        label: item.label,
        value: item.value
      }
    })
  )

  // view_all
  const viewAllList = computed(() =>
    numberEnumToArray(CMS_VIEW_SHOW.Enums).map((e) => {
      const value = e as CMS_VIEW_SHOW.Enums
      return {
        label: t(CMS_VIEW_SHOW.I18nKeys[value]),
        value
      }
    })
  )
  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns = [
      {
        name: "sort",
        label: t("table_header.order"),
        field: "sort",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "displayLogin",
        label: t("table_header.before_after_login"),
        field: "displayLogin",
        sortable: false,
        align: "center"
      },
      {
        name: "icon",
        label: "icon",
        field: "icon",
        sortable: false,
        align: "center"
      },
      {
        name: "enabled",
        label: t("table_header.enable_or_disable"),
        field: "enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 剔除 actions 列
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const titleLangObj = computed(() => {
    const langObj: Response.CmsLangTitle = {}
    langList.value.forEach((e) => {
      langObj[e.label] = ""
    })
    return langObj
  })

  const pageLangObj = computed(() => {
    return langList.value.map((e) => {
      return {
        lang: e.label,
        title: "",
        content: ""
      }
    })
  })

  const emptyCmsEntrance = computed<Request.CmsEntranceItem>(() => {
    return {
      type: CMS_ENTRANCE_TYPE.Enums.GAME_LINK,
      lang: clone(titleLangObj.value),
      payload: {},
      img: ""
    }
  })

  const isLoading = ref(false)
  const cmsList = ref<Response.CmsList>([])

  // 使用共享的 cmsForm，如果尚未初始化則進行初始化
  if (!sharedCmsForm.value) {
    sharedCmsForm.value = {
      type: CMS_TYPE.Enums.HOME,
      url_id: 0,
      title: "",
      setting: {
        lang: clone(titleLangObj.value),
        contact_lang: clone(titleLangObj.value),
        icon: "",
        selected_icon: "",
        arrangement: CMS_ARRANGEMENT.Enums.MULTIPLE_ROWS_SCROLL,
        entrance_sort: CMS_ENTRANCE_SORT.Enums.CUSTOM,
        display_login: CMS_DISPLAY_LOGIN.Enums.NO_RESTRICTIONS,
        display_device: CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS,
        view_all: CMS_VIEW_SHOW.Enums.HIDE,
        opening_method: CMS_OPENING_METHOD.Enums.NEW_TAB,
        row_show_pc: 0,
        row_show_mob: 0,
        logo_sort: [],
        img_lang: clone(titleLangObj.value),
        icon_lang: clone(titleLangObj.value),
        contact_img_lang: clone(titleLangObj.value),
        pop_up_img: [],
        comfirm_button_lang: clone(titleLangObj.value),
        reject_button_lang: clone(titleLangObj.value),
        pop_up_content: "",
        arrangement_row_pc: 0,
        arrangement_row_mob: 0,
        product_entrance_type: "",
        product_integration_id: "",
        product_type: "",
        product_code: "",
        style: {}
      },
      entrance: [],
      page: langList.value.map((e) => {
        return {
          lang: e.label,
          title: "",
          content: ""
        }
      }),
      is_editable: true
    }
  }

  // 創建一個 computed ref 來保持向後兼容
  const cmsForm = computed({
    get: () => sharedCmsForm.value!,
    set: (val) => {
      sharedCmsForm.value = val
    }
  })

  function initCmsForm(type: CMS_TYPE.Enums) {
    cmsForm.value = {
      type: type,
      url_id: 0,
      title: "",
      setting: {
        lang: clone(titleLangObj.value),
        contact_lang: clone(titleLangObj.value),
        icon: "",
        selected_icon: "",
        arrangement: CMS_ARRANGEMENT.Enums.MULTIPLE_ROWS_SCROLL,
        entrance_sort: CMS_ENTRANCE_SORT.Enums.CUSTOM,
        display_login: CMS_DISPLAY_LOGIN.Enums.NO_RESTRICTIONS,
        display_device: CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS,
        view_all: CMS_VIEW_SHOW.Enums.HIDE,
        opening_method: CMS_OPENING_METHOD.Enums.NEW_TAB,
        row_show_pc: 0,
        row_show_mob: 0,
        logo_sort: [],
        img_lang: clone(titleLangObj.value),
        icon_lang: clone(titleLangObj.value),
        contact_img_lang: clone(titleLangObj.value),
        pop_up_img: [],
        comfirm_button_lang: clone(titleLangObj.value),
        reject_button_lang: clone(titleLangObj.value),
        pop_up_content: "",
        arrangement_row_pc: 0,
        arrangement_row_mob: 0,
        product_entrance_type: "",
        product_integration_id: "",
        product_type: "",
        product_code: "",
        style: {}
      },
      entrance: [],
      page: langList.value.map((e) => {
        return {
          lang: e.label,
          title: "",
          content: ""
        }
      }),
      is_editable: true
    }
  }

  async function initEntrance() {
    const deepCloneEntrance = clone(emptyCmsEntrance.value)
    await handleEntranceType(deepCloneEntrance)

    return deepCloneEntrance
  }

  async function addCmsFormEntrance() {
    const deepCloneEntrance = await initEntrance()
    cmsForm.value.entrance.push(deepCloneEntrance)
    /*
    if (cmsForm.value.type === CMS_TYPE.Enums.CATEGORYMANAGEMENT) {
      const entrance = cmsForm.value.entrance.length - 1
      const validSorts = cmsForm.value.entrance
        .map((item: any) => item.sort)
        .filter((s) => typeof s === "number" && !isNaN(s))

      const maxSort = validSorts.length > 0 ? Math.max(...validSorts) : 0
      const result = productData.value.find((p) => p.product_code === cmsForm.value.setting.product_code)
      cmsForm.value.entrance[entrance].lang = result.product_name_i18n
      cmsForm.value.entrance[entrance].sort = maxSort + 1
      cmsForm.value.entrance[entrance].type = cmsForm.value.setting.product_entrance_type
      cmsForm.value.entrance[entrance].payload.game_type = cmsForm.value.setting.product_type as number
      cmsForm.value.entrance[entrance].payload.product_code = cmsForm.value.setting.product_code as number
      console.log(cmsForm.value.entrance)
    }*/
  }

  async function handleGetCmsList(type: CMS_TYPE.Enums, lan = "") {
    const { search, status, tableData } = useSearch(getCmsList)
    isLoading.value = true
    await search({ type, lan })
    isLoading.value = false

    if (status.value) {
      cmsList.value = tableData.value
    }
  }

  async function handleDelCmsList(item: { type: CMS_TYPE.Enums; id: number }) {
    const { search, status } = useSearch(delCmsItem)
    isLoading.value = true
    await search(item.id)
    isLoading.value = false

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      handleGetCmsList(item.type)
    }
  }

  async function handleGetCmsDetail(id: number, type = 1) {
    const { search, status, tableData } = useSearch(getCmsDetail)
    isLoading.value = true
    await search(id)
    isLoading.value = false

    if (status.value) {
      await queryStore.getGameTypeList()
      await queryStore.getCmsHomeList()
      await queryStore.getCmsCustomPageList()
      await queryStore.getCustomerServiceLinkList()
      await queryStore.getCmsInternaslList()

      // TODO: 內部頁面
      cmsForm.value.type = type
      cmsDetailToForm(tableData.value, id)
      checkLangList()
    }
  }

  function formatImg(item: { base64?: string; path: string; updatedTime: number }) {
    const withUpdateTime = (url: string, updatedTime: number) => {
      // 只保留最後一次設定的 updateTime，避免重複疊加
      try {
        const u = new URL(url)
        u.searchParams.set("updateTime", String(updatedTime))
        return u.toString()
      } catch {
        // 若不是可被 URL() 解析的絕對網址，退回字串方式處理
        const [base, hash = ""] = url.split("#")
        const [pathPart, query = ""] = base.split("?")
        const params = new URLSearchParams(query)
        params.set("updateTime", String(updatedTime))
        const next = `${pathPart}?${params.toString()}`
        return hash ? `${next}#${hash}` : next
      }
    }

    if (item.path) {
      let path = item.path

      // 如果是完整的 URL，直接返回，並附加上更新時間避免快取
      if (path.startsWith("http")) {
        return withUpdateTime(path, item.updatedTime)
      }

      // 移除開頭的斜槓，統一處理
      if (path.startsWith("/")) {
        path = path.slice(1)
      }

      try {
        // 解析資源基礎 URL
        const baseUrl = new URL(VITE_APP_DYNAMIC_RESOURCE_URL)
        const baseRoot = baseUrl.origin
        // 取得基礎路徑的前綴（例如 "gsi/staging/SITS"）
        const basePrefix = baseUrl.pathname.replace(/^\/|\/$/g, "")

        // 如果 path 已經包含該前綴，則只拼接 origin，避免路徑重複
        if (basePrefix && path.startsWith(basePrefix)) {
          return withUpdateTime(`${baseRoot}/${path}`, item.updatedTime)
        }
      } catch (error) {
        // 解析失敗則回退到預設的拼接方式
      }

      return withUpdateTime(`${VITE_APP_DYNAMIC_RESOURCE_URL}/${path}`, item.updatedTime)
    }
    if (item.base64) {
      return item.base64
    }
    return ""
  }

  function cmsDetailToForm(item: Response.CmsDetail, id: number) {
    cmsForm.value.id = id
    cmsForm.value.url_id = item.url_id
    cmsForm.value.title = item.title

    cmsForm.value.setting.lang = item.setting.lang
    cmsForm.value.setting.contact_lang = item.setting.contact_lang
    cmsForm.value.setting.icon = formatImg({
      base64: item.setting.icon_base64,
      path: item.setting.icon_path,
      updatedTime: item.setting.updated_time
    })
    cmsForm.value.setting.selected_icon = formatImg({
      base64: "",
      path: item.setting.selected_icon_path,
      updatedTime: item.setting.updated_time
    })
    cmsForm.value.setting.pop_up_img[0] = formatImg({
      base64: "",
      path: item.setting.pop_up_img[0],
      updatedTime: item.setting.updated_time
    })
    cmsForm.value.setting.pop_up_img[1] = formatImg({
      base64: "",
      path: item.setting.pop_up_img[1],
      updatedTime: item.setting.updated_time
    })

    cmsForm.value.setting.arrangement = item.setting.payload.arrangement
    cmsForm.value.setting.entrance_sort = item.setting.payload.entrance_sort
    cmsForm.value.setting.display_login = item.setting.payload.display_login
    cmsForm.value.setting.display_device = item.setting.payload.display_device
    cmsForm.value.setting.view_all = item.setting.payload.view_all ?? 0
    cmsForm.value.setting.opening_method = item.setting.payload.opening_method
    cmsForm.value.setting.row_show_pc = item.setting.payload.row_show_pc ?? 0
    cmsForm.value.setting.row_show_mob = item.setting.payload.row_show_mob ?? 0
    cmsForm.value.setting.logo_sort = item.setting.logo_sort
    cmsForm.value.setting.comfirm_button_lang = item.setting.comfirm_button_lang
    cmsForm.value.setting.reject_button_lang = item.setting.reject_button_lang
    cmsForm.value.setting.pop_up_content = item.setting.pop_up_content ?? ""

    cmsForm.value.setting.arrangement_row_pc = item.setting.payload.arrangement_row_pc ?? 0
    cmsForm.value.setting.arrangement_row_mob = item.setting.payload.arrangement_row_mob ?? 0

    /*if (cmsForm.value.type !== CMS_TYPE.Enums.CATEGORYMANAGEMENT) {
      cmsForm.value.setting.product_entrance_type = 0
      cmsForm.value.setting.product_integration_id = 0
    } else {
      cmsForm.value.setting.product_entrance_type = item.setting.payload.product_entrance_type ?? ""
      cmsForm.value.setting.product_integration_id = item.setting.payload.product_integration_id ?? ""
    }*/
    cmsForm.value.setting.product_entrance_type = 0
    cmsForm.value.setting.product_integration_id = 0

    // style 現在保留在每個 entrance 項目中，無需遷移

    cmsForm.value.entrance = item.entrance.map((e) => {
      if (!e.payload) {
        e.payload = {}
        handleEntranceType(e as any as Request.CmsEntranceItem)
      }
      const sortedLang: { [key: string]: string } = {}
      Object.keys(titleLangObj.value).forEach((key: string) => {
        sortedLang[key] = e.lang[key as keyof typeof e.lang] || ""
      })

      const gameTypeString = queryStore.gameTypeIdMap[e.payload.game_type || 1]
      const product_code = e.payload.product_code
      const integration_id = e.payload.product_integration_id
      const game_code = e.payload.game_code

      if (e.payload.nested_entrance) {
        e.payload.nested_entrance = e.payload.nested_entrance.map((subEntrance) => {
          const sortedSubEntranceLang: { [key: string]: string } = {}
          Object.keys(titleLangObj.value).forEach((key: string) => {
            sortedSubEntranceLang[key] = subEntrance.lang[key as keyof typeof subEntrance.lang] || ""
          })
          subEntrance.lang = sortedSubEntranceLang

          if (subEntrance.img_path === "" && subEntrance.payload.game_code) {
            const gameTypeNested = queryStore.gameTypeIdMap[subEntrance.payload.game_type || 1]
            subEntrance.img = getGamePublicImg(
              subEntrance.payload.product_integration_id,
              gameTypeNested,
              subEntrance.payload.product_code,
              subEntrance.payload.game_code
            )
          } else {
            subEntrance.img = formatImg({
              base64: subEntrance.img_base64,
              path: subEntrance.img_path,
              updatedTime: 0
            })
          }

          return subEntrance
        })
      }

      if (e.img_path === "" && product_code && game_code) {
        return {
          type: e.type,
          payload: e.payload,
          lang: sortedLang,
          img: getGamePublicImg(integration_id, gameTypeString, product_code, game_code)
        }
      } else if (e.img_path === "" && product_code) {
        return {
          type: e.type,
          payload: e.payload,
          lang: sortedLang,
          img: getProductPublicImg({ gameType: gameTypeString, productCode: product_code, siteKey: "okbet" })
        }
      } else {
        return {
          type: e.type,
          payload: e.payload,
          lang: sortedLang,
          img: formatImg({ base64: e.img_base64, path: e.img_path, updatedTime: e.updated_time })
        }
      }
      /*if (cmsForm.value.type !== CMS_TYPE.Enums.CATEGORYMANAGEMENT) {
        const sortedLang: { [key: string]: string } = {}
        Object.keys(titleLangObj.value).forEach((key: string) => {
          sortedLang[key] = e.lang[key as keyof typeof e.lang] || ""
        })
        return {
          type: e.type,
          payload: e.payload,
          lang: sortedLang,
          img: formatImg({ base64: e.img_base64, path: e.img_path, updatedTime: e.updated_time })
        }
      } else {
        return {
          type: e.type,
          payload: e.payload,
          lang: e.lang,
          sort: e.sort
        }
      }*/
    })

    //首頁形象圖
    cmsForm.value.setting.img_lang = item.setting.img_lang
    Object.keys(cmsForm.value.setting.img_lang).forEach((key) => {
      const imgLangKey = key as keyof typeof cmsForm.value.setting.img_lang

      cmsForm.value.setting.img_lang[imgLangKey] = formatImg({
        path: cmsForm.value.setting.img_lang[imgLangKey] as string,
        updatedTime: Date.now()
      })
    })

    //icon多語
    cmsForm.value.setting.icon_lang = item.setting.icon_lang
    Object.keys(cmsForm.value.setting.icon_lang).forEach((key) => {
      const imgLangKey = key as keyof typeof cmsForm.value.setting.icon_lang

      cmsForm.value.setting.icon_lang[imgLangKey] = formatImg({
        path: cmsForm.value.setting.icon_lang[imgLangKey] as string,
        updatedTime: Date.now()
      })
    })
    //聯繫多語
    if (Object.keys(item.setting.contact_img_lang).length) {
      // 因為拔掉上傳限制，可能會缺少語系
      // cmsForm.value.setting.contact_img_lang = item.setting.contact_img_lang
      Object.keys(item.setting.contact_img_lang).forEach((key) => {
        const imgLangKey = key as keyof typeof item.setting.contact_img_lang

        cmsForm.value.setting.contact_img_lang[imgLangKey] = formatImg({
          path: item.setting.contact_img_lang[imgLangKey] as string,
          updatedTime: Date.now()
        })
      })
    }

    cmsForm.value.page = item.page

    cmsForm.value.is_editable = item.is_editable ?? true
  }

  function checkLangList() {
    // 如果後續有新開語系，要補上欄位供編輯
    const pageLangList = cmsForm.value.page.map((e) => e.lang)
    Object.keys(titleLangObj.value).forEach((e) => {
      const lang = e as LANGUAGE_TYPE.Enums
      if (!cmsForm.value.setting.lang[lang]) {
        cmsForm.value.setting.lang[lang] = ""
      }

      cmsForm.value.entrance.forEach((entrance) => {
        if (!entrance.lang[lang]) {
          entrance.lang[lang] = ""
        }
      })

      if (!pageLangList.includes(lang)) {
        cmsForm.value.page.push({
          lang,
          title: "",
          content: ""
        })
      }
    })
    //過濾語系
    const langKeys = ["lang", "img_lang", "icon_lang", "contact_lang", "contact_img_lang"] as const
    const validLangs = Object.keys(titleLangObj.value)
    langKeys.forEach((key) => {
      const original = cmsForm.value.setting[key] as Record<string, any>
      if (original && typeof original === "object") {
        cmsForm.value.setting[key] = Object.fromEntries(
          Object.entries(original).filter(([lang]) => validLangs.includes(lang))
        ) as typeof original
      }
    })
  }

  function parsePage(pages?: Request.CmsPageItem[]) {
    if (pages && pages.length) {
      let page = pages[0]
      const langPage = pages.find((e) => e.lang === getLanguage())

      if (langPage) {
        page = langPage
      }
      page.content = page.content.replaceAll(VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL)

      return page
    }

    return null
  }

  async function handleCmsItemSort(params: Request.UpdateCmsItemSort) {
    const { search, status } = useSearch(updateCmsItemSort)
    isLoading.value = true
    await search(params)
    isLoading.value = false
    if (status.value) {
      await handleGetCmsList(params.type)
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  async function handleCmsItemStatus(params: Request.UpdateCmsItemStatus) {
    const { search, status } = useSearch(updateCmsItemStatus)
    isLoading.value = true
    await search(params)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  async function handleUpdateCmsItemPopup(params: Request.UpdateCmsItemPopup) {
    const { search, status } = useSearch(updateCmsItemPopup)
    isLoading.value = true
    await search(params)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }
  async function processEntranceList(
    list: Request.CmsEntranceItem[],
    isSub = false
  ): Promise<Request.CmsEntranceItem[]> {
    return Promise.all(
      list.map(async (item, index) => {
        item.sort = index + 1
        // console.log(item)
        if (item.imgFileName) {
          const file = getFile(item.imgFileName)

          if (file) {
            const { status, data, msg } = await uploadSingleFile({
              file,
              storage_category: S3_STORAGE_CATEGORY.Enums.cms
            })
            // 上傳成功才有s3圖片
            if (status && data) {
              item.img_path = data.objectKey
            } else {
              // 上傳失敗存base64
              if (isBase64Image(item.img)) {
                item.img_base64 = item.img
              }
            }
            delete item.imgFileName
          } else {
            // 如果沒有圖檔則保存base64
            if (isBase64Image(item.img)) {
              item.img_base64 = item.img
            }
          }
        } else {
          // 如果沒有圖檔則保存base64
          if (isBase64Image(item.img)) {
            item.img_base64 = item.img
          }
          console.log(item.img)
          //如果是在產品管理自己傳的產品圖

          if (item.img?.includes("uploads/")) {
            item.img_path = item.img
          }
          // 如果是產品本身的預設圖
          else if (item.img?.includes("publics/images/games")) {
            item.img_path = ""
          }
        }

        if (isSub) {
          item.img = ""
        }

        // 如果有子入口，遞迴處理
        if (item.payload?.nested_entrance?.length) {
          item.payload.nested_entrance = await processEntranceList(item.payload.nested_entrance, true)
        }

        return item
      })
    )
  }

  async function handleEntrenceItemPayload(item: Request.CmsEntranceItem) {
    if (item.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK) {
      if (!item.payload.game_type) {
        await handleAgentGameTypeList()
        if (productGameTypeList.value.length) {
          item.payload.game_type = productGameTypeList.value[0].value as number
        }
      }

      if (!item.payload.product_code) {
        await queryStore.getProductV2DropdownList()
        if (queryStore.productDropdownV2.length) {
          const product = queryStore.productDropdownV2.find(
            (e) => e.integrationId === item.payload.product_integration_id && e.gameTypeId === item.payload.game_type
          )
          if (product) {
            item.payload.product_code = product.value
          }
        }
      }

      if (!item.payload.game_code) {
        await handleFitstProductGameList({
          integration_id: 1,
          product_code: item.payload.product_code,
          game_type: item.payload.game_type
        })
        if (firstProductGameList.value.length) {
          item.payload.game_code = firstProductGameList.value[0].value as string
        }
      }
    }
    // langList
    if (item.type === CMS_PAGE_COMPONENT_TYPE.Enums.TEXT && item.payload.page && item.payload.page.length) {
      const pages = item.payload.page
      item.payload.page = langList.value.map(({ label }) => {
        const exist = pages.find((p) => p.lang === label)
        return {
          lang: label,
          title: exist?.title || "",
          content: exist?.content || ""
        }
      })
    }
    // TODO: Aiden說不做 根據type agent 檢查資料
    // if (item.type === CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE) {
    // }
  }

  async function parseEntranceList(list: Request.CmsEntranceItem[], _isSub = false) {
    return Promise.all(
      list.map(async (item) => {
        if (item.imgFileName) {
          try {
            const imageUrl = cmsCustomPage(item.imgFileName)
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const file = new File([blob], item.imgFileName, { type: blob.type })

            setFile(file)
            item.img = await blobToBase64(blob)
          } catch (error) {
            console.warn(`Failed to preload image file: ${item.imgFileName}`, error)
          }
        }

        handleEntrenceItemPayload(item)

        if (item.payload?.nested_entrance?.length) {
          await parseEntranceList(item.payload.nested_entrance, true)
        }

        return item
      })
    )
  }

  async function handleAddCmsItem(routerName: string) {
    const { search, status } = useSearch(addCmsItem)
    isLoading.value = true

    //暫時 待類別管理好了
    if (cmsForm.value.type !== 12) {
      cmsForm.value.setting.product_entrance_type = 0
      cmsForm.value.setting.product_integration_id = 0
    }

    // let payload: Request.CmsForm = removePrefixDeep(cmsForm.value, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
    let payload: Request.CmsForm = clone(cmsForm.value)

    if (payload.type === CMS_TYPE.Enums.CUSTOM_PAGE) {
      payload.entrance = await processEntranceList(payload.entrance)
    }
    //如果裡面有預設圖就不要存，保留 entrance.style（每個元件獨立樣式）
    payload.entrance = payload.entrance.map((item) => {
      return {
        ...item,
        img: item.img?.includes("publics/images/games") || item.img?.includes("images/products") ? "" : (item.img ?? "")
      }
    })
    await search(payload)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      if (routerName) {
        clearFiles()
        router.push({ name: routerName })
        return
      }
    }
  }

  async function handleEditCmsItem(routerName: string) {
    const { search, status } = useSearch(editCmsItem)
    isLoading.value = true

    let payload: Request.CmsForm = clone(cmsForm.value)
    // let payload: Request.CmsForm = removePrefixDeep(cmsForm.value, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
    // payload = removePrefixDeep(payload, `${VITE_APP_BASE_API}/`)
    /*
    payload = removePrefixDeep(payload, `gsi/dev/devm/`)*/

    if (payload.type === CMS_TYPE.Enums.CUSTOM_PAGE) {
      payload.entrance = await processEntranceList(payload.entrance)
    }
    //如果裡面有預設圖就不要存，保留 entrance.style（每個元件獨立樣式）
    payload.entrance = payload.entrance.map((item) => {
      return {
        ...item,
        img: item.img?.includes("publics/images/games") || item.img?.includes("images/products") ? "" : (item.img ?? "")
      }
    })
    await search(payload)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      if (routerName) {
        router.push({ name: routerName })
        return
      }
    }
  }

  type DropdownType = {
    label: string
    value: string | number
  }
  const productEntranceTypeList = ref<DropdownType[]>([])
  const productIntegrationList = ref<DropdownType[]>([])
  const productGameTypeList = ref<DropdownType[]>([])
  const productGameList = ref<DropdownType[]>([])
  const firstProductGameList = ref<DropdownType[]>([])

  async function handleEntranceTypeList() {
    if (productEntranceTypeList.value.length) {
      return
    }
    isLoading.value = true
    const { data } = await getEntranceTypeList()
    isLoading.value = false

    if (!data || !Object.keys(data).length) {
      return
    }

    productEntranceTypeList.value = data.map((e) => {
      const label = t(ENTRANCE_TYPE.I18nKeys[e.type as keyof typeof ENTRANCE_TYPE.I18nKeys] || "common.unknow")
      const value = e.type
      return {
        label,
        value
      }
    })
  }
  async function handleIntegrationList() {
    if (productIntegrationList.value.length) {
      return
    }
    isLoading.value = true
    const { data } = await getIntegrationList()
    isLoading.value = false
    if (!data || !Object.keys(data).length) {
      return
    }
    productIntegrationList.value = data.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  }
  //用在CMS類別管理
  async function handleFitstProductGameList(params: {
    game_type?: number
    product_code?: number
    integration_id?: number
  }) {
    if (firstProductGameList.value.length) {
      return
    }
    isLoading.value = true

    const { data } = await getCmsGameDropdown(params)

    isLoading.value = false
    if (!data || !Object.keys(data).length) {
      return
    }

    firstProductGameList.value = data.map((e) => {
      const label = e.game_name
      const value = e.game_code
      return {
        label,
        value
      }
    })
  }
  async function handleAgentGameTypeList() {
    if (productGameTypeList.value.length) {
      return
    }
    isLoading.value = true

    const { data } = await getAgentGameTypeList(cmsForm.value.setting.product_integration_id)
    isLoading.value = false
    if (!data || !Object.keys(data).length) {
      return
    }
    productGameTypeList.value = data.map((e) => {
      const label = t(GAME_TYPE.I18nKeys[e.game_type as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
      const value = e.game_type
      return {
        label,
        value
      }
    })
  }
  async function handleProductList() {
    isLoading.value = true
    productGameList.value.length = 0
    productData.value.length = 0
    const { data } = await getProductList(
      cmsForm.value.setting.product_integration_id,
      cmsForm.value.setting.product_type,
      cmsForm.value.setting.product_entrance_type
    )
    isLoading.value = false
    if (!data || !Object.keys(data).length) {
      return
    }
    productData.value = data
    productGameList.value = data.map((e) => {
      const label = e.product_name
      const value = e.product_code
      return {
        label,
        value
      }
    })
  }
  async function handleEntranceType(item: Request.CmsEntranceItem) {
    switch (item.type) {
      case CMS_ENTRANCE_TYPE.Enums.GAME_LINK:
        /*舊版
        await queryStore.getGameTypeList()
        item.payload = {
          game_type: queryStore.gameTypeList.length ? (queryStore.gameTypeList[0].value as number) : 0,
          product_code: 0,
          game_code: ""
        }*/
        //await handleEntranceTypeList()
        await handleIntegrationList()
        //await handleAgentGameTypeList()
        item.payload = {
          product_integration_id: productIntegrationList.value.length
            ? (productIntegrationList.value[0].value as number)
            : "",
          game_type: 0,
          product_code: 0,
          game_code: ""
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY:
        /*if (isOld.includes(agent_code)) {
          //舊版
          await queryStore.getGameTypeList()
          item.payload = {
            game_type: queryStore.gameTypeList.length ? (queryStore.gameTypeList[0].value as number) : 0,
            cms_product_category_id: 0
          }
        } else {
          await queryStore.getCmsCategory(siteStore.boDefaultLang)
          item.payload = {
            game_type: 0,
            cms_product_category_id: queryStore.cmsCategoryList.length
              ? (queryStore.cmsCategoryList[0].value as number)
              : 0
          }
        }*/
        await queryStore.getGameTypeList()
        item.payload = {
          game_type: queryStore.gameTypeList.length ? (queryStore.gameTypeList[0].value as number) : 0,
          cms_product_category_id: 0
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK:
        item.payload = {
          link: "",
          opening_method: 0
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.HOMEPAGE_SECTION:
        await queryStore.getCmsHomeList()
        item.payload = {
          link_id: queryStore.cmsHomeList.length ? (queryStore.cmsHomeList[0].value as number) : 0,
          did: queryStore.cmsHomeList.length ? queryStore.cmsHomeList[0].label : ""
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE:
        await queryStore.getCmsInternaslList()
        item.payload = {
          link_id: queryStore.cmsInternalList.length ? (queryStore.cmsInternalList[0].value as number) : 0,
          did: queryStore.cmsInternalList.length ? queryStore.cmsInternalList[0].label : ""
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOMER_SERVICE_LINK:
        await queryStore.getCustomerServiceLinkList()
        item.payload = {
          link_id: queryStore.customerServiceLinkList.length
            ? (queryStore.customerServiceLinkList[0].value as number)
            : 0,
          did: queryStore.customerServiceLinkList.length ? queryStore.customerServiceLinkList[0].label : ""
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_PAGE:
        await queryStore.getCmsCustomPageList()
        item.payload = {
          link_id: queryStore.cmsCustomPageList.length ? (queryStore.cmsCustomPageList[0].value as number) : 0,
          did: queryStore.cmsCustomPageList.length ? queryStore.cmsCustomPageList[0].label : ""
        }
        break

      default:
        break
    }
  }

  return {
    /** call api 中 */
    isLoading,
    /** sort input option */
    optionsSort,

    /** 排列方式 */
    arrangementList,

    /** 入口排列 */
    entranceSortList,

    /** 入口連結 */
    entranceTypeList,

    /** 登入前後 */
    displayLoginList,

    /** 顯示裝置 */
    displayDeviceList,

    /** 呈現方式 */
    gameTypeEntranceTypeList,

    /** 顯示View all */
    viewAllList,

    /** 開啟連結方式 */
    openingMethodList,

    /** 遊戲類別 */
    gameTypeList,

    /** NavigationBar, Menu, H5置底選單共用表格欄位*/
    tableColumn,

    /** 語系title object */
    titleLangObj,

    /** 空白cms entrance */
    emptyCmsEntrance,

    /** cms 列表 */
    cmsList,

    /** cms 表單 */
    cmsForm,

    /** 初始化cme detail */
    initCmsForm,

    /** 初始化entrance */
    initEntrance,

    /** 新增自訂入口 */
    addCmsFormEntrance,

    /** 取得cms列表 */
    handleGetCmsList,

    /** 取得cms內容 */
    handleGetCmsDetail,

    /** 調整cms排序 */
    handleCmsItemSort,

    /** 解析page 格式 */
    parsePage,

    /** 調整cms啟停用 */
    handleCmsItemStatus,

    /** 調整cms彈窗 */
    handleUpdateCmsItemPopup,

    /** 新增cms */
    handleAddCmsItem,

    /** 修改 */
    handleEditCmsItem,

    /** 自訂入口類型 */
    handleEntranceType,

    /** 轉換img base64, url */
    formatImg,

    /** 刪除CMS */
    handleDelCmsList,

    /** 入口設定 */
    handleEntranceTypeList,

    handleIntegrationList,

    handleAgentGameTypeList,

    handleProductList,

    productEntranceTypeList,

    productIntegrationList,

    productGameTypeList,

    productGameList,

    cateGoryList,
    pageLangObj,
    setFile,
    getFile,
    removeFile,
    clearFiles,
    parseEntranceList
  }
}
