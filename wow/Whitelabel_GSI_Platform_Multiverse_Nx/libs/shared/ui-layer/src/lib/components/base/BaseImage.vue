<script setup lang="ts">
import { computed } from "vue"
import { joinURL } from "ufo"
import { useRuntimeConfig } from "#app"
import { getLimiter } from "@shared-lib/utils/limiter"

interface ImageClassObj {
  container?: string
  image?: string
  placeholder?: string
}

const props = withDefaults(
  defineProps<{
    src: string
    dir?: string
    alt?: string
    isLocal?: boolean
    loading?: "lazy" | "eager"
    modifiers?: Record<string, any>
    classObj?: ImageClassObj
    defaultSrc?: string
    isShowSrc?: boolean
  }>(),
  {
    dir: "",
    alt: "",
    isLocal: false,
    loading: "lazy",
    modifiers: () => ({}),
    classObj: () => ({}),
    isShowSrc: false
  }
)

const config = useRuntimeConfig()
const imageBase = computed(() => String(config.public.imageBase || ""))
const cacheVersion = computed(() => String(config.public.appVersion || config.public.buildTime || ""))
// const appVersion = config.public.appVersion || "1.0.0"

// 預設圖片寫死一份 (當 props.defaultSrc 為空時使用)
const HARDCODED_DEFAULT = "/images/default/default.webp"

// --- 響應式狀態 ---
const isVisible = ref(false)
const isLoaded = ref(false)
const blobUrl = ref("")
const successUrl = ref("") // 實際成功載入的圖片 URL（debug 用）
const containerRef = ref<HTMLElement | null>(null)

// --- 控制器與觀測器 ---
let observer: IntersectionObserver | null = null
let abortController: AbortController | null = null
// 防止並發重入：每次 startDownload 拿到自己的 token，舊的非同步結果回來時若 token 已變就靜默丟棄
let downloadToken = 0

// 獲取全域共享的併發限制器 (預設 6)
const limit = getLimiter(6)

const formatUrl = (path: string) => {
  if (!path) return ""
  if (path.startsWith("data:")) return path // base64 data URL，直接使用
  if (path.startsWith("http")) return path
  if (path.startsWith("/")) return cacheVersion.value ? `${path}?v=${cacheVersion.value}` : path
  return joinURL(imageBase.value, props.dir, path)
}

const computedImgSrc = computed(() => formatUrl(props.src))

/**
 * 判斷是否需要嘗試轉 .png
 */
const getFallbackUrl = (originalUrl: string) => {
  // 移除 query string 進行副檔名判斷
  const [baseUrl, queryString] = originalUrl.split("?")
  if (baseUrl.match(/\.(webp|avif)$/i)) {
    const pngUrl = baseUrl.replace(/\.(webp|avif)/i, ".png")
    return queryString ? `${pngUrl}?${queryString}` : pngUrl
  }
  return null
}

/**
 * 核心下載函數：結合 p-limit 與 AbortController
 * 序列嘗試抓取圖片
 */
