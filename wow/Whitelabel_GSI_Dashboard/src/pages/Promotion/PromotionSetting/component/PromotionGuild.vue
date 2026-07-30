<template>
  <!-- 彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail" max-width="37.5rem">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">
            {{ $t("promotion.promotion_guide") }}
          </div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-2" style="display: flex; align-items: center">
          {{ $t("query_params.event_type") }}
        </div>
        <div class="col-6">
          <q-select
            v-model="type"
            :options="eventTypeDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            square
          />
        </div>
        <!--<div class="col-12" v-html="t('promotion.promotion_guide_' + type)"></div>-->
        <div class="col-12">
          <component
            :is="
              {
                DepositBonus,
                RegisterBonus,
                BetBonus,
                CustomizeBonus
              }[getComponentName(type)]
            "
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, watch, ref, defineProps } from "vue"
  import { useI18n } from "vue-i18n"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"
  import { useDialog } from "@/hook/useDialog"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { EVENT_TYPE } from "@/utils/constants"

  import DepositBonus from "../component/guild/DepositBonus.vue"
  import RegisterBonus from "../component/guild/RegisterBonus.vue"
  import BetBonus from "../component/guild/BetBonus.vue"
  import CustomizeBonus from "../component/guild/CustomizeBonus.vue"

  const { t } = useI18n()
  const type = ref(EVENT_TYPE.Enums.DepositBonus)

  function getComponentName(type: number) {
    switch (type) {
      case EVENT_TYPE.Enums.DepositBonus:
        return "DepositBonus"
      case EVENT_TYPE.Enums.RegisterBonus:
        return "RegisterBonus"
      case EVENT_TYPE.Enums.BetBonus:
        return "BetBonus"
      case EVENT_TYPE.Enums.CustomizeBonus:
        return "CustomizeBonus"
      default:
        return "DepositBonus"
    }
  }
  // 活動類型
  const eventTypeDropdownList = computed(() =>
    genEnumToDropdown(EVENT_TYPE.Enums, EVENT_TYPE.I18nKeys).map((e) => {
      e.label = t(e.label)
      return e
    })
  )

  const props = defineProps({
    openDialog: {
      type: [Boolean],
      required: false,
      default: () => false
    }
  })
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    detail: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD
      // useActions: true
      //submitFunction: handleOpenDetail
    }
  })
  const {
    dialog: detailDialog,
    openDialog: openDetailDialog
    /* loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading*/
  } = useDialog()

  watch(
    () => props.openDialog,
    () => {
      openDetailDialog()
    }
  )
</script>

<style lang="scss" scoped>
  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
  }
</style>
