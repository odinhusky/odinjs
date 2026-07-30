import type { GameItem } from "@shared-lib/api/commonTypes/gameTypes"
import { useGetFavoriteGameList } from "@shared-lib/api/hooks/useGetFavoriteGameList"
import { useFavoriteGame } from "@shared-lib/api/hooks/useFavoriteGame"
import { useDeleteFavoriteGame } from "@shared-lib/api/hooks/useDeleteFavoriteGame"

/** 樂觀更新後，延遲多少毫秒才將本地變更批次同步到後端 */
const FAVORITE_SYNC_DEBOUNCE_MS = 1000

/**
 * useFavorite
 *
 * 遊戲收藏的狀態管理 composable。
 *
 * ## 設計概念：樂觀更新 + 批次同步
 *
 * 使用者點擊收藏時，UI 會立即反映（樂觀更新），同時將變更放入
 * `pendingFavoriteStateMap`。經過 debounce 後，`flushFavoriteChanges`
 * 才會將所有 pending 變更依序送到後端。
 *
 * 在同步期間，若伺服器回傳的 ID 清單與本地預期不符，會顯示 toast 提示
 * 並以伺服器資料為準（`applyServerFavoriteIds`）。
 *
 * ## 典型使用方式
 * ```ts
 * const { syncFavoriteFlag, handleToggleFavorite, isFavoriteMutating } = useFavorite()
 *
 * // 在顯示清單前，把收藏狀態同步進每個 GameItem
 * const displayGames = computed(() => syncFavoriteFlag(rawGames.value))
 *
 * // 點擊收藏按鈕（含登入守衛）
 * const onToggle = (game: GameItem) => handleToggleFavorite(game)
 * ```
 *
 * `handleToggleFavorite` 已整合登入守衛：未登入時自動彈出提示並跳轉登入頁。
 * 若需要不含守衛的原始切換，可直接使用 `toggleFavorite`。
 */
