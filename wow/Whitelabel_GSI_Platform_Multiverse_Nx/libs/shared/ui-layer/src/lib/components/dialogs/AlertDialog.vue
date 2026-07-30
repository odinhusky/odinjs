<script setup lang="ts">
const { state, closeAlertDialog, setSelectedValue, confirmAlertDialog } = useAlertDialog()

const isOptionMode = computed(() => state.value.options.length > 0)

const onOptionToggle = (value: string, checked: boolean) => {
  if (!checked) return
  setSelectedValue(value)
}
</script>

<template>
  <BaseDialog
    :visible="state.visible"
    :class-obj="{
      root: cx('max-w-[550px]'),
      header: cx('py-3 bg-[var(--dialog-dialog-bg-header)]'),
      title: cx('text-[28px] phone:text-xl'),
      body: cx('p-6 px-5'),
      closeBtn: cx('top-4 right-4')
    }"
    @close="closeAlertDialog"
  >
    <template #header>
      <h3 class="text-xl text-[var(--dialog-dialog-title-header)] font-bold leading-7">{{ state.title }}</h3>
    </template>

    <div :class="cx(FLEX_COL, 'gap-4 text-center')">
      <p :class="cx('text-start text-base leading-6 text-[var(--text-text-primary)] font-semibold')">
        {{ state.message }}
      </p>

      <div
        v-if="state.options.length"
        :class="cx('rounded-xl bg-[var(--surface-surface-contrainer)] p-3', FLEX_COL, 'gap-4')"
      >
        <BasePlainBtn
          v-for="option in state.options"
          :key="option.value"
          :class="
            cx(
              FLEX_ITEMS_CENTER,
              'w-full rounded-xl p-4 transition',
              state.selectedValue === option.value
                ? 'bg-[var(--list-list-bg-active)]'
                : 'bg-[var(--list-list-bg-enabled)]'
            )
          "
          @click="setSelectedValue(option.value)"
        >
          <div :class="cx(FLEX_ITEMS_CENTER, 'mr-auto')">
            <BaseCheckBox
              :model-value="state.selectedValue === option.value"
              @update:model-value="(checked) => onOptionToggle(option.value, Boolean(checked))"
            />

            <span class="ml-4 text-sm leading-5 text-[var(--text-text-primary)]">{{ option.label }}</span>
          </div>

          <span class="w-[100px] text-[10px] text-[var(--text-text-title)] mr-auto">{{
            option.metaLabel || "Cash"
          }}</span>

          <span class="w-[100px] text-sm font-bold text-[var(--text-text-primary)] leading-none text-right">{{
            option.amount || ""
          }}</span>
        </BasePlainBtn>
      </div>
    </div>

    <template #footer>
      <div v-if="isOptionMode" class="grid grid-cols-2 gap-2">
        <BaseBtn class="w-full" size="xl" theme="primary" category="outline" @click="closeAlertDialog">
          {{ state.cancelText }}
        </BaseBtn>
        <BaseBtn class="w-full" size="xl" @click="confirmAlertDialog">
          {{ state.confirmText }}
        </BaseBtn>
      </div>
      <BaseBtn v-else class="w-full" size="xl" @click="confirmAlertDialog">
        {{ state.confirmText }}
      </BaseBtn>
    </template>
  </BaseDialog>
</template>
