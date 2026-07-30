import { ref, reactive, computed, onMounted, watch } from "vue"
import { useApi } from "../hooks/useApi"
import { useUserInfo } from "./useUserInfo"
import { useLanguage } from "./useLanguage"
import { useGame } from "./useGame"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import * as Request from "../../api/request.type"
import * as Response from "../../api/response.type"
import { getFreeSpinList } from "../../api/free_spin"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"

/////////////////////////////////////////////////////////////////////
// 是否使用測試假資料
const USE_MOCK_DATA = false

// 測試用假資料
const MOCK_FREE_SPIN_DATA: Response.FreeSpinList[] = [
  {
    integration_id: 1,
    currency_code: "PHP",
    game_code: "vs20olympgate",
    game_name: "Gates of Olympus",
    game_type: "Slots",
    game_type_id: 1,
    product_code: 101,
    product_name: "PG Soft",
    rounds: 50,
    wallet_type: WALLET_TYPE.Enums.Reward,
  },
  {
    integration_id: 2,
    currency_code: "PHP",
    game_code: "vs10fruity2",
    game_name: "Sweet Bonanza",
    game_type: "Slots",
    game_type_id: 1,
    product_code: 102,
    product_name: "Pragmatic Play",
    rounds: 30,
    wallet_type: WALLET_TYPE.Enums.Reward,
  },
  {
    integration_id: 3,
    currency_code: "PHP",
    game_code: "fortune_gems",
    game_name: "Fortune Gems",
    game_type: "Slots",
    game_type_id: 1,
    product_code: 103,
    product_name: "JILI",
    rounds: 20,
    wallet_type: WALLET_TYPE.Enums.Reward,
  },
  {
    integration_id: 4,
    currency_code: "PHP",
    game_code: "mahjong_ways",
    game_name: "Mahjong Ways",
    game_type: "Slots",
    game_type_id: 1,
    product_code: 101,
    product_name: "PG Soft",
    rounds: 40,
    wallet_type: WALLET_TYPE.Enums.Reward,
  },
  {
    integration_id: 5,
    currency_code: "PHP",
    game_code: "sugar_rush",
    game_name: "Sugar Rush",
    game_type: "Slots",
    game_type_id: 1,
    product_code: 102,
    product_name: "Pragmatic Play",
    rounds: 25,
    wallet_type: WALLET_TYPE.Enums.Reward,
  },
]
/////////////////////////////////////////////////////////////////////

export function useFreeSpin() {
  const router = useRouter()
  const route = useRoute()
  const { activeWalletCurrencyId, activeWalletCurrencyCode } = useUserInfo()
  const { nowLang } = useLanguage()
  const { t } = useI18n()
  const { openGame } = useGame()
  const { setGameTypeUsing } = useGameTypeStore()

  const isLoading = ref(false)
  const freeSpinList = reactive<Response.GetFreeSpinList>({
    list: [],
  })

  const freeSpinTableColumns = computed(() => {
    return [
      { name: "ProductName", label: t("ai.product"), field: "product_name", align: "center" as const },
      { name: "GameName", label: t("home.game"), field: "game_name", align: "center" as const },
      { name: "Rounds", label: t("member.free_spin_rounds"), field: "rounds", align: "center" as const },
    ]
  })

  async function fetchFreeSpinList() {
    try {
      isLoading.value = true

      /////////////////////////////////////////////////////////////////////
      // 如果使用測試假資料
      if (USE_MOCK_DATA) {
        // 模擬 API 延遲
        await new Promise((resolve) => setTimeout(resolve, 500))

        freeSpinList.list.length = 0
        const list = MOCK_FREE_SPIN_DATA.map((e) => {
          return {
            id: e.integration_id,
            integration_id: e.integration_id,
            game_name: e.game_name,
            product_name: e.product_name,
            game_type: e.game_type,
            currency_code: e.currency_code,
            rounds: e.rounds,
            game_code: e.game_code,
            game_type_id: e.game_type_id,
            product_code: e.product_code,
            wallet_type: e.wallet_type,
          }
        })
        Object.assign(freeSpinList.list, list)
        console.log("使用測試假資料:", freeSpinList.list)
        isLoading.value = false
        return
      }
      /////////////////////////////////////////////////////////////////////

      // 真實 API 調用
      const payload: Request.GetFreeSpinList = {
        currency_id: activeWalletCurrencyId.value || 1,
      }

      const { status, data } = await useApi(getFreeSpinList, payload)
      console.log("data", data)
      isLoading.value = false

      if (status && data) {
        freeSpinList.list.length = 0

        const list = data.list.map((e) => {
          return {
            id: e.integration_id,
            integration_id: e.integration_id,
            game_name: e.game_name,
            product_name: e.product_name,
            game_type: e.game_type,
            currency_code: e.currency_code,
            rounds: e.rounds,
            game_code: e.game_code,
            game_type_id: e.game_type_id,
            product_code: e.product_code,
            wallet_type: e.wallet_type,
          }
        })

        Object.assign(freeSpinList.list, list)
      }
    } catch (error) {
      isLoading.value = false
      console.error("Error fetching free spin list:", error)
    }
  }

  const handleFreeSpinLaunchClick = (row: Response.FreeSpinList) => {
    // 處理免費旋轉啟動邏輯
    console.log("Launch free spin for row:", row)

    // openGame 內部組 payload 時是讀全域 gameTypeState.using（預設 SLOT），
    // 而非傳入的 game_type_id 參數。故先用該筆紀錄的 game_type_id 設定全域狀態，
    // 確保啟動的是正確的遊戲類型（與 set_amuse / useCms 既有慣例一致）。
    setGameTypeUsing(row.game_type_id)

    // 調用 openGame 打開遊戲
    openGame(
      row.integration_id,
      row.product_code, // product_code
      row.game_code, // game_code
      row.game_type_id, // game_type_id
      false, // pup
      row.currency_code || activeWalletCurrencyCode.value, // currency
      undefined,
      false,
      row.wallet_type
    )
  }

  // 監聽幣別變化，重新獲取列表
  watch(activeWalletCurrencyId, async (newCurrencyId) => {
    if (newCurrencyId) {
      await fetchFreeSpinList()
    }
  })

  // 初始化
  onMounted(async () => {
    await fetchFreeSpinList()
  })

  return {
    /** 查詢中 */
    isLoading,

    /** 免費旋轉列表 */
    freeSpinList,

    /** 免費旋轉表格欄位 */
    freeSpinTableColumns,

    /** 免費旋轉啟動點擊處理 */
    handleFreeSpinLaunchClick,
  }
}
