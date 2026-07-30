<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
console.log("!! runtimeConfig.public.imageBase", runtimeConfig.public.imageBase)

const checked = ref(true)
const unchecked = ref(false)
const dateSingle = ref<string | null>(null)
const dateRange = ref<string[] | null>(null)
const dateDisabled = ref<string | null>("2026-04-14")

const favoriteColor = ref("orange")

const search = ref("")
const password = ref("")
const selectedBank = ref(null)
const banks = ref([
  { name: "Bank Transfer", code: "BT" },
  { name: "Pagbabayad Gamit Ang Cryptocurrency", code: "CRYPTO" },
  { name: "Paglipat Ng Cryptocurrency", code: "TRANS" }
])

const { pushToast } = useToastQueue()

const handleTestToast = () => {
  pushToast({
    severity: "success",
    summary: "Test Toast",
    detail: "This is a test toast message.",
    life: 3000
  })
}

const { isDown, width } = useCustomBreakpoints()
const { t, locale: currentLocale } = useI18n()

const { t: t2 } = useTestI18n() // 來自共享層 libs/shared/ui-layer

const authStore = useAuthStore() // 來自共享層 libs/shared/ui-layer
const userProfileStore = useUserProfileStore()
const walletStore = useWalletStore()
const favoriteGameStore = useFavoriteGameStore()
const giftStore = useGiftStore()
const testStore = useTestStore() // 來自本地層 apps/r017/src/stores
const { prefetchPostLoginQueries } = usePostLoginBootstrap()
const { logout, isPending: isLogoutPending } = useLogout()
const isBootstrapping = ref(false)

// 更新共享層 Store 的方法
const updateSharedStore = () => {
  const timeTag = new Date().toLocaleTimeString()
  authStore.setToken(`Token_Updated_at_${timeTag}`)
}

// 更新本地層 Store 的方法
const updateLocalStore = () => {
  testStore.updateMessage(`本地訊息已於 ${new Date().toLocaleTimeString()} 更新！`)
}

const handleDemoPostLoginBootstrap = async () => {
  if (isBootstrapping.value) return

  isBootstrapping.value = true
  try {
    const result = await prefetchPostLoginQueries()
    pushToast({
      severity: "success",
      summary: "Post-login Bootstrap",
      detail: `wallet:${result.wallet} account:${result.accountInfo} favorite:${result.favoriteGame} gift:${result.gift}`,
      life: 2500
    })
  } catch (error) {
    pushToast({
      severity: "error",
      summary: "Post-login Bootstrap Failed",
      detail: error instanceof Error ? error.message : "Unknown error",
      life: 2500
    })
  } finally {
    isBootstrapping.value = false
  }
}

const handleDemoLogout = async () => {
  try {
    await logout()
    pushToast({
      severity: "success",
      summary: "Logout Success",
      detail: "Local auth, stores and cached post-login queries are cleared.",
      life: 2500
    })
  } catch (error) {
    pushToast({
      severity: "error",
      summary: "Logout Failed",
      detail: error instanceof Error ? error.message : "Unknown error",
      life: 2500
    })
  }
}

const { bannerList, isLoading: isBannerListLoading } = useBanner({ params: { position: BANNER_POSITION_ENUMS.HOME } })

const toggleMode = () => {
  document.documentElement.classList.toggle("dark")
}