const startDownload = async () => {
  if (!computedImgSrc.value || isLoaded.value) return

  // base64 data URL → 不需要 fetch，直接當作 src 使用
  if (computedImgSrc.value.startsWith("data:")) {
    blobUrl.value = computedImgSrc.value
    successUrl.value = "[base64 data URL]"
    isLoaded.value = true
    return
  }

  // 搶佔 token：若在 await 期間有新的呼叫進來（src 變更觸發），
  // 舊的 async 結果回來時會發現 token 已變，靜默丟棄，不覆蓋新結果。
  const myToken = ++downloadToken

  abortController = new AbortController()
  const { signal } = abortController

  const attempts: string[] = [computedImgSrc.value]
  const pngFallback = getFallbackUrl(computedImgSrc.value)
  if (pngFallback) attempts.push(pngFallback)

  // 如果有傳入 defaultSrc，優先排入嘗試列表
  if (props.defaultSrc) {
    const formattedDefault = formatUrl(props.defaultSrc)
    attempts.push(formattedDefault)

    const defaultPngFallback = getFallbackUrl(formattedDefault)
    if (defaultPngFallback) attempts.push(defaultPngFallback)
  }

  // 最後嘗試：HARDCODED_DEFAULT
  const formattedHardcodedDefault = formatUrl(HARDCODED_DEFAULT)
  attempts.push(formattedHardcodedDefault)

  const hardcodedPngFallback = getFallbackUrl(formattedHardcodedDefault)
  if (hardcodedPngFallback) attempts.push(hardcodedPngFallback)

  for (const [index, targetUrl] of attempts.entries()) {
    try {
      console.log(`BaseImage 嘗試載入 [${index}]:`, targetUrl) // 🔍 除錯用

      const blob = await limit(async () => {
        const MAX_RETRIES = 3
        let lastError: Error = new Error("unknown")

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const res = await fetch(targetUrl, { signal })

          // 5xx（通常是 dev proxy ECONNRESET 轉換而來）：最多 retry 3 次再放棄，
          // 避免因瞬間流量尖峰就直接跳到 fallback 圖片
          if (res.status >= 500) {
            lastError = new Error(`HTTP ${res.status} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`)
            console.warn(`BaseImage 5xx retry [${attempt + 1}/${MAX_RETRIES}]:`, targetUrl)
            continue
          }

          if (!res.ok) throw new Error(`HTTP ${res.status}`)

          const contentType = res.headers.get("Content-Type")
          // 強化檢查：確保必須包含 image 關鍵字
          if (!contentType || !contentType.startsWith("image/")) {
            throw new Error(`無效的類型: ${contentType}`)
          }

          return res.blob()
        }

        throw lastError
      })

      // token 檢查：若 src 已在 await 期間改變，丟棄舊結果
      if (myToken !== downloadToken) return

      if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
      blobUrl.value = URL.createObjectURL(blob)
      successUrl.value = targetUrl
      isLoaded.value = true
      console.log(`✅ BaseImage 載入成功:`, targetUrl)
      break
    } catch (err: any) {
      if (err.name === "AbortError") return
      console.warn(`❌ BaseImage 載入失敗 ${targetUrl}:`, err.message)
    }
  }
}

onMounted(() => {
  // 建立觀測器
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          startDownload()
          // 觸發載入後就停止觀測，節省效能
          if (containerRef.value) observer?.unobserve(containerRef.value)
        }
      })
    },
    {
      // rootMargin: '50px' 代表圖片進入視區前 50px 就開始載入，體驗更流暢
      rootMargin: "50px"
    }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()

  // ✅ 核心動作：立刻掐斷連線
  if (abortController) {
    abortController.abort()
  }

  // ✅ 核心動作：釋放記憶體
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
})

// 如果 src 改變，舊的請求要斷掉並重來
watch(
  () => props.src,
  () => {
    if (abortController) abortController.abort()
    if (blobUrl.value && !blobUrl.value.startsWith("data:")) URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ""
    successUrl.value = ""
    isLoaded.value = false
    if (isVisible.value) startDownload()
  }
)
</script>

<template>
  <div ref="containerRef" :class="cx('base-image-container inline-block', props.classObj.container)">
    <!-- debug: 隱藏，F12 可見 -->
    <span :data-computed-src="computedImgSrc" :data-fetched-src="successUrl" style="display: none" aria-hidden="true" />
    <div v-if="isShowSrc" class="text-xs text-gray-400 mb-1">BaseImage computedSrc: {{ computedImgSrc }}</div>

    <img
      v-if="isLoaded"
      :src="blobUrl"
      :alt="alt"
      :loading="loading"
      v-bind="$attrs"
      :class="
        cx(
          'w-full animate-fade-in',
          isLoaded ? 'opacity-100' : 'opacity-0', // 搭配初始 opacity-0 使用
          props.classObj.image
        )
      "
    />

    <div
      v-else
      :class="cx('min-h-[100px] transition-colors duration-300', FULL, FLEX_CENTER, props.classObj.placeholder)"
    >
      <!-- Loading state -->
      <div v-if="isVisible" class="flex flex-col items-center gap-2">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--primary-03)] opacity-40" />
        <span v-if="alt" class="text-xs text-gray-400 opacity-60">{{ alt }}</span>
      </div>

      <!-- Fallback state -->
      <span v-else class="text-xs text-gray-300">{{ alt }}</span>
    </div>
  </div>
</template>
