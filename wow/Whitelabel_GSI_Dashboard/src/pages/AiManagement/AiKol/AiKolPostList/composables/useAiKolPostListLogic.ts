import { ref, computed, watch, onMounted } from "vue"
import { useAIKol } from "@/composables/useAIKol"
import type * as Response from "src/api/response.type"

// 定義特殊的「全部KOL」選項類型（與 AiKolPostListSelect 一致）
type AllKolOption = { id: "all"; name: string; preview_image_url: null }
type SelectOption = Response.Kol | AllKolOption

export function useAiKolPostListLogic() {
  // 1. 引入底層 API Composable
  const { isLoading, kols, posts, getKolsList, getlistPosts } = useAIKol()

  // 2. 定義頁面狀態
  const currentKol = ref<SelectOption | null>(null)
  const currentPage = ref(1)
  const pageSize = 10

  // --- 詳情彈窗狀態 ---
  const showDetail = ref(false)
  const currentDetailIndex = ref(0)

  // 3. 計算屬性：分頁邏輯 (前端分頁)
  const totalPages = computed(() => {
    if (!posts.value || posts.value.length === 0) return 0
    return Math.ceil(posts.value.length / pageSize)
  })

  const paginatedPosts = computed(() => {
    if (!posts.value || posts.value.length === 0) return []

    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return posts.value.slice(start, end)
  })

  const hasData = computed(() => posts.value && posts.value.length > 0)

  // 取得目前詳情要顯示的那一筆 Post
  const currentDetailPost = computed(() => {
    if (!paginatedPosts.value.length) return null
    return paginatedPosts.value[currentDetailIndex.value] || null
  })

  // 判斷邊界 (控制上一張/下一張按鈕顯示)
  const isDetailFirst = computed(() => currentDetailIndex.value === 0)
  const isDetailLast = computed(() => currentDetailIndex.value === paginatedPosts.value.length - 1)

  // --- 新增：詳情彈窗操作方法 ---

  const openDetail = (index: number) => {
    currentDetailIndex.value = index
    showDetail.value = true
  }

  const handlePrevDetail = () => {
    if (!isDetailFirst.value) {
      currentDetailIndex.value--
    }
  }

  const handleNextDetail = () => {
    if (!isDetailLast.value) {
      currentDetailIndex.value++
    }
  }

  // 4. 監聽篩選器變更
  watch(currentKol, async (newKol) => {
    // A. 重置頁碼
    currentPage.value = 1

    // B. 根據選擇重新撈取資料
    // 如果選擇「全部KOL」(id === "all") -> 撈全部貼文
    // 如果選擇特定 KOL -> 撈該 KOL 的貼文
    const kolId = newKol?.id === "all" ? undefined : newKol?.id
    await getlistPosts(kolId)
  })

  // 監聽分頁變更：換頁時關閉詳情 (避免索引錯亂)
  watch(currentPage, () => {
    showDetail.value = false
    currentDetailIndex.value = 0
  })

  // 5. 初始化邏輯
  const initPage = async () => {
    // 平行請求：同時載入 KOL 選單 & 所有貼文
    await Promise.all([
      getKolsList(),
      getlistPosts() // 不帶參數 = 載入全部
    ])
  }

  onMounted(() => {
    initPage()
  })

  return {
    // State
    isLoading,
    kols, // 給 Select 用
    currentKol, // 給 Select v-model 用
    currentPage, // 給 Pagination v-model 用

    // Computed Data
    paginatedPosts, // 給 PostList 顯示當前頁面資料
    totalPages, // 給 Pagination 顯示總頁數
    hasData, // 判斷是否顯示 No Data 插圖

    // Detail Logic (新增的解構項目)
    showDetail, // v-model 控制彈窗
    currentDetailPost, // 當前顯示的貼文資料
    isDetailFirst, // 是否第一張
    isDetailLast, // 是否最後一張
    openDetail, // 開啟彈窗 fn

    handlePrevDetail, // 上一張 fn
    handleNextDetail, // 下一張 fn

    // Actions (如果需要手動觸發重新整理可導出)
    refresh: initPage
  }
}
