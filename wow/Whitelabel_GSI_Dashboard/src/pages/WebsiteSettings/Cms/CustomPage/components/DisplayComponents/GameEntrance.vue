<template>
  <div
    class="custom-game-entrance px-2"
    :style="{
      backgroundColor: settingStyle?.backgroundColor,
      padding: settingStyle?.padding ? `${settingStyle.padding}px` : undefined
    }"
  >
    <!-- 產品列表 (SINGLE_ENTRY - 供應商入口) -->
    <div
      v-if="payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY && displayProductList.length > 0"
      class="entrance-content"
    >
      <!-- 產品列表 (SINGLE_ENTRY - 供應商入口) -->
      <div class="product-grid" :style="{ 'grid-template-columns': `repeat(${payload.row_show ?? 2}, 1fr)` }">
        <div v-for="product in displayProductList" :key="product.product_code" class="product-item">
          <div class="img-container">
            <img :src="product.img" :alt="product.product_name" class="product-img" @error="setDefaultProductImg" />
          </div>
          <!-- <div class="product-name">{{ product.product_name }}</div> -->
        </div>
      </div>
    </div>
    <!-- 遊戲列表 (GAME_LIST - 遊戲入口) -->
    <div
      v-else-if="payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST && displayGamesList.length > 0"
      class="entrance-content"
    >
      <div class="game-grid" :style="{ 'grid-template-columns': `repeat(${payload.row_show ?? 2}, 1fr)` }">
        <div v-for="game in displayGamesList" :key="game.game_id" class="game-item">
          <div class="img-container">
            <img :src="game.img" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
          </div>
          <!-- <div class="game-name">{{ game.game_name }}</div> -->
        </div>
      </div>
    </div>
    <div v-else class="page-component-item-game-entrance">
      <q-img
        :src="cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE])"
        class="page-component-item-game-entrance-img"
      ></q-img>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType, computed, ref, watch, onMounted } from "vue"
  import { useImage } from "src/hook/useImage"
  import { useLanguage } from "src/composables/useLanguage"
  import { useEnv } from "src/hook/useEnv"
  import { useQueryStore } from "src/stores/queryStore"
  import { CMS_PAGE_COMPONENT_TYPE, GAME_TYPE } from "src/utils/constants"
  import { useSearch } from "@/hook/useSearch"
  import { getProductGameList, getEntranceMapList, getProductV2Dropdown } from "src/api/productV2"
  import type * as Request from "src/api/request.type"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const { getLanguage } = useLanguage()
  const { cmsCustomPage, getGamePublicImg, setDefaultGameImg, getProductImg, setDefaultProductImg } = useImage()
  const queryStore = useQueryStore()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  // 從 entrance.payload.style 讀取樣式
  const settingStyle = computed(() => props.entrance?.payload?.style)
  const payload = computed(() => props.entrance.payload)

  // 計算要顯示的最大數量 (row_show * row_num)
  const maxDisplayCount = computed(() => {
    return (payload.value.row_show ?? 2) * (payload.value.row_num ?? 3)
  })

  //#region 遊戲清單
  const gamesList = ref<any[]>([])
  const displayGamesList = computed(() => {
    const nowLang = getLanguage()
    const gameTypeString = queryStore.gameTypeIdMap[payload.value.game_type_id || 1]
    const games = gamesList.value.slice(0, maxDisplayCount.value)

    games.forEach((game) => {
      const firstLangKey = game.customize[0].language_code
      const customizeList = game.customize
      const customizeMap = Object.fromEntries(
        customizeList.map((item: { language_code: string; item: any }) => [item.language_code, item])
      )
      const targetCustomize = customizeMap[nowLang] ? customizeMap[nowLang] : customizeMap[firstLangKey]

      const langGameName = targetCustomize.game_name
      game.game_name = langGameName && langGameName.trim() !== "" ? langGameName : game.name

      if (targetCustomize) {
        if (targetCustomize.custom_image && targetCustomize.is_custom_image) {
          game.img = getImageFullPath(targetCustomize.custom_image)
        } else {
          game.img = getGamePublicImg(game.integration_id, gameTypeString, game.product_code, game.code)
        }
      } else {
        game.img = getGamePublicImg(game.integration_id, gameTypeString, game.product_code, game.code)
      }
    })

    return games
  })

  const getImageFullPath = (img?: string) => {
    if (!img) return ""
    const isFullUrl = img.startsWith("http")
    const isBase64 = img.startsWith("data:image/")
    return isFullUrl || isBase64 ? img : `${VITE_APP_DYNAMIC_RESOURCE_URL}/${img}`
    //return isFullUrl || isBase64 ? img : `https://wowdata.gpsriowdl.com/gsi/dev/devm/${img}`
  }
  //#endregion

  //#region 產品列表
  const productList = ref<any[]>([])

  const displayProductList = computed(() => {
    const nowLang = getLanguage()
    const gameTypeString = queryStore.gameTypeIdMap[payload.value.game_type_id || 1]
    const products = productList.value.slice(0, maxDisplayCount.value)

    products.forEach((product) => {
      const firstLangKey = product.customize[0].language_code
      const customizeList = product.customize
      const customizeMap = Object.fromEntries(
        customizeList.map((item: { language_code: string; item: any }) => [item.language_code, item])
      )
      const targetCustomize = customizeMap[nowLang] ? customizeMap[nowLang] : customizeMap[firstLangKey]

      const langProductName = targetCustomize.product_name
      product.name = langProductName && langProductName.trim() !== "" ? langProductName : product.product_name

      product.img = ""
      product.imgFileName = ""

      if (targetCustomize) {
        if (targetCustomize.use_square_image && targetCustomize.square_image) {
          product.img = getImageFullPath(targetCustomize.square_image)
        } else {
          product.img = getProductImg(gameTypeString, product.product_code)
        }
      } else {
        product.img = getProductImg(gameTypeString, product.product_code)
      }
    })
    return products
  })

  //#endregion

  const fetchData = async () => {
    const gameTypeId = payload.value.game_type_id
    const entranceType = payload.value.game_type_entrance_type
    const offset = 0
    let size = 0
    if (payload.value.row_num && payload.value.row_show) {
      size = payload.value.row_num * payload.value.row_show
    }

    if (entranceType === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY) {
      const params: Request.GetEntranceMapList = {
        game_type: gameTypeId,
        offset,
        size
      }

      const { status, search, tableData } = useSearch(getEntranceMapList)
      await search(params)

      if (status.value) {
        productList.value = [...tableData.value]
      }
    } else if (entranceType === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST) {
      const productCode = payload.value.product_code
      const integrationId = payload.value.product_integration_id

      const params: Request.GetProductListV2 = {
        game_type: gameTypeId,
        integration_id: integrationId as number,
        product_code: productCode as number,
        offset,
        size
      }

      const { status, search, tableData } = useSearch(getProductGameList)
      await search(params)

      if (status.value) {
        gamesList.value = [...tableData.value]
      }
    }
  }

  watch(
    () => props.entrance.payload,
    (newVal) => {
      fetchData()
    },
    { immediate: true }
  )

  onMounted(() => {
    queryStore.getGameTypeList()
  })
