<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
console.log("!! runtimeConfig.public.imageBase", runtimeConfig.public.imageBase)

const { isDown, width } = useCustomBreakpoints()
const { t, locale: currentLocale } = useI18n()

const { t: t2 } = useTestI18n() // 來自共享層 libs/shared/ui-layer

const authStore = useAuthStore() // 來自共享層 libs/shared/ui-layer
const testStore = useTestStore() // 來自本地層 apps/r001/src/stores

// 更新共享層 Store 的方法
const updateSharedStore = () => {
  const timeTag = new Date().toLocaleTimeString()
  authStore.setToken(`Token_Updated_at_${timeTag}`)
}

// 更新本地層 Store 的方法
const updateLocalStore = () => {
  testStore.updateMessage(`本地訊息已於 ${new Date().toLocaleTimeString()} 更新！`)
}

// 暫時註解掉 API 調用，避免錯誤
const { bannerList, isLoading: isBannerListLoading } = useBanner({ params: { position: BANNER_POSITION_ENUMS.Home } })

const toggleMode = () => {
  document.documentElement.classList.toggle("dark")
}

const overrideEmotionalColor = () => {
  document.documentElement.style.setProperty('--emotional-01', 'green')
}

// =====================
// import { useConfirm } from "primevue/useconfirm"
// import { useToast } from "primevue/usetoast"

const confirm = useConfirm()
const toast = useToast()

const confirm1 = () => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: "Save"
    },
    accept: () => {
      toast.add({ severity: "info", summary: "Confirmed", detail: "You have accepted", life: 3000 })
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", life: 3000 })
    }
  })
}

const confirm2 = () => {
  confirm.require({
    message: "Do you want to delete this record?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: "Delete",
      severity: "danger"
    },
    accept: () => {
      toast.add({ severity: "info", summary: "Confirmed", detail: "Record deleted", life: 3000 })
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", life: 3000 })
    }
  })
}
</script>

