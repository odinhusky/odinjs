<script setup lang="ts">
import { useMemberManagementContext } from "../../composables/useMembershipManagement/useMemberManagementContext"

const ctx = useMemberManagementContext()

const {
  memberAgentCustomizeColumnId,
  memberAgentCustomizeColumn,
  memberAgentCustomizeColumnData,
  memberAgentReferralList,
  memberAgentTagList,
  isAddSubordinateLoading,
  isAddSubordinateSubmitting,
  handleInitAddSubordinate,
  handleBackFromAddSubordinate,
  handleSubmitAddSubordinate
} = ctx

const { isDown } = useCustomBreakpoints()

const isEdit = computed(() => memberAgentCustomizeColumnId.value > 0)
const pageHeader = computed(() => (isDown.phone ? "個人資訊" : (isEdit.value ? "編輯下級" : "新增下級")))

const step = ref<1 | 2>(1)

onMounted(() => handleInitAddSubordinate())

// 二選一 options（沿用 BaseSelectButton）
const STATUS_OPTIONS = [
  { label: "啟用", value: 1 },
  { label: "停用", value: 0 }
]
const FREEZE_OPTIONS = [
  { label: "未凍結", value: 0 },
  { label: "凍結", value: 1 }
]

// 將 boolean 與 0/1 互轉，沿用既有 data 結構
const statusValue = (raw: any): 1 | 0 => (raw ? 1 : 0)

const passwordVisibleMap = ref<Record<string, boolean>>({})
const isPasswordField = (col: any) => col.column_name === "password"

// Step 1 必填驗證
const { pushToast } = useToastQueue()
const validateStep1Required = () => {
  const ok = memberAgentCustomizeColumn.value
    .filter((c: any) => c.required)
    .every((c: any) => {
      const v = memberAgentCustomizeColumnData.value[c.column_name]
      return v !== null && v !== undefined && v !== ""
    })
  if (!ok) {
    pushToast({ severity: "warn", summary: "Validation", detail: "請填寫所有必填欄位", life: 2200 })
    return false
  }
  return true
}

const goNext = () => {
  if (!validateStep1Required()) return
  step.value = 2
}
const goPrev = () => { step.value = 1 }

// ── 樣式 ──
// Figma: input bg `--input-input-bg-primary-enabled`, border `--input-input-border-primary-enabled`
const inputClass = cx(
  "w-full h-10 rounded-lg px-3 text-sm leading-5",
  "bg-[var(--input-input-bg-primary-enabled)] text-[var(--text-text-primary)]",
  "border border-[var(--input-input-border-primary-enabled)]",
  "placeholder:text-[var(--input-input-title-primary-enabled,var(--input-input-placeholder-primary-enabled))]",
  "outline-none focus:border-[var(--input-input-border-primary-focused,var(--input-input-border-primary-enabled))]",
  "disabled:opacity-50 disabled:cursor-not-allowed"
)
// Figma: label 14/20 regular, gap-1 (4px) to input
const labelClass = cx("flex items-center gap-1 text-sm leading-5 text-[var(--text-text-primary)] mb-1")
// Figma: 6x6 圓 dot, color --icon-icon-negative
const reqDotClass = cx("inline-block w-1.5 h-1.5 rounded-full bg-[var(--icon-icon-negative,#ef4444)]")

// Figma 5807:36322 step item — 32x32 outer
//   active: p-2 (8px) → 內含 16x16 icon
//   enabled: 純 32x32 + "2" 14/20 semibold
//   color text 透過 stepperActive 容器設定，icon currentColor 繼承
const stepperActive = cx(
  "w-8 h-8 rounded-full flex items-center justify-center p-2",
  "bg-[var(--stepper-stepper-bg-active)] border border-[var(--stepper-stepper-border-active)]",
  "text-[var(--stepper-stepper-icon-active)]"
)
const stepperEnabled = cx(
  "w-8 h-8 rounded-full flex items-center justify-center",
  "bg-[var(--stepper-stepper-bg-enabled)] border border-[var(--stepper-stepper-border-enabled)]",
  "text-[var(--text-text-primary)]"
)
const stepperLine = cx("flex-1 h-px bg-[var(--border-border-primary)]")

