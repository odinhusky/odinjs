<template>
  <div
    v-if="
      CMS_PAGE_COMPONENT_TYPE.OpeningMethod[mainEntranceType as CMS_PAGE_COMPONENT_TYPE.Enums] &&
      entrance.type !== CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK
    "
    class="entrance-link mb-2"
  >
    <div class="text-lg">{{ $t("cms.link_opening_method") }}</div>
    <q-select
      v-model="entrance.payload.opening_method"
      :options="openingMethodList"
      dense
      options-dense
      outlined
      map-options
      emit-value
      class="cms-form-input"
      :disable="props.cardDisabled"
    >
    </q-select>
  </div>
  <div
    v-if="CMS_PAGE_COMPONENT_TYPE.AltTag[mainEntranceType as CMS_PAGE_COMPONENT_TYPE.Enums]"
    class="entrance-link mb-2"
  >
    <div class="text-lg">{{ $t("common.link") }}</div>
    <q-input v-model="entrance.payload.alt_tag" dense outlined class="cms-form-input" placeholder="ALT TAG"> </q-input>
  </div>
  <div class="entrance-link mb-2">
    <q-select
      v-model="modelValue"
      :options="entranceTypeList"
      dense
      options-dense
      outlined
      map-options
      emit-value
      class="cms-form-input"
      @update:modelValue="updateEntranceType(props.entrance)"
      :disable="props.cardDisabled"
    >
    </q-select>
  </div>
  <!-- 遊戲連結 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK">
    <!--集成-->
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.product_integration_id"
        :options="productIntegrationList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        @update:model-value="handleIntegrationType"
        class="cms-form-input"
      >
      </q-select>
    </div>
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.game_type"
        :options="productGameTypeList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="handleGameTypeV2"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.product_code"
        :options="filterProductList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="handleProductCodeV2(true)"
        :disable="props.cardDisabled"
      >
        <template #before-options>
          <q-input
            v-model="productKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
        </template>
        <template v-slot:no-option>
          <q-input
            v-model="productKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
            :disable="props.cardDisabled"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
          <q-item>
            <q-item-section class="text-grey"> {{ $t("common.no_result") }} </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.game_code"
        :options="filterGameList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        :disable="props.cardDisabled"
        @update:model-value="handleGameCodeV2"
      >
        <template #before-options>
          <q-input
            v-model="gameKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
        </template>
        <template v-slot:no-option>
          <q-input
            v-model="gameKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
          <q-item>
            <q-item-section class="text-grey"> {{ $t("common.no_result") }} </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </template>

  <!-- 分類大廳 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.game_type"
        :options="productGameTypeList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
  </template>
  <!-- 自訂連結 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.opening_method"
        :options="openingMethodList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
    <div class="entrance-link mb-2">
      <q-input v-model="entrance.payload.link" dense outlined class="cms-form-input"> </q-input>
    </div>
  </template>
  <!-- 首頁區塊 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.HOMEPAGE_SECTION">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.link_id"
        :options="queryStore.cmsHomeList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="changeHomeList()"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
  </template>
  <!-- 內部頁面 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.link_id"
        :options="internalList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="changeInternalList()"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
  </template>
  <!-- 客服連結 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.CUSTOMER_SERVICE_LINK">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.link_id"
        :options="queryStore.customerServiceLinkList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="changeCustomerServiceLink"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
  </template>
  <!-- 自訂頁面 -->
  <template v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.CUSTOM_PAGE">
    <div class="entrance-link mb-2">
      <q-select
        v-model="entrance.payload.link_id"
        :options="queryStore.cmsCustomPageList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="changeCustomPageList()"
        :disable="props.cardDisabled"
      >
      </q-select>
    </div>
  </template>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { ref, computed, onMounted, watch } from "vue"
  import { useCms } from "src/composables/useCms"
  import { useI18n } from "vue-i18n"
  import type { DropdownType } from "src/stores/queryStore"
  import { useQueryStore } from "src/stores/queryStore"
  import { CMS_ENTRANCE_TYPE, CMS_INTERNALPAGE, CMS_TYPE, CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import { getProductDropdown } from "src/api/product"
  import { GAME_TYPE } from "@/utils/constants"
  import { useSiteStore } from "src/stores/siteStore"
  import {
    getEntranceTypeList,
    getIntegrationList,
    getAgentGameTypeList,
    getProductV2Dropdown,
    getCmsGameDropdown,
    getCmsGameDetail
  } from "@/api/productV2"
  import { getGameNameDropdown } from "src/api/game"

  import type * as Request from "src/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import { useImage } from "src/hook/useImage"

  const {
    entranceTypeList,
    openingMethodList,
    handleEntranceType,
    gameTypeList,
    cateGoryList,
    productIntegrationList,
    handleEntranceTypeList,
    handleIntegrationList,
    handleAgentGameTypeList,
    productGameTypeList
  } = useCms()
  const queryStore = useQueryStore()
  const modelValue = defineModel<CMS_ENTRANCE_TYPE.Enums | CMS_PAGE_COMPONENT_TYPE.Enums>()
  const siteStore = useSiteStore()

  const isOld = siteStore.product_v2_agent
  const agent_code = siteStore.agent_code.toLocaleLowerCase()
  const { envData } = useEnv()
  //const { VITE_APP_BASE_API } = envData()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { getGamePublicImg, getProductPublicImg } = useImage()
  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: false,
      default: () => {
        return {}
      }
    },
    type: {
      type: [Number],
      required: false,
      default: () => 0
    },
    mainEntranceType: {
      type: Number as PropType<CMS_ENTRANCE_TYPE.Enums | CMS_PAGE_COMPONENT_TYPE.Enums | 0>,
      required: false,
      default: () => 0
    },
    cardDisabled: {
      type: Boolean,
      required: false,
      default: () => false
    }
  })
  const { t } = useI18n()
  const customPageOpenMethod = computed(
    () =>
      CMS_PAGE_COMPONENT_TYPE.OpeningMethod[props.mainEntranceType as CMS_PAGE_COMPONENT_TYPE.Enums] &&
      props.entrance.type !== CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK
  )
  const productKeyword = ref("")
  const productList = ref<DropdownType[]>([])
  const filterProductList = computed(() => {
    if (productKeyword.value) {
      const keyword = productKeyword.value.toLowerCase()
      return productList.value.filter((product) => product.label.toLowerCase().includes(keyword))
    }
    return productList.value
  })
  const gameKeyword = ref("")
  const gameList = ref<DropdownType[]>([])

  const filterGameList = computed(() => {
    if (gameKeyword.value) {
      const keyword = gameKeyword.value.toLowerCase()
      return gameList.value.filter((game) => game.label.toLowerCase().includes(keyword))
    }
    return gameList.value
  })

  const internalList = computed(() => {
    const shouldExcludePop = props.type === CMS_TYPE.Enums.FLOATING_ICON

    return queryStore.cmsInternalList
      .filter((option) => shouldExcludePop || option.value !== CMS_INTERNALPAGE.Enums.INTERNAL_POP)
      .map((option) => ({
        label: t(CMS_INTERNALPAGE.I18nKeys[option.value as CMS_INTERNALPAGE.Enums] || "common.unknow"),
        value: option.value
      }))
  })

  async function handleGameType() {
    props.entrance.payload.product_code = 0
    await getProductList()
    handleProductCode()
  }

  async function getProductList() {
    const game_type = props.entrance.payload.game_type
    const { data } = await getProductDropdown({ game_type, only_actived: false })
    if (!data || !data.length) {
      productList.value.length = 0
      return
    }
    productList.value = data.map((e) => {
      return {
        label: e.product_name,
        value: e.product_code
      }
    })
    if (!props.entrance.payload.product_code) {
      props.entrance.payload.product_code = data[0].product_code
    }
  }

  async function handleProductCode() {
    props.entrance.payload.game_code = ""
    if (props.entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT) {
      await getGameList()
    } else {
      props.entrance.payload.game_code = ""
    }
  }

  async function getGameList() {
    const game_type = props.entrance.payload.game_type
    const product_code = props.entrance.payload.product_code
    const { data } = await getGameNameDropdown({ game_type, product_code })
    if (!data || !data.length) {
      gameList.value.length = 0
      return
    }

    gameList.value = [
      {
        label: t("table_header.please_select"),
        value: ""
      },
      ...data.map((e) => ({
        label: e.game_name,
        value: e.game_code
      }))
    ]
  }

  async function updateEntranceType(item: Request.CmsEntranceItem) {
    // 保留現有的資料，避免被 handleEntranceType 覆蓋
    const preservedData = {
      opening_method: item.payload.opening_method,
      title: item.payload.title,
      lang_titles: item.payload.lang_titles,
      currentLang: item.payload.currentLang,
      icon: item.payload.icon,
      iconFileName: item.payload.iconFileName,
      selected_icon: item.payload.selected_icon,
      selectedIconFileName: item.payload.selectedIconFileName,
      display_login: item.payload.display_login,
      style: item.payload.style,
      nested_entrance: item.payload.nested_entrance,
      details: item.payload.details,
      sort: item.payload.sort,
      alt_tag: item.payload.alt_tag
    }

    await handleEntranceType(item)

    // 恢復保留的資料
    Object.keys(preservedData).forEach((key) => {
      const value = preservedData[key as keyof typeof preservedData]
      if (value !== undefined) {
        ;(item.payload as any)[key] = value
      }
    })

    initGameLinkPayload()

    if (CMS_PAGE_COMPONENT_TYPE.OpeningMethod[props.mainEntranceType as CMS_PAGE_COMPONENT_TYPE.Enums]) {
      props.entrance.payload.opening_method = preservedData.opening_method
    }
  }

  async function initGameLinkPayload() {
    if (
      props.entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK ||
      props.entrance.type === CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY
    ) {
      if (!props.entrance.payload.product_integration_id) {
        //舊資料沒有product_integration_id 預設給1
        props.entrance.payload.product_integration_id = 1
      }
      await handleIntegrationList()
      await handleAgentGameTypeList()
      if (!props.entrance.payload.game_type) {
        props.entrance.payload.game_type = productGameTypeList.value[0].value as number
      }
      if (props.entrance.payload.product_code) {
        await getProductListV2()
        if (props.entrance.payload.game_code) {
          await getGameListV2()
        } else {
          handleProductCodeV2()
        }
      } else {
        handleGameTypeV2()
      }
    }
    if (props.entrance.type === CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY) {
      await handleAgentGameTypeList()
    }
    /*else if (
      props.entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK &&
      !props.entrance.payload.product_integration_id
    ) {
      if (props.entrance.payload.product_code) {
        await getProductList()
        if (props.entrance.payload.game_code) {
          await getGameList()
        } else {
          handleProductCode()
        }
      } else {
        handleGameType()
      }
    }*/
  }
  async function changeHomeList() {
    const foundItem = queryStore.cmsHomeList.find((item) => item.value === props.entrance.payload.link_id)
    if (foundItem) {
      props.entrance.payload.did = foundItem.label
    }
  }
  async function changeCustomPageList() {
    const foundItem = queryStore.cmsCustomPageList.find((item) => item.value === props.entrance.payload.link_id)
    if (foundItem) {
      props.entrance.payload.did = foundItem.label
    }
  }
  async function changeInternalList() {
    const foundItem = queryStore.cmsInternalList.find((item) => item.value === props.entrance.payload.link_id)
    if (foundItem) {
      props.entrance.payload.did = foundItem.label
    }
  }
  async function changeCustomerServiceLink() {
    const foundItem = queryStore.customerServiceLinkList.find((item) => item.value === props.entrance.payload.link_id)
    if (foundItem) {
      props.entrance.payload.did = foundItem.label
    }
  }

  onMounted(async () => {
    initGameLinkPayload()
  })
  async function handleGameTypeV2() {
    props.entrance.payload.product_code = ""
    await getProductListV2()
    handleProductCodeV2()
  }
  const cloneProductDropdown = ref<any>([])
  async function getProductListV2() {
    const game_type = props.entrance.payload.game_type
    const integration_id = props.entrance.payload.product_integration_id

    if (cloneProductDropdown.value.length <= 0) {
      const { data } = await getProductV2Dropdown()
      if (!data || !data.length) {
        productList.value.length = 0
        return
      }
      cloneProductDropdown.value = data
    }

    const fliterDate = cloneProductDropdown.value.filter(
      (item: { game_type_id: number; integration_id: number }) =>
        item.game_type_id === game_type && item.integration_id === integration_id
    )

    productList.value = fliterDate.map((e: { product_name: string; product_code: string }) => {
      return {
        label: e.product_name,
        value: e.product_code
      }
    })

    if (!props.entrance.payload.product_code) {
      props.entrance.payload.product_code = fliterDate[0].product_code
    }
  }

  async function handleProductCodeV2(isProductChange = false) {
    if (isProductChange) {
      const gameTypeString = queryStore.gameTypeIdMap[props.entrance.payload.game_type || 1]
      const img = getProductPublicImg({
        gameType: gameTypeString,
        productCode: props.entrance.payload.product_code || 0,
        siteKey: "okbet"
      })
      props.entrance.img = img
    }

    props.entrance.payload.game_code = ""
    if (props.entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT) {
      await getGameListV2()
    } else {
      props.entrance.payload.game_code = ""
    }
  }
  const cloneGameList = ref<any>([])
  async function getGameListV2() {
    const game_type = props.entrance.payload.game_type
    const product_code = props.entrance.payload.product_code
    const integration_id = props.entrance.payload.product_integration_id
    const { data } = await getCmsGameDropdown({ game_type, product_code, integration_id })
    if (!data || !data.length) {
      gameList.value.length = 0
      return
    }

    cloneGameList.value = data
    gameList.value = [
      {
        label: t("table_header.please_select"),
        value: ""
      },
      ...data.map((e) => ({
        label: e.game_name,
        value: e.game_code
      }))
    ]
  }
  async function handleGameCodeV2() {
    const game_type = props.entrance.payload.game_type
    const gameTypeString = queryStore.gameTypeIdMap[game_type || 1]
    const product_code = props.entrance.payload.product_code
    const integration_id = props.entrance.payload.product_integration_id
    const game_code = props.entrance.payload.game_code
    const { data } = await getCmsGameDetail({ game_type, product_code, integration_id, game_code })
    if (!data) {
      return
    }

    const langMap = props.entrance.lang
    const customizeList = data.customize

    const customizeMap = Object.fromEntries(
      customizeList.map((item: { language_code: string; game_name: string }) => [item.language_code, item.game_name])
    )

    for (const lang in langMap) {
      const gameName = customizeMap[lang]
      langMap[lang] = gameName && gameName.trim() !== "" ? gameName : data.name
    }
    //抓圖片
    const langKey = Object.keys(props.entrance.lang)[0] //抓第一個語系
    const targetCustomize = data.customize.find(
      (item: { language_code: string; game_name: string }) => item.language_code === langKey
    )
    if (targetCustomize && targetCustomize.is_custom_image) {
      if (targetCustomize.custom_image) {
        props.entrance.img = getImageFullPath(targetCustomize.custom_image)
      } else {
        props.entrance.img = getGamePublicImg(integration_id, gameTypeString, product_code, game_code)
      }
      props.entrance.imgFileName = ""
    } else {
      props.entrance.img = getGamePublicImg(integration_id, gameTypeString, product_code, game_code)
      props.entrance.imgFileName = ""
    }
  }

  const getImageFullPath = (img?: string) => {
    if (!img) return ""
    const isFullUrl = img.startsWith("http")
    const isBase64 = img.startsWith("data:image/")
    if (isFullUrl || isBase64) return img

    let path = img
    if (path.startsWith("/")) {
      path = path.slice(1)
    }

    try {
      const baseUrl = new URL(VITE_APP_DYNAMIC_RESOURCE_URL)
      const baseRoot = baseUrl.origin
      const basePrefix = baseUrl.pathname.replace(/^\/|\/$/g, "")

      if (basePrefix && path.startsWith(basePrefix)) {
        return `${baseRoot}/${path}`
      }
    } catch (error) {
      // 解析失敗則回退
    }

    return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${path}`
    //return isFullUrl || isBase64 ? img : `https://wowdata.gpsriowdl.com/gsi/dev/devm/${img}`
  }

  async function handleIntegrationType() {
    await handleAgentGameTypeList()
    props.entrance.payload.product_code = ""
    props.entrance.payload.game_code = ""
    await getProductListV2()
    await getGameListV2()
  }
</script>
<style scoped lang="scss">
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";
</style>
