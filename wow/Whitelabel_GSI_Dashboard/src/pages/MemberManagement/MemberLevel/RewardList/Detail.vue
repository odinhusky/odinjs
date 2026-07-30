<template>
  <SubPage :action-label-i18n-key="message" :custom-back-func="onBack" class="q-pt-xs" />
  <div class="q-pa-md" style="padding-top: 0px">
    <div class="row q-mb-md justify-start m-12-t" v-if="permission.edit">
      <q-btn class="btns btn-green" @click="onDistributeAll()">
        {{ $t("btn.distribute_all") }}
      </q-btn>
      <span class="q-pt-sm q-ml-md">{{ $t("common.distribute_detail") }}</span>
    </div>
    <div class="table-white-bg">
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="tableData"
        :columns="tableColumn"
        row-key="id"
        class="q-mt-md"
      >
        <template #body="props">
          <q-tr>
            <!-- 會員帳號 -->
            <q-td key="member_account" :props="props">
              {{ props.row.member_account }}
            </q-td>

            <!-- 層級名稱 -->
            <q-td key="level_lang" :props="props">
              {{ getDynamicLangValue(props.row.level_lang) }}
            </q-td>

            <!-- 禮金類型 -->
            <q-td key="bonus_type" :props="props">
              {{ $t(GIFT_TYPE.I18nKeys[props.row.bonus_type as GIFT_TYPE.Enums] || "common.unknow") }}
            </q-td>

            <!-- 阻擋派發標籤 -->
            <q-td key="block_label_count" :props="props">
              {{ moneyFormat(props.row.block_label_count) }}
            </q-td>

            <!-- 狀態 -->
            <q-td key="status" :props="props">
              <span :class="filterClass(props.row).classList">{{ $t(filterClass(props.row).i18nKey) }}</span>
            </q-td>

            <!-- 功能 -->
            <q-td key="actions" :props="props">
              <span @click="onMandatoryDistribution(props.row)" class="color_blue" style="cursor: pointer">{{
                $t("btn.force_send")
              }}</span>
            </q-td>
          </q-tr>
        </template>

        <!-- 查無資料 -->
        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm column no_data">
            <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
            <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
          </div>
        </template>
      </q-table>
    </div>
  </div>

  <!-- 全部強制發送彈窗 -->
  <dialog-comp v-model="forceSendAllDialog" :configs="dialogConfigs.forceSendAll" :loading="forceSendAllLoading">
    <template #mainContent>
      <div class="q-mb-lg">{{ $t("common.sure_to_force_all_send_reward") }}</div>
    </template>
  </dialog-comp>

  <!-- 強制發送彈窗 -->
  <dialog-comp v-model="forceSendDialog" :configs="dialogConfigs.forceSend" :loading="forceSendLoading">
    <template #mainContent>
      <div class="q-mb-lg">{{ $t("common.sure_to_force_send_reward") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { PropType, reactive, computed, onMounted, defineProps, defineEmits } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps } from "quasar"
  import type * as Response from "@/api/response.type"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useDialog } from "@/hook/useDialog"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"
  import { GIFT_TYPE, LANGUAGE_TYPE } from "@/utils/constants"
  import type { MemberLevelRewardDetailsItem } from "@/api/response.type"
  import { updateMemberRewardListDistributionAll, updateMemberRewardListDistribution } from "@/api/member"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useRoute } from "vue-router"
  import { getMemberLevelRewardDetails } from "@/api/member"

  import type { MemberRewardListDistribution } from "@/api/request.type"
  import { usePermission } from "@/hook/usePermission"
  import type { GetMemberAnnouncementList } from "@/api/request.type"
  import { useSearch } from "@/hook/useSearch"

  const $q = useQuasar()
  const { t } = useI18n()
  const { moneyFormat } = useCommon()
  const route = useRoute()

  const { permission } = usePermission()

  const message = computed(() => `${t("menu.send_rewards_list")} / ${t("common.detail")}`)

  const props = defineProps({
    id: {
      type: Number,
      required: true,
      default: () => 0
    }
  })
  const id = route.params.id as string
  let { search, tableData, totalSize, tableTotal } = useSearch(getMemberLevelRewardDetails)

  onMounted(async () => {
    const id = route.params.id as string
    search({ id: props.id })
  })

  interface IFilterStatus {
    classList: string
    i18nKey: string
  }
  function filterClass(item: MemberLevelRewardDetailsItem): IFilterStatus {
    switch (item.status) {
      case 2:
        return {
          classList: "text-blue",
          i18nKey: "common.send_success"
        }
      case 1:
        return {
          classList: "text-negative",
          i18nKey: "common.send_pending"
        }
      default:
        return {
          classList: "",
          i18nKey: "common.unknown"
        }
    }
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
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
        name: "bonus_type",
        label: t("table_header.gift_type"),
        field: "bonus_type",
        sortable: false,
        align: "center"
      },
      {
        name: "block_label_count",
        label: t("table_header.block_tags_num"),
        field: "block_label_count",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
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
    ]

    // 如果無編輯權限 就把 checkbox 和 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const emit = defineEmits(["changeId"])

  const onBack = () => {
    emit("changeId", 0)
  }
  const dialogConfigs = reactive<{ forceSend: IDialogConfig; forceSendAll: IDialogConfig }>({
    forceSend: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleForceSend
    },
    forceSendAll: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleForceSendAll
    }
  })
  const dialogData = reactive({
    forceSend: {
      id: 0
    },
    forceSendAll: {
      id: 0
    }
  })
  const {
    dialog: forceSendDialog,
    openDialog: openForceSendDialog,
    loading: forceSendLoading,
    openLoading: openForceSendLoading,
    closeLoading: closeForceSendLoading,
    closeDialog: closeForceSendDialog
  } = useDialog()

  function onMandatoryDistribution(item: { detail_id: number }) {
    dialogData.forceSend.id = item.detail_id
    openForceSendDialog()
  }

  async function handleForceSend() {
    openForceSendLoading()
    const { search: forceSendSearch, status } = useSearch(updateMemberRewardListDistribution)
    await forceSendSearch(dialogData.forceSend.id)

    if (status.value) {
      console.log("handleForceSend")
      // call api
      $q.notify({
        type: "positive",
        message: t("message.distribute_success"),
        position: "top",
        timeout: 300
      })
      closeForceSendLoading()
      closeForceSendDialog()
      search({ id: props.id })
    }
  }
  const {
    dialog: forceSendAllDialog,
    openDialog: openForceSendAllDialog,
    loading: forceSendAllLoading,
    openLoading: openForceSendAllLoading,
    closeLoading: closeForceSendAllLoading,
    closeDialog: closeForceSendAllDialog
  } = useDialog()

  function onDistributeAll() {
    openForceSendAllDialog()
  }

  async function handleForceSendAll() {
    openForceSendAllLoading()
    const res = await updateMemberRewardListDistributionAll(props.id)

    if (res.code === 0) {
      // call api
      $q.notify({
        type: "positive",
        message: t("message.distribute_success"),
        position: "top",
        timeout: 300
      })
      closeForceSendAllLoading()
      closeForceSendAllDialog()
      search({ id: props.id })
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  const languageStore = useLanguageStore()
  function getDynamicLangValue(data: Response.PromotionLangTitle): string {
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
  }
</script>
