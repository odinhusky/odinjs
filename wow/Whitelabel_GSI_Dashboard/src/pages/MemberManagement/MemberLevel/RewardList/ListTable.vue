<template>
  <q-table square hide-pagination :rows-per-page-options="[0]" :rows="tableData" :columns="tableColumn" row-key="id">
    <template #body="props">
      <q-tr>
        <!-- 結算週期 -->
        <q-td key="settle_cycle" :props="props">
          {{ genTimeFormat(props.row.start_date, "yyyy-MM-dd HH:mm") }}~{{
            genTimeFormat(props.row.end_date, "yyyy-MM-dd HH:mm")
          }}
        </q-td>

        <!-- 層級名稱 -->
        <q-td key="level_lang" :props="props">
          <q-btn flat color="blue-6" :ripple="false">
            {{ getDynamicLangValue(props.row.level_lang) }}
          </q-btn>
        </q-td>

        <!-- 晉級禮金人數 -->
        <q-td key="promotion_bonus_count" :props="props">
          {{ moneyFormat(props.row.promotion_bonus_count) }}
        </q-td>

        <!-- 生日禮金人數 -->
        <q-td key="birthday_bonus_count" :props="props">
          {{ moneyFormat(props.row.birthday_bonus_count) }}
        </q-td>

        <!-- 阻擋派發人數 -->
        <q-td key="block_label_count" :props="props">
          {{ moneyFormat(props.row.block_label_count) }}
        </q-td>

        <!-- 派發方式 -->
        <q-td key="auto_payout" :props="props" class="text-blue">
          {{ props.row.auto_payout ? $t("reward_type.auto") : $t("reward_type.manual") }}
        </q-td>

        <!-- 明細 -->
        <q-td key="actions" :props="props">
          <q-btn flat fab-mini icon="info" color="blue-6" @click="onAction(props.row)">
            <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.detail") }}</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <!-- 查無資料 -->
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
    </template>
  </q-table>

  <!-- 檢視會員帳號 -->
  <dialog-comp v-model="showLevelDialog" :configs="dialogConfigs.showLevel" max-width="97.5rem">
    <template v-if="dialogData.showLevel.id" #mainContent>
      <member-level-settings :id="dialogData.showLevel.id" :read-only="true" />
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { PropType, reactive, computed, defineProps, defineEmits } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useDialog } from "@/hook/useDialog"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"
  import { REWARD_TYPE } from "@/utils/constants"
  import MemberLevelSettings from "@/components/memberLevelSettings/Index.vue"

  import type { MemberLevelRewardListItem } from "@/api/response.type"
  import { useLanguageStore } from "src/stores/languageStore"
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat } = useCommon()

  const props = defineProps({
    tableData: {
      type: Object as PropType<MemberLevelRewardListItem[]>,
      required: false,
      default: () => []
    }
  })

  const emit = defineEmits(["changeId"])

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "settle_cycle",
      label: t("table_header.settle_cycle"),
      field: "settle_cycle",
      sortable: false,
      align: "center"
    },
    {
      name: "level_lang",
      label: t("table_header.level_name"),
      field: "level_lang",
      sortable: false,
      align: "center"
    },
    {
      name: "promotion_bonus_count",
      label: t("table_header.level_up_count"),
      field: "promotion_bonus_count",
      sortable: false,
      align: "center"
    },
    {
      name: "birthday_bonus_count",
      label: t("table_header.birthday_count"),
      field: "birthday_bonus_count",
      sortable: false,
      align: "center"
    },
    {
      name: "block_label_count",
      label: t("table_header.block_reward_count"),
      field: "block_label_count",
      sortable: false,
      align: "center"
    },
    {
      name: "auto_payout",
      label: t("table_header.reward_type"),
      field: "auto_payout",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])
  const languageStore = useLanguageStore()

  function getDynamicLangValue(data: any) {
    if (data === null || data === "") {
      return ""
    }
    const currentLang = languageStore.currentLanguage

    const langValue = data[currentLang.toLowerCase()]

    return langValue || ""
  }

  const onAction = (row: MemberLevelRewardListItem) => {
    emit("changeId", row.id)
  }

  const dialogConfigs = reactive<{ showLevel: IDialogConfig }>({
    showLevel: {
      dialogLabelI18nKey: "common.show_member_account",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleCloseShowLevel
    }
  })
  const dialogData = reactive({
    showLevel: {
      id: 0
    }
  })
  const { dialog: showLevelDialog, openDialog: openShowLevelDialog, closeDialog: closeShowLevelLoading } = useDialog()
  // 改為後續優化項目
  const onShowLevel = (item: MemberLevelRewardListItem) => {
    dialogData.showLevel.id = item.id
    openShowLevelDialog(item)
  }

  function handleCloseShowLevel() {
    closeShowLevelLoading()
  }
</script>
