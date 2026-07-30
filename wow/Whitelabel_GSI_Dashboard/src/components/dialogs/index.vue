<template>
  <q-dialog v-bind="attrs" ref="dialogRef" class="dialogWrapper" @hide="onDialogHide">
    <q-card
      :style="`
        width: ${attrs['width'] ? attrs['width'] : '100%'};
        max-width: ${attrs['max-width'] ? attrs['max-width'] : '600px'}
      `"
    >
      <!-- 關閉按鈕 -->
      <q-card-section v-if="props.configs.showDialogCloseBtn" class="row justify-end q-pb-none">
        <q-icon size="md" name="close" color="grey" @click="onCancel" class="cursor-pointer" />
      </q-card-section>

      <!-- 標頭 -->
      <div v-if="!!slots['label']" class="row justify-between">
        <slot name="label" />
        <q-icon
          size="sm"
          name="close"
          color="grey"
          @click="onCancel"
          class="cursor-pointer"
          style="padding-right: 1rem; padding-top: 1rem"
        />
      </div>

      <q-card-section v-else-if="configs.dialogLabelI18nKey" class="redirect-method row">
        <div class="bold h4-bold grey w-[calc(100%_-_2.25rem)] mr-auto">{{ $t(configs.dialogLabelI18nKey) }}</div>

        <q-icon
          v-if="props.configs.showLabelCloseBtn"
          size="sm"
          name="close"
          color="grey"
          @click="onCancel"
          class="cursor-pointer"
        />
      </q-card-section>

      <!-- <q-separator v-if="props.configs.type !== DialogType.CONFIRM" /> -->

      <!-- 內文 -->
      <template v-if="props.configs.type !== DialogType.CONFIRM">
        <q-card-section class="scroll dialogMainWrapper" :class="hideScrolly ? 'hide-scrollY' : ''">
          <q-form ref="dialogFormRef">
            <slot name="mainContent" />
          </q-form>
        </q-card-section>

        <!-- <q-separator /> -->
      </template>

      <q-card-section v-if="!!slots['customerContent']" class="scroll dialogMainWrapper">
        <q-form ref="dialogFormRef">
          <slot name="customerContent" />
        </q-form>
      </q-card-section>

      <!-- 按鈕組 -->
      <q-card-actions
        v-if="configs.useActions || props.configs.type === DialogType.CONFIRM"
        align="right"
        class="q-pb-md"
      >
        <q-btn
          v-close-popup
          outline
          :label="$t('btn.cancel')"
          color="primary"
          @click="onCancel"
          class="btns detail-btn"
        />
        <q-btn
          :label="$t('btn.check')"
          color="primary"
          :loading="loading"
          :disable="disable"
          @click="onSubmit"
          class="btns btn-blue"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits, PropType, useAttrs, useSlots, ref, onMounted } from "vue"
  import { useDialogPluginComponent } from "quasar"

  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const attrs = useAttrs()
  const slots = useSlots()
  const emits = defineEmits([...useDialogPluginComponent.emits])

  const props = defineProps({
    configs: {
      type: Object as PropType<IDialogConfig>,
      required: true,
      default: () => {}
    },
    loading: {
      type: [Boolean],
      required: false,
      default: () => false
    },
    showCloseBtn: {
      type: Boolean,
      required: false,
      default: false
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    hideScrolly: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const dialogFormRef = ref()

  async function onSubmit() {
    if (!props.configs.useActions) {
      onDialogOK()
      return
    }

    if (!!dialogFormRef.value) {
      const valid = await dialogFormRef.value.validate()
      if (!valid) {
        return
      }
    }

    if (props.configs.submitFunction) {
      await props.configs.submitFunction()
    }
  }

  function onCancel() {
    console.log("close")
    onDialogCancel()
  }

  onMounted(() => {})
</script>

<style lang="scss" scoped>
  @import "@/css/dialog.scss";

  .dialogMainWrapper {
    padding: 0.625rem 1.25rem;
  }

  .dialogFooterWrapper {
    padding: 20px;

    .q-btn {
      padding: 0.4688rem 1.5625rem;

      :deep(.q-btn__content) {
        font-family: NotoSansTC;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
        text-transform: capitalize;
      }
    }
  }
</style>