export const useFavorite = () => {
  // ── 伺服器端資料查詢 ─────────────────────────────────────────────────────────
  // 僅在已登入時啟用查詢，避免送出未授權的 API 請求
  const authStore = useAuthStore()
  const { pushToast } = useToastQueue()
  const { ensureLoggedIn } = useRequireLogin()
  const route = useRoute()
  const {
    favoriteGameList,
    refetch: refetchFavoriteGameList,
    isFetching: isFavoriteGameListFetching
  } = useGetFavoriteGameList({
    options: {
      enabled: computed(() => authStore.isLoggedIn)
    }
  })
  const { favoriteGame: addFavoriteGame, isPending: isFavoritePending } = useFavoriteGame()
  const { deleteFavoriteGame, isPending: isDeleteFavoritePending } = useDeleteFavoriteGame()

  // ── 本地狀態 ─────────────────────────────────────────────────────────────────

  /** 目前已收藏的 game_id 清單（以本地樂觀狀態為準） */
  const favoriteGameIds = ref<number[]>([])

  /**
   * 待同步的收藏變更：key = game_id，value = 同步完成後應有的狀態
   * - `true`  → 應加入收藏
   * - `false` → 應移除收藏
   *
   * 連續點擊同一遊戲時，後來的操作會覆蓋前一筆，確保只送出最終狀態。
   */
  const pendingFavoriteStateMap = ref<Record<number, boolean>>({})

  /** debounce 計時器 handle */
  const syncTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  /** 正在執行批次後端同步（`flushFavoriteChanges`）期間為 true */
  const isSyncingFavorite = ref(false)

  /**
   * 本地樂觀更新後，預期伺服器最終應有的 ID 清單簽名。
   * 用來在下次收到伺服器資料時驗證一致性。
   */
  const expectedFavoriteSyncSignature = ref<string | null>(null)

  /**
   * 目前正在處理中（pending 佇列或同步中）的 game_id 集合。
   * 用於連結單一項目的 `isFavoriteMutating` prop，只有被點擊的那顆按鈕會被 disabled。
   */
  const mutatingGameIds = ref(new Set<number>())

  /**
   * 綜合性「操作中」旗標。
   * 適用於頁面層級的整體狀態展示（不建議直接用於每項遷戲的按鈕 disabled，
   * 那請用 `mutatingGameIds.has(game_id)` 雷避全頁閃爍）。
   */
  const isFavoriteMutating = computed(() => {
    return (
      isFavoritePending.value ||
      isDeleteFavoritePending.value ||
      isSyncingFavorite.value ||
      isFavoriteGameListFetching.value
    )
  })

  // ── 內部工具函式 ─────────────────────────────────────────────────────────────

  const clearSyncTimer = () => {
    if (!syncTimer.value) return
    clearTimeout(syncTimer.value)
    syncTimer.value = null
  }

  /** 清除所有 pending 同步狀態（例如使用者登出時） */
  const clearFavoriteSyncState = () => {
    pendingFavoriteStateMap.value = {}
    expectedFavoriteSyncSignature.value = null
    clearSyncTimer()
  }

  /** 去重、排序，確保 ID 清單具有穩定的比較基準 */
  const normalizeFavoriteIds = (ids: number[]) => {
    return Array.from(new Set(ids.filter((id) => Number.isFinite(id)).map((id) => Number(id)))).sort((a, b) => a - b)
  }

  /** 將 ID 清單轉為逗號分隔字串，用於快速比對本地預期與伺服器結果 */
  const buildFavoriteSignature = (ids: number[]) => {
    return normalizeFavoriteIds(ids).join(",")
  }

  /** 判斷是否仍有尚未同步至後端的本地變更 */
  const hasPendingFavoriteSync = () => {
    return Object.keys(pendingFavoriteStateMap.value).length > 0 || isSyncingFavorite.value
  }

  // ── 伺服器狀態套用 ───────────────────────────────────────────────────────────

  /**
   * 將伺服器回傳的 ID 清單寫入本地。
   *
   * 若目前沒有 pending 變更，且本地曾有預期簽名，
   * 會與伺服器結果比對：不符時顯示 toast 提示開發者或使用者。
   */
  const applyServerFavoriteIds = (serverIds: unknown) => {
    if (!authStore.isLoggedIn) {
      favoriteGameIds.value = []
      return
    }

    const normalizedServerIds = normalizeFavoriteIds(Array.isArray(serverIds) ? serverIds : [])
    const expected = expectedFavoriteSyncSignature.value

    favoriteGameIds.value = normalizedServerIds

    // 僅在所有 pending 變更都已清空後才進行簽名比對，避免誤報
    if (!hasPendingFavoriteSync() && expected) {
      if (buildFavoriteSignature(normalizedServerIds) !== expected) {
        pushToast({
          severity: TOAST_SEVERITY_ENUMS.ERROR,
          summary: "Favorite Sync Notice",
          detail: "本地收藏狀態與伺服器不一致，已自動校正",
          life: 2800
        })
      }
      expectedFavoriteSyncSignature.value = null
    }
  }

  // 每當伺服器收藏清單更新時，自動套用至本地（包含初始載入）
  watch(
    () => favoriteGameList.value,
    (serverIds) => {
      applyServerFavoriteIds(serverIds)
    },
    { immediate: true, deep: true }
  )

  // ── 批次後端同步 ─────────────────────────────────────────────────────────────

  /**
   * 重新設定 debounce 計時器。
   * 每次樂觀更新後呼叫，確保使用者停止操作後才批次送出。
   */
  const scheduleFavoriteSync = () => {
    clearSyncTimer()
    syncTimer.value = setTimeout(() => {
      void flushFavoriteChanges()
    }, FAVORITE_SYNC_DEBOUNCE_MS)
  }

  /** 對單筆遊戲執行新增或移除收藏的 API 呼叫 */
  const syncSingleFavoriteChange = async (gameId: number, shouldBeFavorite: boolean) => {
    if (shouldBeFavorite) {
      await addFavoriteGame({ game_id: gameId })
      return
    }
    await deleteFavoriteGame({ game_id: gameId })
  }

  /**
   * 將 `pendingFavoriteStateMap` 中所有待同步的變更批次送至後端。
   *
   * - 逐筆呼叫 API；個別失敗不影響其他項目，但會收集後統一顯示 toast
   * - 完成後記錄預期簽名，供下次伺服器資料回來時驗證
   * - 若在同步期間又有新的 pending 變更，完成後會再次排程
   */
  const flushFavoriteChanges = async () => {
    if (!authStore.isLoggedIn || isSyncingFavorite.value) {
      return
    }

    const pendingEntries = Object.entries(pendingFavoriteStateMap.value)
    if (!pendingEntries.length) {
      return
    }

    // 先清空 pending map，讓同步期間新的操作仍可正常入隊
    pendingFavoriteStateMap.value = {}
    isSyncingFavorite.value = true

    const failedGameIds: number[] = []

    try {
      for (const [gameIdText, shouldBeFavorite] of pendingEntries) {
        const gameId = Number(gameIdText)
        if (!gameId) continue

        try {
          await syncSingleFavoriteChange(gameId, shouldBeFavorite)
        } catch {
          failedGameIds.push(gameId)
        } finally {
          // 無論成功或失敗，該項目同步完畢後就從追蹤集合移除
          const next = new Set(mutatingGameIds.value)
          next.delete(gameId)
          mutatingGameIds.value = next
        }
      }

      expectedFavoriteSyncSignature.value = buildFavoriteSignature(favoriteGameIds.value)

      if (failedGameIds.length) {
        pushToast({
          severity: TOAST_SEVERITY_ENUMS.ERROR,
          summary: "Favorite Sync Notice",
          detail: `同步失敗 game_id: ${failedGameIds.join(", ")}`,
          life: 2800
        })
      }

      // 新增 / 刪除 mutation 完成後，TanStack Query 的 invalidateQueries 會自動觸發清單重新拉取
    } finally {
      isSyncingFavorite.value = false

      // 若同步期間有新操作入隊，繼續排程下一輪同步
      if (Object.keys(pendingFavoriteStateMap.value).length) {
        scheduleFavoriteSync()
      }
    }
  }

  // ── 公開 API ─────────────────────────────────────────────────────────────────

  /**
   * 將本地 `favoriteGameIds` 的狀態同步進 `GameItem[]` 的 `is_favorite` 欄位。
   *
   * 用於在渲染清單前確保每個項目顯示正確的收藏圖示，
   * 通常搭配 `computed` 使用：
   * ```ts
   * const displayGames = computed(() => syncFavoriteFlag(rawGames.value))
   * ```
   *
   * - 未登入：全部設為 `false`
   * - 已登入但 `favoriteGameIds` 尚未載入：保留 API 原始欄位值
   * - 已登入且有 `favoriteGameIds`：以本地樂觀狀態為準
   */
  const syncFavoriteFlag = (list: GameItem[]) => {
    if (!authStore.isLoggedIn) {
      return list.map((item) => ({ ...item, is_favorite: false }))
    }

    if (!favoriteGameIds.value.length) {
      return list.map((item) => ({ ...item, is_favorite: Boolean(item.is_favorite || item.is_favorited) }))
    }

    const favoriteSet = new Set(favoriteGameIds.value)
    return list.map((item) => ({
      ...item,
      is_favorite: Boolean(item.is_favorite || item.is_favorited || favoriteSet.has(Number(item.game_id)))
    }))
  }

  /**
   * 判斷單一遊戲是否已被收藏。
   * 同時檢查 API 原始欄位（`is_favorite`、`is_favorited`）與本地 `favoriteGameIds`。
   */
  const isGameFavorited = (game: GameItem) => {
    return Boolean(game.is_favorite || game.is_favorited || favoriteGameIds.value.includes(Number(game.game_id)))
  }

  /** 樂觀地將 gameId 加入本地 `favoriteGameIds`（不重複加入） */
  const addFavoriteIdLocally = (gameId: number) => {
    if (favoriteGameIds.value.includes(gameId)) return
    favoriteGameIds.value = [...favoriteGameIds.value, gameId]
  }

  /** 樂觀地從本地 `favoriteGameIds` 移除 gameId */
  const removeFavoriteIdLocally = (gameId: number) => {
    favoriteGameIds.value = favoriteGameIds.value.filter((id) => id !== gameId)
  }

  /**
   * 將收藏變更加入 pending 佇列並重新排程 debounce 計時器。
   * 若同一個 gameId 連續操作，後者會覆蓋前者（只保留最終狀態）。
   */
  const enqueueFavoriteState = (gameId: number, shouldBeFavorite: boolean) => {
    pendingFavoriteStateMap.value[gameId] = shouldBeFavorite
    // 標記為操作中，直到 flushFavoriteChanges 處理完刪除
    mutatingGameIds.value = new Set([...mutatingGameIds.value, gameId])
    scheduleFavoriteSync()
  }

  /**
   * 強制重新拉取伺服器收藏清單並更新本地狀態。
   * 適用於切換至「我的收藏」分頁等需要確保資料最新的情境。
   *
   * - 未登入時清除所有 pending 狀態並回傳空陣列
   * @returns 最新的 favoriteGameIds
   */
  const getFavoriteGames = async () => {
    if (!authStore.isLoggedIn) {
      clearFavoriteSyncState()
      favoriteGameIds.value = []
      return []
    }

    const response = await refetchFavoriteGameList()
    favoriteGameIds.value = normalizeFavoriteIds(Array.isArray(response.data || []) ? response.data || [] : [])
    return favoriteGameIds.value
  }

  /**
   * 樂觀切換單一遊戲的收藏狀態，並排程後端同步。
   *
   * @returns 操作結果 `{ isFavorited, gameId }`；若 `game_id` 無效則回傳 `null`
   *
   * > 此函式**不含登入守衛**，請在呼叫前確認已登入。
   * > 一般情況下請使用 `handleToggleFavorite`，它已整合登入守衛。
   */
  const toggleFavorite = (game: GameItem) => {
    const gameId = Number(game.game_id)
    if (!gameId) return null

    const shouldRemoveFavorite = isGameFavorited(game)

    // 目前已收藏 → 移除；否則 → 加入
    if (shouldRemoveFavorite) {
      removeFavoriteIdLocally(gameId)
      enqueueFavoriteState(gameId, false)

      return {
        isFavorited: false,
        gameId
      }
    }

    addFavoriteIdLocally(gameId)
    enqueueFavoriteState(gameId, true)

    return {
      isFavorited: true,
      gameId
    }
  }

  /**
   * 帶有登入守衛的收藏切換。
   *
   * - 未登入：自動顯示錯誤 toast + 跳轉登入頁，回傳 `null`
   * - 已登入：執行樂觀更新並排程後端同步，回傳 `{ isFavorited, gameId }`
   *
   * 這是一般情境下應優先使用的收藏切換函式。
   */
  const handleToggleFavorite = async (game: GameItem): Promise<{ isFavorited: boolean; gameId: number } | null> => {
    const isLoggedIn = await ensureLoggedIn({ redirectPath: String(route.fullPath) })
    if (!isLoggedIn) return null
    return toggleFavorite(game) ?? null
  }

  return {
    /** 目前已收藏的 game_id 清單（即時反映樂觀更新） */
    favoriteGameIds,
    /** 這個 game_id 目前對應的錠藏按鈕正在操作中（用於零散項目的 disabled） */
    mutatingGameIds,
    /** 任一收藏操作進行中為 true（適用於頁面層級的狀態展示） */
    isFavoriteMutating,
    /** 將收藏狀態同步進 GameItem 陣列的 `is_favorite` 欄位 */
    syncFavoriteFlag,
    /** 判斷單一遊戲是否已收藏 */
    isGameFavorited,
    /** 強制重新拉取伺服器收藏清單 */
    getFavoriteGames,
    /** 立即將所有 pending 變更送至後端（通常由 debounce 自動呼叫） */
    flushFavoriteChanges,
    /** 樂觀切換收藏狀態並排程後端同步（不含登入守衛，一般請用 handleToggleFavorite） */
    toggleFavorite,
    /** 帶登入守衛的收藏切換：未登入自動提示並跳轉，已登入執行樂觀更新 */
    handleToggleFavorite
  }
}
