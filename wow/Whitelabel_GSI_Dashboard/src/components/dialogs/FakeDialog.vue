<template>
  <Teleport to="body">
    <transition name="scale-dialog" appear>
      <div v-if="model" v-bind="attrs" class="dialogWrapper">
        <q-card
          :style="`
        width: ${attrs['width'] ? attrs['width'] : '100%'};
        max-width: ${attrs['max-width'] ? attrs['max-width'] : '50rem'}
      `"
        >
          <!-- 關閉按鈕 -->
          <q-card-section v-if="props.configs.showDialogCloseBtn" class="row justify-end q-pb-none">
            <q-icon size="md" name="close" color="grey" @click="onCancel" class="cursor-pointer" />
          </q-card-section>

          <!-- 標頭 -->
          <q-card-section v-if="!!slots['label']">
            <slot name="label" />
          </q-card-section>

          <q-card-section v-else-if="configs.dialogLabelI18nKey" class="row justify-between">
            <div class="text-h6">{{ $t(configs.dialogLabelI18nKey) }}</div>
            <q-icon
              v-if="props.configs.showLabelCloseBtn"
              size="md"
              name="close"
              color="grey"
              @click="onCancel"
              class="cursor-pointer"
            />
          </q-card-section>

          <q-separator v-if="props.configs.type !== DialogType.CONFIRM" />

          <!-- 內文 -->
          <template v-if="props.configs.type !== DialogType.CONFIRM">
            <q-card-section class="scroll dialogMainWrapper">
              <q-form ref="dialogFormRef">
                <slot name="mainContent" />
              </q-form>
            </q-card-section>

            <q-separator />
          </template>

          <q-card-section v-if="!!slots['customerContent']" class="scroll dialogMainWrapper">
            <q-form ref="dialogFormRef">
              <slot name="customerContent" />
            </q-form>
          </q-card-section>

          <!-- 按鈕組 -->
          <q-card-actions v-if="configs.useActions || props.configs.type === DialogType.CONFIRM" align="right">
            <q-btn outline :label="$t('btn.cancel')" color="primary" @click="onCancel" />
            <q-btn :label="$t('btn.check')" color="primary" :loading="loading" :disable="disable" @click="onSubmit" />
          </q-card-actions>
        </q-card>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { defineModel, defineProps, defineEmits, PropType, useAttrs, useSlots, ref, onMounted, watch } from "vue"
  import { useDialogPluginComponent } from "quasar"

  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { onDialogHide, onDialogOK } = useDialogPluginComponent()

  const model = defineModel<boolean>()
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
    model.value = false
    console.log("close")
  }

  watch(
    () => model.value,
    (newVal) => {
      if (!newVal) {
        onDialogHide()
      }
    }
  )
  onMounted(() => {})
</script>

<style lang="scss" scoped>
  @import "@/css/dialog.scss";

  .dialogWrapper {
    @apply fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 z-[6000];
  }

  /* Vue 內建 transition hooks */
  .scale-dialog-enter-active,
  .scale-dialog-leave-active {
    transition: all 0.3s ease-out;
    background-color: transparent;
  }

  .scale-dialog-enter-from,
  .scale-dialog-leave-to {
    opacity: 0;
    transform: scale(0.3);
    background-color: transparent;
  }
</style>