</script>

<style scoped lang="scss">
  .custom-game-entrance {
    .entrance-title {
      font-family: OpenSans;
      font-weight: 700;
      font-size: 1.25rem;
      color: #2a354b;
      margin-bottom: 0.375rem;
    }

    .entrance-content {
      @apply w-full;
    }

    .game-grid,
    .product-grid {
      @apply grid gap-1.5;

      .game-item,
      .product-item {
        @apply cursor-pointer rounded-lg overflow-hidden transition-all duration-300;
        border-radius: 0.625rem;
        box-shadow: 0px 0px 16px 0px #0000001a;

        // &:hover {
        //   transform: translateY(-2px);
        //   box-shadow: 0 0.5rem 1.5625rem rgba(0, 0, 0, 0.15);
        // }

        .img-container {
          @apply w-full h-auto rounded-lg overflow-hidden;

          .game-img,
          .product-img {
            @apply w-full h-auto object-cover;
          }
        }

        .game-name,
        .product-name {
          @apply text-sm font-medium text-center mb-2;
          color: var(--text-content, #2a354b);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
  .page-component-item-game-entrance {
    // @apply grid grid-cols-3 gap-1.5;

    // .page-component-item-game-entrance-img {
    //   box-shadow: 0px 0px 16px 0px #0000001a;
    // }
  }
</style>
