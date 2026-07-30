<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-white-bg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <!-- 結算週期 -->
                <q-td key="settle_cycle" :props="props">
                  {{ genTimeFormat(props.row.start_time, "yyyy-MM-dd HH:mm") }}~{{
                    genTimeFormat(props.row.end_time, "yyyy-MM-dd HH:mm")
                  }}
                </q-td>

                <!-- 層級名稱 -->
                <q-td key="level_lang" :props="props">
                  <q-btn flat :ripple="false">
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
                <q-td key="auto_payout" :props="props">
                  {{ props.row.auto_payout ? $t("reward_type.auto") : $t("reward_type.manual") }}
                </q-td>

                <!-- 明細 -->
                <q-td class="cursor-pointer" key="actions" :props="props">
                  <q-btn flat fab-mini icon="visibility" class="edit_pen" @click="onAction(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.detail") }}</q-tooltip>
                  </q-btn>
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
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { reactive, computed, defineEmits } from "vue"
  import { useI18n } from "vue-i18n"
  import { getMemberLevelRewardList } from "@/api/member"
  import type { GetMemberAnnouncementList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRoute, useRouter } from "vue-router"
  import { useLanguageStore } from "src/stores/languageStore"
  import type { MemberLevelRewardListItem } from "@/api/response.type"
  import { LANGUAGE_TYPE } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { genTimeFormat, moneyFormat } = useCommon()
  const emit = defineEmits(["changeId"])

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    everyColumnsClass: "col-12 col-sm-6 col-md-6 col-lg-2",
    useDatePicker: true,
    customDateTimeLabelI18nKey: "common.reward_range"
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getMemberLevelRewardList)

  let catchQueryForm: GetMemberAnnouncementList
  async function onSubmit(queryForm: GetMemberAnnouncementList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

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

  function getDynamicLangValue(data: any): string {
    if (!data || typeof data !== "object") {
      console.error("Invalid data format:", data) // Log error
      return ""
    }

    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return "N/A" // Default value if no valid key found
  }

  const onAction = (row: MemberLevelRewardListItem) => {
    /*router.push({
      name: "MemberLevelRewardDetail",
      params: {
        id: row.id
      }
    })*/
    emit("changeId", row.id)
  }
</script>
