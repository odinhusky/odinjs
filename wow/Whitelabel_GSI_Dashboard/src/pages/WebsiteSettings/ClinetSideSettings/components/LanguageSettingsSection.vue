<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <div class="text-lg">{{ title }}</div>
      <!-- 儲存按鈕 -->
      <q-btn
        color="primary"
        class="w-20 text-base rounded-md"
        :outline="!canEdit || !hasChanges"
        type="button"
        @click="handleSave"
        :loading="isLoading"
        :disable="!canEdit || !hasChanges"
        dense
        >{{ t("btn.save") }}</q-btn
      >
    </div>
    <div class="mt-1 border border-[#c2c2ca] rounded-lg p-2 flex flex-col">
      <!-- 啟用的語系區塊（可拖曳排序） -->
      <div class="w-full">
        <div v-if="enabledLanguages.length > 0" class="font-medium text-base text-[#333] h-6">
          {{ t("website_settings.open_language") }}
        </div>
        <div v-else class="h-6"></div>
        <VueDraggableNext
          v-if="enabledLanguages.length > 0"
          v-model="enabledLanguages"
          class="min-h-8 flex flex-col"
          handle=".drag-handle"
          item-key="value"
        >
          <q-card
            v-for="element in enabledLanguages"
            :key="element.value"
            class="transition-all duration-200 ease-in-out hover:shadow-md mb-1"
            flat
            bordered
          >
            <q-card-section class="flex items-center py-0 px-2">
              <q-icon
                :name="canEdit ? 'drag_handle' : 'lock_outline'"
                :class="canEdit ? 'drag-handle text-[#999] mr-2 cursor-move' : 'text-[#999] mr-2'"
                size="sm"
              />
              <div class="flex-1 text-sm font-medium flex items-center gap-2">
                <img
                  v-if="element.flagUrl"
                  :src="element.flagUrl"
                  :alt="element.label"
                  class="flag-icon"
                  @error="handleFlagError"
                />
                <span>{{ element.label }}</span>
              </div>
              <q-toggle
                :model-value="element.enabled"
                @update:model-value="(val) => handleToggle(element, val)"
                :disable="!canEdit"
              />
            </q-card-section>
          </q-card>
        </VueDraggableNext>
      </div>

      <!-- 未啟用的語系區塊 -->
      <div class="w-full">
        <div v-if="disabledLanguages.length > 0" class="font-medium text-base text-[#333] h-6">
          {{ t("common.disable") }}
        </div>
        <div v-else class="h-6"></div>
        <VueDraggableNext
          v-if="disabledLanguages.length > 0"
          v-model="disabledLanguages"
          class="min-h-8 flex flex-col"
          item-key="value"
        >
          <q-card
            v-for="item in disabledLanguages"
            :key="item.value"
            class="transition-all duration-200 ease-in-out hover:shadow-md mb-1 cursor-default"
            flat
            bordered
          >
            <q-card-section class="flex items-center py-0 px-2">
              <q-icon name="lock_outline" class="text-[#999] mr-2" size="sm" />
              <div class="flex-1 text-sm font-medium flex items-center gap-2">
                <img
                  v-if="item.flagUrl"
                  :src="item.flagUrl"
                  :alt="item.label"
                  class="flag-icon"
                  @error="handleFlagError"
                />
                <span>{{ item.label }}</span>
              </div>
              <q-toggle
                :model-value="item.enabled"
                @update:model-value="(val) => handleToggle(item, val)"
                :disable="!canEdit"
              />
            </q-card-section>
          </q-card>
        </VueDraggableNext>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { VueDraggableNext } from "vue-draggable-next"
  import { getLanSettings, putLanSettings } from "src/api/common"
  import { useLanguage } from "src/composables/useLanguage"
  import { useSiteStore } from "src/stores/siteStore"

  interface BaseLanguageItem {
    label: string
    value: string
  }

  interface LanguageItemWithDisplay extends BaseLanguageItem {
    enabled: boolean
    flagUrl?: string
  }

  interface Props {
    title: string
    type: "member" | "agent"
    allLanguages: BaseLanguageItem[]
    canEdit: boolean
  }

  const props = defineProps<Props>()

  const { t } = useI18n()
  const $q = useQuasar()
  const { getFlagUrl, getLabel, getLanguage, setLanguage } = useLanguage()
  const siteStore = useSiteStore()

  const isLoading = ref(false)
  const isInitialized = ref(false)
  // 啟用的語系 key 陣列（順序即為排序）
  const enabledLanguageKeys = ref<string[]>([])
  // 未啟用的語系 key 陣列
  const disabledLanguageKeys = ref<string[]>([])
  // 原始狀態：用於比較是否有變更
  const originalEnabledKeys = ref<string[]>([])

  // 處理國旗圖片載入錯誤
  function handleFlagError(event: Event) {
    const img = event.target as HTMLImageElement
    if (img) {
      img.style.display = "none"
    }
  }

  // 監聽 allLanguages 變化，當有值時初始化
  watch(
    () => props.allLanguages,
    (newVal) => {
      if (newVal.length > 0 && !isInitialized.value) {
        initializeLanguages()
      }
    },
    { immediate: true }
  )

  // 初始化語系列表
  async function initializeLanguages() {
    if (props.allLanguages.length === 0) return

    try {
      const response = await getLanSettings(props.type)
      const enabledLangsRaw = response.data.languages || []

      // 處理 languages 可能是字串陣列或 CmsLangTitle 陣列的情況
      const enabledKeys = Array.isArray(enabledLangsRaw)
        ? enabledLangsRaw
            .map((item: any) => {
              // 如果是字串，直接返回
              if (typeof item === "string") return item.toLowerCase()
              // 如果是物件（CmsLangTitle），提取第一個 key 作為語系代碼
              const keys = Object.keys(item)
              return keys.length > 0 ? keys[0].toLowerCase() : ""
            })
            .filter((lang: string) => lang !== "")
        : []

      // 所有語系的 key
      const allKeys = props.allLanguages.map((lang) => lang.value.toLowerCase())

      // 初始化啟用和未啟用的語系 key 陣列
      enabledLanguageKeys.value = enabledKeys.filter((key) => allKeys.includes(key))
      disabledLanguageKeys.value = allKeys.filter((key) => !enabledKeys.includes(key))

      // 保存原始狀態（深拷貝）
      originalEnabledKeys.value = [...enabledLanguageKeys.value]
      isInitialized.value = true
    } catch (e: any) {
      console.error(`Failed to load ${props.type} language settings:`, e)
    }
  }

  // 計算屬性：啟用的語系（根據 enabledLanguageKeys 順序生成）
  const enabledLanguages = computed({
    get: (): LanguageItemWithDisplay[] => {
      return enabledLanguageKeys.value
        .map((key) => props.allLanguages.find((lang) => lang.value.toLowerCase() === key))
        .filter((lang): lang is BaseLanguageItem => lang !== undefined)
        .map((lang) => {
          const flagUrl = getFlagUrl(lang.value)
          const label = getLabel(lang.value)
          return {
            ...lang,
            label,
            enabled: true,
            flagUrl: flagUrl || undefined
          }
        })
    },
    set: (newValue: LanguageItemWithDisplay[]) => {
      // 如果不能編輯，不更新順序
      if (!props.canEdit) {
        return
      }
      // 更新啟用語系的順序（拖曳排序）
      enabledLanguageKeys.value = newValue.map((lang) => lang.value.toLowerCase())
    }
  })

  // 計算屬性：未啟用的語系（按照 name 排序）
  const disabledLanguages = computed({
    get: (): LanguageItemWithDisplay[] => {
      return disabledLanguageKeys.value
        .map((key) => props.allLanguages.find((lang) => lang.value.toLowerCase() === key))
        .filter((lang): lang is BaseLanguageItem => lang !== undefined)
        .map((lang) => {
          const flagUrl = getFlagUrl(lang.value)
          const label = getLabel(lang.value)
          return {
            ...lang,
            label,
            enabled: false,
            flagUrl: flagUrl || undefined
          }
        })
        .sort((a, b) => a.label.localeCompare(b.label))
    },
    set: () => {
      // 停用列表不允許拖曳排序，所以 set 不做任何事
      return
    }
  })

  // 計算屬性：檢查是否有變更
  const hasChanges = computed(() => {
    if (originalEnabledKeys.value.length === 0) return false

    // 直接比較陣列長度和內容
    if (enabledLanguageKeys.value.length !== originalEnabledKeys.value.length) return true

    // 比較每個位置的語系代碼
    return enabledLanguageKeys.value.some((key, index) => key !== originalEnabledKeys.value[index])
  })

  // 切換語系啟用狀態
  function handleToggle(lang: LanguageItemWithDisplay, newValue: boolean) {
    const langKey = lang.value.toLowerCase()

    if (newValue) {
      // 啟用：從未啟用陣列移除，加入啟用陣列末尾
      disabledLanguageKeys.value = disabledLanguageKeys.value.filter((key) => key !== langKey)
      if (!enabledLanguageKeys.value.includes(langKey)) {
        enabledLanguageKeys.value.push(langKey)
      }
    } else {
      // 停用：從啟用陣列移除，加入未啟用陣列
      enabledLanguageKeys.value = enabledLanguageKeys.value.filter((key) => key !== langKey)
      if (!disabledLanguageKeys.value.includes(langKey)) {
        disabledLanguageKeys.value.push(langKey)
      }
    }
  }

  // 保存設定
  async function handleSave() {
    // 驗證：至少需要一個啟用的語系
    if (enabledLanguageKeys.value.length <= 0) {
      $q.notify({
        type: "positive",
        message: t("error_msg.open_lan_must_item"),
        position: "top",
        timeout: 300
      })
      return
    }

    // 預設語系自動設定為啟用語系中排序第一的
    const defaultLangValue = enabledLanguageKeys.value[0]

    isLoading.value = true

    const sendData = {
      languages: enabledLanguageKeys.value as any,
      default_language: defaultLangValue
    }

    let res = await putLanSettings(sendData, props.type)
    if (res?.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      isLoading.value = false

      // 保存成功後，直接更新原始狀態，避免重新獲取資料
      originalEnabledKeys.value = [...enabledLanguageKeys.value]

      // 如果是代理端語系設定，同步更新 siteStore 的 bo_language
      if (props.type === "agent") {
        // 獲取當前使用的語系
        const currentLang = getLanguage()

        // 更新 siteStore 的 bo_language，讓 header 下拉選單同步更新
        siteStore.updateBoLanguages(enabledLanguageKeys.value, defaultLangValue)

        // 檢查當前使用的語系是否在新的語系列表中
        // 將當前語系轉為小寫以便比較（避免大小寫不一致的問題）
        const currentLangLower = currentLang.toLowerCase()
        // 檢查新的語系列表中是否包含當前語系
        const isCurrentLangAvailable = enabledLanguageKeys.value.some((lang) => lang.toLowerCase() === currentLangLower)

        // 如果當前語系不在新的設定中，自動切換到預設語系
        // 避免用戶使用已被移除的語系，確保界面正常顯示
        if (!isCurrentLangAvailable) {
          setLanguage(defaultLangValue)
        }
      }
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
      isLoading.value = false
    }
  }

  // 初始化：當組件掛載且 allLanguages 有值時，獲取當前語系設定
  onMounted(() => {
    if (props.allLanguages.length > 0) {
      initializeLanguages()
    }
  })
</script>

<style lang="scss" scoped>
  // 拖曳時的樣式（需要深度選擇器）
  :deep(.sortable-ghost) {
    opacity: 0.4;
    background-color: #f0f0f0;
  }

  :deep(.sortable-drag) {
    opacity: 0.8;
  }

  // 國旗圖標樣式 - 添加邊框和陰影以在白底上更明顯
  .flag-icon {
    width: 1.25rem; // w-5
    height: 1.25rem; // h-5
    border-radius: 9999px; // rounded-full
    object-fit: cover;
    // 添加更明顯的邊框，讓白色國旗在白底上清晰可見
    border: 1.5px solid rgba(0, 0, 0, 0.15);
    // 增強陰影效果，增加層次感和對比度
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.1);
    // 確保圖片顯示正確
    display: block;
    flex-shrink: 0;
    // 添加過渡效果，讓交互更流暢
    transition: box-shadow 0.2s ease;
  }
</style>
