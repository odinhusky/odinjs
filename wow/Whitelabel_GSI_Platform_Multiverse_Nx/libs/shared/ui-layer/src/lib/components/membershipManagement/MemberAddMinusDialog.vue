<script setup lang="ts">
interface MemberAddMinusDialogClassObj {
  body?: string
}

interface Props {
  visible: boolean
  type: 1 | 2
  amount: string
  dialogIncreaseItem: number
  memberAccount: string
  memberBalance: string
  memberRemainQuotaAmount: string
  remainQuotaAmount: string | number
  isCredit: boolean
  isMemberAgent: boolean
  isSubmitting: boolean
  classObj?: MemberAddMinusDialogClassObj
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const emit = defineEmits<{
  "update:visible": [boolean]
  "update:amount": [string]
  "update:dialogIncreaseItem": [number]
  submit: []
}>()

const isItemSelectOpen = ref(false)
const hasTouchedItemSelect = ref(false)

const increaseItemOptions = computed(() => [
  { label: "點數", value: 0 },
  ...(props.isCredit && props.isMemberAgent ? [{ label: "代理額度", value: 1 }] : [])
])

const dialogTitle = computed(() => (props.type === 1 ? "代理加款" : "代理扣款"))
const dialogIcon = computed(() => (props.type === 1 ? "mdi:cash-plus" : "mdi:cash-minus"))
const itemLabel = computed(() => (props.type === 1 ? "加款項目" : "扣款項目"))
const amountLabel = computed(() => (props.type === 1 ? "加款金額" : "扣款金額"))
const quotaCardLabel = computed(() => (props.type === 1 ? "代理加款額度" : "代理扣款額度"))
const quotaCardValue = computed(() =>
  props.dialogIncreaseItem === 1 ? props.memberRemainQuotaAmount : props.remainQuotaAmount
)
const selectedItemLabel = computed(() => {
  if (!hasTouchedItemSelect.value) return "請選擇"
  return increaseItemOptions.value.find((option) => option.value === props.dialogIncreaseItem)?.label ?? "請選擇"
})
const canOpenItemSelect = computed(() => increaseItemOptions.value.length > 1 && !props.isSubmitting)

watch(
  () => props.visible,
  (visible) => {
    isItemSelectOpen.value = false
    if (visible) hasTouchedItemSelect.value = false
  }
)

watch(
  () => props.dialogIncreaseItem,
  () => {
    isItemSelectOpen.value = false
  }
)

const handleClose = () => {
  if (props.isSubmitting) return
  isItemSelectOpen.value = false
  emit("update:visible", false)
}

const handleToggleItemSelect = () => {
  if (!canOpenItemSelect.value) return
  isItemSelectOpen.value = !isItemSelectOpen.value
}

const handleSelectItem = (value: number) => {
  hasTouchedItemSelect.value = true
  emit("update:dialogIncreaseItem", value)
  isItemSelectOpen.value = false
}

const handleAmountInput = (event: Event) => {
  emit("update:amount", (event.target as HTMLInputElement).value)
}

const copyMemberAccount = async () => {
  if (!props.memberAccount || !globalThis.navigator?.clipboard) return
  await globalThis.navigator.clipboard.writeText(props.memberAccount).catch(() => undefined)
}

const cardBaseClass = cx(
  "min-w-0 h-20 rounded-xl border px-4 py-3",
  "flex flex-col justify-start gap-2 shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
)
const cardLabelClass = "truncate text-sm leading-5 text-[var(--card-card-subtitle-primary-enabled,#a3a3a3)]"
const cardValueClass = "truncate text-2xl font-bold leading-7 text-[var(--text-text-primary,#fff)]"
const fieldLabelClass = "text-sm leading-5 font-bold text-[var(--input-input-title-primary,#fff)]"
const fieldControlClass = cx(
  "h-10 w-full rounded-lg border-2 border-white/20",
  "bg-[var(--select-select-bg-primary-enabled,#0f073d)]",
  "shadow-[0_2px_2px_rgba(0,0,0,0.5)]",
  "text-base leading-6 text-[var(--text-text-primary,#fff)] outline-none"
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.visible"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @click="isItemSelectOpen = false"
    >
      <section
        :class="cx('member-add-minus-dialog overflow-hidden rounded-xl bg-[var(--dialog-dialog-bg-content)] bg-right-bottom bg-no-repeat text-white shadow-2xl', props.classObj.body)"
        role="dialog"
        aria-modal="true"
        :aria-label="dialogTitle"
        @click.stop="isItemSelectOpen = false"
      >
        <header
          class="relative flex h-[60px] items-center justify-center bg-[var(--dialog-dialog-bg-header,#301d8a)] px-5 py-4 shadow-[0_4px_2px_rgba(26,26,26,0.2)]"
        >
          <BaseIcon
            :name="dialogIcon"
            size="20px"
            class-name="absolute left-5 top-5 text-[var(--dialog-dialog-title-header,#fff)]"
          />
          <h2 class="w-full px-6 text-center text-xl font-bold leading-7 text-[var(--dialog-dialog-title-content,#fff)]">
            {{ dialogTitle }}
          </h2>
          <button
            type="button"
            class="absolute right-5 top-5 flex size-5 items-center justify-center text-[var(--dialog-dialog-title-header,#fff)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="props.isSubmitting"
            aria-label="close"
            @click="handleClose"
          >
            <BaseIcon
              name="mdi:close"
              size="20px"
            />
          </button>
        </header>

        <div class="flex h-[288px] flex-col gap-4 px-5 py-6 phone:h-[380px]">
          <div class="grid w-full grid-cols-3 gap-3 phone:grid-cols-2">
            <div
              :class="
                cx(
                  cardBaseClass,
                  'border-[#573edc] bg-[rgba(109,92,231,0.3)] phone:col-span-2'
                )
              "
            >
              <div :class="cardLabelClass">
                會員帳號
              </div>
              <div class="relative min-w-0">
                <span :class="cx(cardValueClass, props.memberAccount && 'block pr-7')">
                  {{ props.memberAccount || '-' }}
                </span>
                <button
                  v-if="props.memberAccount"
                  type="button"
                  class="absolute right-0 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white"
                  aria-label="copy account"
                  @click.stop="copyMemberAccount"
                >
                  <BaseIcon
                    name="mdi:content-copy"
                    size="20px"
                  />
                </button>
              </div>
            </div>

            <div :class="cx(cardBaseClass, 'border-[#9d174d] bg-[rgba(244,114,182,0.3)]')">
              <div :class="cardLabelClass">
                會員餘額
              </div>
              <div :class="cardValueClass">
                {{ props.memberBalance || '0' }}
              </div>
            </div>

            <div :class="cx(cardBaseClass, 'border-[#14532d] bg-[rgba(22,101,52,0.3)]')">
              <div :class="cardLabelClass">
                {{ quotaCardLabel }}
              </div>
              <div :class="cardValueClass">
                {{ quotaCardValue || '0' }}
              </div>
            </div>
          </div>

          <div
            class="relative flex flex-col gap-1"
            @click.stop
          >
            <label :class="fieldLabelClass">
              {{ itemLabel }}
            </label>
            <button
              type="button"
              :class="
                cx(
                  fieldControlClass,
                  'flex items-center justify-between px-4 text-left',
                  !canOpenItemSelect && 'cursor-default'
                )
              "
              :aria-expanded="isItemSelectOpen"
              @click="handleToggleItemSelect"
            >
              <span class="truncate text-white/50">
                {{ selectedItemLabel }}
              </span>
              <BaseIcon
                name="mdi:chevron-down"
                size="20px"
                :class-name="cx('shrink-0 text-white/80 transition-transform', isItemSelectOpen && 'rotate-180')"
              />
            </button>

            <div
              v-if="isItemSelectOpen"
              class="absolute left-0 top-[70px] z-20 w-full overflow-hidden rounded-lg border-2 border-white/20 bg-[#171717] shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            >
              <button
                v-for="option in increaseItemOptions"
                :key="option.value"
                type="button"
                :class="
                  cx(
                    'flex h-[35px] w-full items-center px-3 text-left text-sm leading-[19px] text-white transition-colors',
                    option.value === props.dialogIncreaseItem
                      ? 'bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] font-bold'
                      : 'hover:bg-white/10'
                  )
                "
                @click="handleSelectItem(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label :class="fieldLabelClass">
              {{ amountLabel }}
            </label>
            <div class="relative">
              <BaseIcon
                name="mdi:cash"
                size="20px"
                class-name="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-white/60"
              />
              <input
                :class="cx(fieldControlClass, 'px-4 pl-11 placeholder:text-white/50')"
                :value="props.amount"
                placeholder="請輸入 ..."
                inputmode="decimal"
                :disabled="props.isSubmitting"
                @input="handleAmountInput"
              >
            </div>
          </div>
        </div>

        <footer class="flex h-20 items-center gap-4 bg-[var(--dialog-dialog-bg-header,#301d8a)] px-5 py-4">
          <button
            type="button"
            class="flex h-12 flex-1 items-center justify-center rounded-lg border border-[var(--button-button-bg-primary-left-enabled)] bg-transparent px-4 text-base font-bold leading-6 text-[var(--button-button-bg-primary-left-enabled)] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="props.isSubmitting"
            @click="handleClose"
          >
            取消
          </button>
          <button
            type="button"
            class="flex h-12 flex-1 items-center justify-center rounded-lg bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] px-4 text-base font-bold leading-6 text-[var(--button-button-title-primary-enabled,#fff)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="props.isSubmitting"
            @click="emit('submit')"
          >
            <BaseIcon
              v-if="props.isSubmitting"
              name="mdi:loading"
              size="18px"
              class-name="mr-2 animate-spin"
            />
            確定
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.member-add-minus-dialog {
  width: 550px;
  height: 428px;
  max-width: calc(100vw - 32px);
}

@media (max-width: 767px) {
  .member-add-minus-dialog {
    width: 343px;
    height: 520px;
  }
}
</style>