const overrideEmotionalColor = () => {
  document.documentElement.style.setProperty("--emotional-01", "green")
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

const { start, remainingSeconds } = useCountdownMemo({ key: "sms-1", time: 5 })

const plainBtnCount = ref(0)
const demoListActive = ref("overview")
const demoListItems = [
  { key: "overview", label: "總覽", icon: "mdi:view-dashboard-outline" },
  { key: "profile", label: "個人資訊", icon: "mdi:account-outline" },
  { key: "vip", label: "VIP 俱樂部", icon: "mdi:diamond-stone" },
  { key: "history", label: "歷史", icon: "mdi:history" }
]

const handleDemoListClick = (key: string) => {
  demoListActive.value = key
}

const demoPaginationPage = ref(1)

const demoTableColumns = [
  { field: "updatedAt", header: "帳變時間", width: "200px" },
  { field: "currencyCode", header: "幣種", width: "100px" },
  { field: "walletTypeLabel", header: "錢包類型", width: "120px" },
  { field: "actionTypeLabel", header: "帳變類型", width: "140px" },
  { field: "amount", header: "金額", width: "120px", bodyClass: "text-right" }
]

const demoTableRows = ref([
  {
    id: 1,
    updatedAt: "2026-04-21 09:20:30",
    currencyCode: "PHP",
    walletTypeLabel: "一般",
    actionTypeLabel: "下注",
    amount: "1000"
  },
  {
    id: 2,
    updatedAt: "2026-04-20 13:11:08",
    currencyCode: "IDR",
    walletTypeLabel: "錢包",
    actionTypeLabel: "存款",
    amount: "2500"
  }
])
</script>

<template>
  <div class="bg-[var(--color-zinc-500)]">
    <BaseTest />
    <BaseDraggable />

    <div class="w-full p-4 text-husky-primary flex items-center gap-4">
      <h1 class="text-[var(--primevue-abyss-500)]">R017</h1>

      <BaseBtn
        rounded
        @click="
          () => {
            handleTestToast()
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account
      </BaseBtn>

      <BaseBtn
        theme="secondary"
        @click="
          () => {
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account 2
      </BaseBtn>

      <BaseBtn
        category="outline"
        @click="
          () => {
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account 3
      </BaseBtn>

      <BaseBtn
        category="outline"
        theme="secondary"
        @click="
          () => {
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account 4
      </BaseBtn>

      <BaseBtn
        category="text"
        @click="
          () => {
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account 5
      </BaseBtn>

      <BaseBtn
        category="text"
        theme="secondary"
        @click="
          () => {
            console.log('Hello from BasePrimaryBtn!')
          }
        "
      >
        Create Account 6
      </BaseBtn>

      <Button class="gap-4">
        <BaseIcon name="mdi:check" size="1.5rem" class="p-button-icon" />
        <span> 這是來自 PrimeVue 的按鈕</span>
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

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4', 'flex-wrap')">
      <BaseTab category="round">round Tab</BaseTab>
      <BaseTab category="round" :active="true">round Active Tab</BaseTab>

      <BaseTab category="default">default Tab</BaseTab>
      <BaseTab category="default" :active="true">default Active Tab</BaseTab>

      <BaseTab category="square">square Tab</BaseTab>
      <BaseTab category="square" :active="true">square Active Tab</BaseTab>

      <BaseTab category="country">country Tab</BaseTab>
      <BaseTab category="country" :active="true">country Active Tab</BaseTab>
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4', 'flex-wrap')">
      <BaseBtn category="number">1,000</BaseBtn>
      <BaseBtn category="number" :active="true">1,000</BaseBtn>
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4')">
      <h3>Countdown</h3>

      <BaseBtn
        :disabled="remainingSeconds > 0"
        @click="
          () => {
            start()
          }
        "
      >
        {{ remainingSeconds > 0 ? `Wait ${remainingSeconds}s` : "Start Countdown" }}
      </BaseBtn>
    </div>

    <div class="w-full p-4 rounded-lg bg-slate-900 text-white space-y-4">
      <h3 class="text-lg font-semibold">BaseBadge / BasePagination / NoData / BaseTable Demo</h3>

      <div class="flex flex-wrap items-center gap-3">
        <BaseBadge size="sm" theme="primary"> TOP 1 </BaseBadge>
        <BaseBadge size="sm" theme="base"> PHP </BaseBadge>
        <BaseBadge size="md" theme="success"> 已達成 </BaseBadge>
        <BaseBadge size="md" theme="fail"> 未達成 </BaseBadge>
        <BaseBadge size="md" theme="info"> 添加中 </BaseBadge>
        <BaseBadge size="md" theme="warning"> 警告 </BaseBadge>
      </div>

      <div class="flex items-center justify-end">
        <BasePagination v-model="demoPaginationPage" :rows="10" :total-records="120" />
      </div>

      <div class="grid grid-cols-2 gap-3 phone:grid-cols-1">
        <div class="h-[220px] rounded-lg border border-white/20">
          <NoData type="empty" />
        </div>

        <div class="h-[220px] rounded-lg border border-white/20">
          <NoData type="card">
            <template #action>
              <BaseBtn theme="secondary" size="lg"> 新增銀行卡 </BaseBtn>
            </template>
          </NoData>
        </div>
      </div>

      <div class="h-[320px] rounded-lg border border-white/20 p-2">
        <BaseTable
          :rows="demoTableRows"
          :columns="demoTableColumns"
          :page="1"
          :rows-per-page="10"
          :total-records="demoTableRows.length"
        />
      </div>
    </div>

    <div :class="cx('w-full p-4 rounded-lg bg-slate-900 text-white space-y-4')">
      <h3 class="text-lg font-semibold">BasePlainBtn / ActionListBtn 測試</h3>

      <div class="flex items-center gap-3">
        <BaseIconBtn
          icon="mdi:arrow-left"
          theme="primary"
          size="lg"
          @click="() => console.log('Back button clicked')"
        />

        <BaseIconBtn
          icon="mdi:arrow-left"
          theme="secondary"
          size="md"
          @click="() => console.log('Back button clicked')"
        />

        <BaseIconBtn
          icon="mdi:arrow-left"
          theme="primaryOutline"
          size="sm"
          @click="() => console.log('Back button clicked')"
        />

        <BaseIconBtn icon="mdi:arrow-left" theme="normal" size="md" @click="() => console.log('Back button clicked')" />

        <BasePlainBtn
          :class-obj="{
            button:
              'px-4 py-2 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm leading-5'
          }"
          @click="plainBtnCount += 1"
        >
          點擊次數 +1
        </BasePlainBtn>
        <span class="text-sm text-white/80">目前次數：{{ plainBtnCount }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ActionListBtn
          v-for="item in demoListItems"
          :key="item.key"
          :label="item.label"
          :icon="item.icon"
          :active="demoListActive === item.key"
          active-mode="icon"
          :hover-like-active="true"
          @click="handleDemoListClick(item.key)"
        />
      </div>
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4')">
      <h3>Select</h3>

      <BaseSelect
        v-model="selectedBank"
        :options="banks"
        option-label="name"
        option-value="code"
        label="Select Payment Method"
        required
        placeholder="title"
        :class-obj="{
          panel: 'bg-[#1a1a1a]', // 微調選單背景色
          select: 'h-[44px]' // 如果需要鎖定高度
        }"
      />
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4')">
      <h3>Checkboxes</h3>

      <BaseCheckBox v-model="checked" />

      <BaseCheckBox v-model="unchecked" />

      <BaseCheckBox v-model="checked" disabled />

      <BaseCheckBox v-model="unchecked" disabled />
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'w-full', 'p-4')">
      <h3>Radios</h3>

      <div class="flex items-center gap-2">
        <BaseRadio v-model="favoriteColor" value="grey" input-id="grey" />
        <label for="grey" class="text-black">未選中</label>
      </div>

      <div class="flex items-center gap-2">
        <BaseRadio v-model="favoriteColor" value="orange" input-id="orange" />
        <label for="orange" class="text-black">已選中 (橘色)</label>
      </div>

      <div class="flex items-center gap-2 opacity-50">
        <BaseRadio v-model="favoriteColor" value="orange" disabled />
        <label class="text-black">禁用選中</label>
      </div>
    </div>

    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4', 'flex-col', 'w-full', 'p-4')">
      <h3>Inputs</h3>

      <BaseInput
        v-model="search"
        left-icon="mdi:magnify"
        placeholder="Search..."
        :class-obj="{
          // leftIcon: 'text-orange-500',
        }"
      />
      <br />
      <BaseInput
        v-model="password"
        label="Password label"
        required
        type="password"
        :invalid="true"
        error-message="你是錯的"
      />
      <br />
    </div>

    <div :class="cx('w-full', 'p-4', 'space-y-4', 'bg-slate-100 rounded-lg')">
      <h3 class="text-lg font-bold text-slate-900">BaseDatePicker Demo</h3>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <BaseDatePicker v-model="dateSingle" label="單日 (YYYY-MM-DD)" required />
          <p class="text-xs text-slate-600">value: {{ dateSingle }}</p>
        </div>

        <div class="space-y-2">
          <BaseDatePicker v-model="dateRange" label="區間" selection-mode="range" />
          <p class="text-xs text-slate-600">value: {{ dateRange }}</p>
        </div>

        <div class="space-y-2 md:col-span-2">
          <BaseDatePicker v-model="dateDisabled" label="禁用" :disabled="true" />
        </div>
      </div>
    </div>

    <Toast />
    <ConfirmDialog />

    <div class="w-full p-4">
      <h3 class="text-indigo-500">Confirm Dialogs</h3>
      <div class="card flex flex-wrap gap-2 justify-center">
        <Button :label="t('common.save')" variant="outlined" @click="confirm1()" />
        <Button :label="t('common.delete')" severity="danger" variant="outlined" @click="confirm2()" />
      </div>
    </div>

    <div class="w-full p-4 bg-[red] text-husky-primary">Tailwind 測試</div>

    <div class="w-full p-4 bg-[blue] text-brand-primary">Tailwind 測試2</div>

    <div class="w-full p-4 bg-[yellow] text-[var(--common-white-color)]">_common.scss 變數測試</div>

    <div class="w-full p-4 bg-[yellow] text-[var(--ticker-03)]">_variables.scss 變數測試</div>

    <div
      :class="
        cx('w-full p-4', 'bg-[var(--primary-02)]', 'text-[var(--primary-06)]', 'text-[purple]', FLEX_COL, 'gap-4')
      "
    >
      <div class="text-base">font-family 測試</div>

      <div class="text-base font-sans">
        這裡是襯線字集合字體 1234657890: '"Open Sans"', "Arial", '"PingFang SC"'(Mac / iOS 中文,系統字型),
        '"Microsoft YaHei"'(Windows 中文,系統字型), "ui-sans-serif", "system-ui", "sans-serif"
      </div>

      <div class="text-base font-arial">這裡是 Arial 字體 1234657890: ["Arial", "sans-serif", ...emojiFonts]</div>

      <div class="text-base font-din">這裡是DIN Pro 字體 1234657890: ["DINPro", "sans-serif", ...emojiFonts]</div>

      <div class="text-base font-segoe">這裡是 segoe 字體 1234657890: ["Segoe UI", "sans-serif", ...emojiFonts]</div>
    </div>

    <div :class="cx('w-full p-4', 'bg-[var(--primary-01)]', 'text-[var(--primary-05)]', 'text-[purple]', testUtils())">
      Utils: cx 測試
    </div>

    <div :class="cx('w-full p-4', 'bg-[aqua]')">
      <h3 :class="cx('w-full')">BaseIcon 測試</h3>

      <div :class="cx('icon-cotainer', FLEX_ITEMS_CENTER, 'gap-4')">
        <div>
          <BaseIcon name="mdi:home" size="2rem" class-name="text-3xl text-[var(--primary-03)]" />
        </div>

        <div>
          <BaseIcon name="ri:4k-line" size="2rem" class-name="text-3xl text-[var(--primary-03)]" />
        </div>
      </div>
    </div>

    <div class="w-full bg-[green] phone:bg-[blue] p-4">RWD斷點設計</div>

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
          <span class="label-key mr-2 block"
            >common.active t2 => 證實在 Nuxt 環境中可以正常使用從 #imports 來的 useI18n 和 useRouter</span
          >
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
        <BaseImage :is-show-src="true" src="/images/ai/game.webp" alt="Helper Image" />
      </div>

      <div class="w-full p-4 bg-[aqua] text-[var(--ticker-03)]">
        <div>圖片是否依照看到了容器才開始載入</div>
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
        <br />
        <BaseImage :is-show-src="true" src="/images/ai/helper.webp" alt="Helper Image" />
      </div>
    </div>

    <div class="p-8 space-y-8">
      <h1 class="text-2xl font-bold">Store 協作測試</h1>

      <div class="p-4 border border-blue-500 rounded-lg bg-blue-50">
        <h2 class="text-lg font-semibold text-blue-700">共享層 (Shared Auth Store)</h2>
        <div class="mt-2 space-y-1">
          <p>
            登入狀態：<span class="font-mono">{{ authStore.isLoggedIn ? "✅ 已登入" : "❌ 未登入" }}</span>
          </p>
          <p class="break-all">
            Token 內容：<span class="text-sm text-gray-600">{{ authStore.token || "無資料" }}</span>
          </p>
        </div>
        <BasePlainBtn
          :class-obj="{ button: 'mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors' }"
          @click="updateSharedStore"
        >
          更新共享 Token
        </BasePlainBtn>
      </div>

      <div class="p-4 border border-green-500 rounded-lg bg-green-50">
        <h2 class="text-lg font-semibold text-green-700">本地層 (Local App Store)</h2>
        <div class="mt-2">
          <p>
            當前訊息：<span class="font-medium italic">{{ testStore.message }}</span>
          </p>
        </div>
        <BasePlainBtn
          :class-obj="{ button: 'mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors' }"
          @click="updateLocalStore"
        >
          更新本地訊息
        </BasePlainBtn>
      </div>

      <p class="text-gray-500 text-sm">
        💡 提示：你可以嘗試重新整理網頁。由於共享層 Auth Store 開啟了持久化（persist: true）， Token
        內容應該會保留，而本地層 App Store 則會回到初始狀態。
      </p>
    </div>

    <div class="p-8 space-y-8">
      <h1 class="text-2xl font-bold">Post-login Store Sync Demo</h1>

      <div class="p-4 border border-purple-500 rounded-lg bg-purple-50 space-y-3">
        <p>
          Auth Account: <span class="font-mono">{{ authStore.loginData?.account || "-" }}</span>
        </p>
        <p>
          Profile Account: <span class="font-mono">{{ userProfileStore.profile?.account || "-" }}</span>
        </p>
        <p>
          Wallet Count: <span class="font-mono">{{ walletStore.walletList.length }}</span>
        </p>
        <p>
          Favorite Game Count: <span class="font-mono">{{ favoriteGameStore.favoriteGameList.length }}</span>
        </p>
        <p>
          Gift Count: <span class="font-mono">{{ giftStore.giftList.length }}</span>
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <BaseBtn :loading="isBootstrapping" :disabled="isBootstrapping" @click="handleDemoPostLoginBootstrap">
            1) Bootstrap Post-login Data
          </BaseBtn>

          <BaseBtn
            category="outline"
            theme="secondary"
            :loading="isLogoutPending"
            :disabled="isLogoutPending"
            @click="handleDemoLogout"
          >
            2) Logout and Clear Stores
          </BaseBtn>
        </div>
      </div>
    </div>

    <div class="p-8 space-y-8">
      <h1 class="text-2xl font-bold">首頁 BannerList</h1>

      <div class="p-4 border border-red-500 rounded-lg bg-red-50">
        <div class="w-full">
          <div v-if="isBannerListLoading" class="grid grid-cols-1 gap-4">
            <div class="animate-pulse bg-gray-200 aspect-[16/6] rounded-xl w-full" />
          </div>

          <div v-else class="flex flex-col gap-6">
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

              <a v-if="item.link" :href="item.link" class="absolute inset-0 z-10" target="_blank">
                <span class="sr-only">View {{ item.title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