// BaseSelectButton 的 item 強制改為 36px 高（外加 4px wrap padding = 44px，對齊 Figma tab 44）
const selectBtnClassObj = {
  option: "!min-h-[36px] !py-1"
}
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-5')">
    <!-- 頁首：返回 + 標題 -->
    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3')">
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--button-button-bg-secondary-left-enabled)] text-[var(--text-text-primary)]"
        @click="handleBackFromAddSubordinate"
      >
        <BaseIcon name="mdi:arrow-left" size="20px" />
      </button>
      <span class="text-base leading-6 font-bold text-[var(--text-text-primary)]">{{ pageHeader }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isAddSubordinateLoading" class="flex justify-center py-12">
      <BaseIcon name="mdi:loading" size="32px" class="animate-spin text-[var(--text-text-secondary)]" />
    </div>

    <template v-else>
      <!-- ============ Stepper（640 寬置中） ============ -->
      <div :class="cx(FLEX_ITEMS_CENTER, 'gap-5 w-full max-w-[640px] mx-auto')">
        <!-- Step 1：active；step 2 時仍視為 active（完成） -->
        <div :class="stepperActive">
          <BaseIcon name="mdi:pencil" size="16px" />
        </div>

        <div :class="stepperLine" />

        <!-- Step 2 -->
        <div :class="step === 2 ? stepperActive : stepperEnabled">
          <BaseIcon v-if="step === 2" name="mdi:pencil" size="16px" />
          <span v-else class="text-sm leading-5 font-semibold">2</span>
        </div>
      </div>

      <!-- ============ Step 1 ============ -->
      <template v-if="step === 1">
        <!-- 標題 -->
        <div class="text-center text-base leading-6 font-bold text-[var(--text-text-primary)] w-full max-w-[640px] mx-auto">
          會員基本資訊設定
        </div>

        <!-- 二選一 三組（狀態 / 代理身份 / 凍結狀態），各組 label 在上 -->
        <div :class="cx('w-full max-w-[640px] mx-auto flex gap-3 phone:flex-col phone:gap-4', !isDown.phone && 'justify-between')">
          <div class="flex flex-col gap-1">
            <span class="text-sm leading-5 text-[var(--text-text-primary)]">狀態</span>
            <BaseSelectButton
              :model-value="statusValue(memberAgentCustomizeColumnData.is_enabled)"
              :options="STATUS_OPTIONS"
              size="lg"
              :class-obj="selectBtnClassObj"
              @update:model-value="memberAgentCustomizeColumnData.is_enabled = Number($event) === 1"
            />
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-sm leading-5 text-[var(--text-text-primary)]">代理身份</span>
            <BaseSelectButton
              :model-value="statusValue(memberAgentCustomizeColumnData.is_member_agent)"
              :options="STATUS_OPTIONS"
              size="lg"
              :class-obj="selectBtnClassObj"
              @update:model-value="memberAgentCustomizeColumnData.is_member_agent = Number($event) === 1"
            />
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-sm leading-5 text-[var(--text-text-primary)]">凍結狀態</span>
            <BaseSelectButton
              :model-value="statusValue(memberAgentCustomizeColumnData.is_blocked)"
              :options="FREEZE_OPTIONS"
              size="lg"
              :class-obj="selectBtnClassObj"
              @update:model-value="memberAgentCustomizeColumnData.is_blocked = Number($event) === 1"
            />
          </div>
        </div>

        <!-- 表單欄位（PC 2 col，phone 1 col） -->
        <div class="w-full max-w-[640px] mx-auto grid grid-cols-2 phone:grid-cols-1 gap-x-3 gap-y-5">
          <template v-for="column in memberAgentCustomizeColumn" :key="column.column_name">
            <!-- INPUT (type=1) -->
            <div v-if="column.type === 1" class="flex flex-col">
              <label :class="labelClass">
                <span>{{ column.column_label }}</span>
                <span v-if="column.required" :class="reqDotClass" />
              </label>
              <div class="relative">
                <input
                  :class="cx(inputClass, isPasswordField(column) && 'pr-10')"
                  :type="isPasswordField(column) && !passwordVisibleMap[column.column_name] ? 'password' : 'text'"
                  :value="memberAgentCustomizeColumnData[column.column_name]"
                  :disabled="!column.edit"
                  placeholder="請輸入 ..."
                  @input="memberAgentCustomizeColumnData[column.column_name] = ($event.target as HTMLInputElement).value"
                />
                <button
                  v-if="isPasswordField(column)"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--input-input-icon-primary-enabled,var(--text-text-secondary))]"
                  @click="passwordVisibleMap[column.column_name] = !passwordVisibleMap[column.column_name]"
                >
                  <BaseIcon
                    :name="passwordVisibleMap[column.column_name] ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                    size="18px"
                  />
                </button>
              </div>
            </div>

            <!-- SELECT (type=2) — ref_account -->
            <div v-else-if="column.type === 2 && column.column_name === 'ref_account'" class="flex flex-col">
              <label :class="labelClass">
                <span>{{ column.column_label }}</span>
                <span v-if="column.required" :class="reqDotClass" />
              </label>
              <BaseSelect
                :model-value="memberAgentCustomizeColumnData[column.column_name]"
                :options="memberAgentReferralList"
                option-label="label"
                option-value="label"
                placeholder="請選擇"
                :disabled="!column.edit || memberAgentReferralList.length === 0"
                @update:model-value="memberAgentCustomizeColumnData[column.column_name] = $event"
              />
            </div>

            <!-- SELECT (type=2) — 其他 -->
            <div v-else-if="column.type === 2" class="flex flex-col">
              <label :class="labelClass">
                <span>{{ column.column_label }}</span>
                <span v-if="column.required" :class="reqDotClass" />
              </label>
              <BaseSelect
                :model-value="memberAgentCustomizeColumnData[column.column_name]"
                :options="column.values"
                option-label="label"
                option-value="value"
                placeholder="請選擇"
                :disabled="!column.edit"
                @update:model-value="memberAgentCustomizeColumnData[column.column_name] = $event"
              />
            </div>

            <!-- DATE (type=3) -->
            <div v-else-if="column.type === 3" class="flex flex-col">
              <label :class="labelClass">
                <span>{{ column.column_label }}</span>
                <span v-if="column.required" :class="reqDotClass" />
              </label>
              <input
                type="date"
                :class="inputClass"
                :value="memberAgentCustomizeColumnData[column.column_name]"
                :disabled="!column.edit"
                @input="memberAgentCustomizeColumnData[column.column_name] = ($event.target as HTMLInputElement).value"
              />
            </div>

            <!-- CHECKBOX (type=4) -->
            <div v-else-if="column.type === 4" :class="cx(FLEX_ITEMS_CENTER, 'gap-2 self-end pb-1')">
              <BaseCheckBox
                :model-value="memberAgentCustomizeColumnData[column.column_name]"
                :label="column.column_label"
                :disabled="!column.edit"
                @update:model-value="memberAgentCustomizeColumnData[column.column_name] = $event"
              />
            </div>
          </template>
        </div>

        <!-- Footer：PC = 取消 / 下一步（各 310×48，gap 20）；H5 = 確認（單按鈕直接送出） -->
        <div v-if="!isDown.phone" class="w-full max-w-[640px] mx-auto flex gap-5 pt-4">
          <BaseBtn
            theme="primary"
            category="outline"
            size="lg"
            class="flex-1 h-12"
            @click="handleBackFromAddSubordinate"
          >
            取消
          </BaseBtn>
          <BaseBtn
            theme="primary"
            size="lg"
            class="flex-1 h-12"
            @click="goNext"
          >
            下一步
          </BaseBtn>
        </div>
        <div v-else class="pt-4">
          <BaseBtn
            theme="primary"
            size="lg"
            class="w-full h-12"
            :loading="isAddSubordinateSubmitting"
            @click="handleSubmitAddSubordinate"
          >
            確認
          </BaseBtn>
        </div>
      </template>

      <!-- ============ Step 2 ============ -->
      <template v-else>
        <div class="text-center text-base leading-6 font-bold text-[var(--text-text-primary)] w-full max-w-[640px] mx-auto">
          勾選會員標籤
        </div>

        <div class="w-full max-w-[840px] mx-auto flex flex-wrap gap-3 justify-center">
          <button
            v-for="tag in memberAgentTagList"
            :key="tag.id"
            type="button"
            :class="cx(
              'h-10 px-4 rounded-full text-sm leading-5 font-semibold whitespace-nowrap border transition-colors',
              tag.checked
                ? 'bg-[linear-gradient(90deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)] text-[var(--button-button-title-secondary-enabled)] border-transparent'
                : 'border-[var(--button-button-bg-secondary-left-enabled)] text-[var(--button-button-bg-secondary-left-enabled)] hover:bg-[var(--list-list-bg-hover)]'
            )"
            @click="tag.checked = !tag.checked"
          >
            {{ tag.name }}
          </button>
        </div>

        <div class="w-full max-w-[640px] mx-auto flex gap-5 pt-4">
          <BaseBtn
            theme="primary"
            category="outline"
            size="lg"
            class="flex-1 h-12"
            @click="goPrev"
          >
            上一步
          </BaseBtn>
          <BaseBtn
            theme="primary"
            size="lg"
            class="flex-1 h-12"
            :loading="isAddSubordinateSubmitting"
            @click="handleSubmitAddSubordinate"
          >
            完成
          </BaseBtn>
        </div>
      </template>
    </template>
  </div>
</template>