<template>
  <div>
    <BaseTest />
    <BaseDraggable />

    <div class="w-full p-4 text-husky-primary flex items-center gap-4">
      <Button class="gap-4">
        <BaseIcon
          name="mdi:check"
          size="1.5rem"
          class="p-button-icon"
        />
        <span>這是來自 PrimeVue 的按鈕</span>
      </Button>

      <Button
        class="bg-[var(--emotional-01)] hover:!bg-[var(--emotional-01)] !border-none"
        @click="overrideEmotionalColor"
      >
        <span>覆蓋 emotional-01 為 green</span>
      </Button>

      <Button
        class="bg-[var(--primary-04)] hover:!bg-[var(--primary-05)] hover:text-[#ffffff] !border-none"
        @click="toggleMode"
      >
        <span>Toggle Mode</span>
      </Button>

      <span class="text-sky-500">測試 tailwindcss-primeui: 天藍色文字</span>
    </div>

    <Toast />
    <ConfirmDialog />

    <div class="w-full p-4">
      <h3 class="text-indigo-500">
        Confirm Dialogs
      </h3>
      <div class="card flex flex-wrap gap-2 justify-center">
        <Button
          :label="t('common.save')"
          variant="outlined"
          @click="confirm1()"
        />
        <Button
          :label="t('common.delete')"
          severity="danger"
          variant="outlined"
          @click="confirm2()"
        />
      </div>
    </div>

    <div class="w-full p-4 bg-[red] text-husky-primary">
      Tailwind 測試
    </div>

    <div class="w-full p-4 bg-[blue] text-brand-primary">
      Tailwind 測試2
    </div>

    <div class="w-full p-4 bg-[yellow] text-[var(--common-white-color)]">
      _common.scss 變數測試
    </div>

    <div class="w-full p-4 bg-[yellow] text-[var(--ticker-03)]">
      _variables.scss 變數測試
    </div>

    <div
      :class="
        cx('w-full p-4', 'bg-[var(--primary-02)]', 'text-[var(--primary-06)]', 'text-[purple]', FLEX_COL, 'gap-4')
      "
    >
      <div class="text-base">
        font-family 測試
      </div>

      <div class="text-base font-sans">
        這裡是襯線字集合字體 1234657890: '"Open Sans"', "Arial", '"Noto Sans TC"', '"PingFang SC"'(Mac 中文備援),
        '"Microsoft YaHei"'(Windows 中文備援), "ui-sans-serif", "system-ui", "sans-serif"
      </div>

      <div class="text-base font-notosans">
        這裡是 Noto Sans TC 字體 1234657890: ["Noto Sans TC", "sans-serif", ...emojiFonts]
      </div>

      <div class="text-base font-arial">
        這裡是 Arial 字體 1234657890: ["Arial", "sans-serif", ...emojiFonts]
      </div>

      <div class="text-base font-din">
        這裡是DIN Pro 字體 1234657890: ["DINPro", "sans-serif", ...emojiFonts]
      </div>

      <div class="text-base font-segoe">
        這裡是 segoe 字體 1234657890: ["Segoe UI", "sans-serif", ...emojiFonts]
      </div>
    </div>

    <div :class="cx('w-full p-4', 'bg-[var(--primary-01)]', 'text-[var(--primary-05)]', 'text-[purple]', testUtils())">
      Utils: cx 測試
    </div>

    <div :class="cx('w-full p-4', 'bg-[aqua]')">
      <h3 :class="cx('w-full')">
        BaseIcon 測試
      </h3>

      <div :class="cx('icon-cotainer', FLEX_ITEMS_CENTER, 'gap-4')">
        <div>
          <BaseIcon
            name="mdi:home"
            size="2rem"
            class-name="text-3xl text-[var(--primary-03)]"
          />
        </div>

        <div>
          <BaseIcon
            name="ri:4k-line"
            size="2rem"
            class-name="text-3xl text-[var(--primary-03)]"
          />
        </div>
      </div>
    </div>

    <div class="w-full bg-[green] phone:bg-[blue] p-4">
      RWD斷點設計
    </div>

    <div :class="cx('w-full bg-[var(--secondary-03)] p-4', { 'bg-[yellow]': isDown.phone })">
      useCustomBreakpoints 測試 width: {{ width }}
    </div>

    <div :class="cx('w-full bg-[var(--secondary-04)] p-4')">
      I18n 測試

      <div :class="cx('label-list', 'mt-4', 'grid', 'grid-cols-1', 'gap-4', 'sm:grid-cols-2', 'md:grid-cols-3')">
        <div class="label-item">
          <span class="label-key mr-2 block">btn.login</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("btn.login") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">btn.join</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("btn.join") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">btn.search</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("btn.search") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">btn.save</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("btn.save") }}</span>
        </div>

        <!-- 通用標籤 -->
        <div class="label-item">
          <span class="label-key mr-2 block">common.balance</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("common.balance") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">common.currency</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("common.currency") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">common.deposit</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("common.deposit_flow_type") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">common.active</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t("common.active") }}</span>
        </div>

        <div class="label-item">
          <span class="label-key mr-2 block">common.active t2 => 證實在 Nuxt 環境中可以正常使用從 #imports 來的 useI18n 和 useRouter</span>
          <span class="label-value text-[var(--secondary-01)]">{{ t2("common.active") }}</span>
        </div>
      </div>
    </div>

    <div>
      <h3>本地圖片測試</h3>

      <div class="w-full p-4 bg-[aqua] text-[var(--ticker-03)]">
        <div>圖片錯誤路徑且自自訂義預設圖片路徑也錯誤是否能正確顯示全局預設的 default 圖片</div>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper3.webp"
          alt="Helper Image"
          default-src="/images/ai/helper99.webp"
        />
      </div>

      <div class="w-full p-4 bg-[aqua] text-[var(--ticker-03)]">
        <div>圖片錯誤路徑是否能夠正確對應到自訂義預設圖片</div>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper3.webp"
          alt="Helper Image"
          default-src="/images/ai/helper2.webp"
        />
      </div>

      <div class="w-full p-4 bg-[aqua] text-[var(--ticker-03)]">
        <div>圖片正確路徑但沒有 webp 只有 png 是否能正確抓到 png</div>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/game.webp"
          alt="Helper Image"
        />
      </div>

      <div class="w-full p-4 bg-[aqua] text-[var(--ticker-03)]">
        <div>圖片是否依照看到了容器才開始載入</div>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
        <br>
        <BaseImage
          :is-show-src="true"
          src="/images/ai/helper.webp"
          alt="Helper Image"
        />
      </div>
    </div>

    <div class="p-8 space-y-8">
      <h1 class="text-2xl font-bold">
        Store 協作測試
      </h1>

      <div class="p-4 border border-blue-500 rounded-lg bg-blue-50">
        <h2 class="text-lg font-semibold text-blue-700">
          共享層 (Shared Auth Store)
        </h2>
        <div class="mt-2 space-y-1">
          <p>
            登入狀態：<span class="font-mono">{{ authStore.isLoggedIn ? "✅ 已登入" : "❌ 未登入" }}</span>
          </p>
          <p class="break-all">
            Token 內容：<span class="text-sm text-gray-600">{{ authStore.token || "無資料" }}</span>
          </p>
        </div>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="updateSharedStore"
        >
          更新共享 Token
        </button>
      </div>

      <div class="p-4 border border-green-500 rounded-lg bg-green-50">
        <h2 class="text-lg font-semibold text-green-700">
          本地層 (Local App Store)
        </h2>
        <div class="mt-2">
          <p>
            當前訊息：<span class="font-medium italic">{{ testStore.message }}</span>
          </p>
        </div>
        <button
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          @click="updateLocalStore"
        >
          更新本地訊息
        </button>
      </div>

      <p class="text-gray-500 text-sm">
        💡 提示：你可以嘗試重新整理網頁。由於共享層 Auth Store 開啟了持久化（persist: true）， Token
        內容應該會保留，而本地層 App Store 則會回到初始狀態。
      </p>
    </div>

    <div class="p-8 space-y-8">
      <h1 class="text-2xl font-bold">
        首頁 BannerList
      </h1>

      <div class="p-4 border border-red-500 rounded-lg bg-red-50">
        <div class="w-full">
          <div
            v-if="isBannerListLoading"
            class="grid grid-cols-1 gap-4"
          >
            <div class="animate-pulse bg-gray-200 aspect-[16/6] rounded-xl w-full" />
          </div>

          <div
            v-else
            class="flex flex-col gap-6"
          >
            <div
              v-for="item in bannerList"
              :key="item.id"
              class="group relative overflow-hidden rounded-2xl bg-slate-100 transition-all hover:shadow-lg"
            >
              path: {{ item.image_json?.[currentLocale.toLowerCase()] }} src:
              {{ getLocaleImgPath(item.image_json, currentLocale) }}
              <BaseImage
                :src="getLocaleImgPath(item.image_json, currentLocale)"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                draggable="false"
              />

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-4"
              >
                <p class="text-white font-medium text-lg">
                  {{ item.title }}
                </p>
              </div>

              <a
                v-if="item.link"
                :href="item.link"
                class="absolute inset-0 z-10"
                target="_blank"
              >
                <span class="sr-only">View {{ item.title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NxWelcome title="okbet" />
  </div>
</template>
