<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg">
      <div class="msk" v-if="!permission.edit"></div>
      <q-form>
        <q-card-section class="q-pa-none q-pb-lg">
          <div class="q-mt-xs q-col-gutter-md items-center">
            <div class="text-subtitle2">{{ $t("ads_marketing_service.marketing_plan") }}</div>
            <div class="row" style="justify-content: space-between">
              <div class="col-8 q-mr-md">
                <q-btn
                  outline
                  color="main-color"
                  class="b-radius-30 q-mr-md"
                  :class="{ 'btn-act': item.value === form.marketing_budget }"
                  v-for="item in budgetList"
                  :key="item.value"
                  @click="setBudget(item.value)"
                >
                  {{ item.label }}
                </q-btn>
              </div>
              <div class="col-3 row justify-end">
                <q-btn color="success" @click="onSubmit" :loading="spinShow" style="width: 12rem">{{
                  $t("btn.save")
                }}</q-btn>
              </div>
            </div>

            <div class="q-mt-xs">
              <div class="text-caption">{{ $t("ads_marketing_service.marketing_plan") }}</div>
              <q-card class="q-mt-lg">
                <q-card-section class="q-col-gutter-md">
                  <div class="text-subtitle1 text-primary">
                    {{ $t("ads_marketing_service.marketing_budget") }}{{ amount * form.marketing_budget }} USD
                  </div>
                  <div class="q-mt-sm">
                    <div>
                      {{ $t("ads_marketing_service.account_quantity") }}:{{
                        $t("ads_marketing_service.more_than_items", { limit: 10 * form.marketing_budget })
                      }}
                    </div>
                    <div>
                      {{ $t("ads_marketing_service.video_quantity") }}:{{
                        $t("ads_marketing_service.more_than_units", { limit: 20 * form.marketing_budget })
                      }}
                    </div>
                    <div>
                      {{ $t("ads_marketing_service.video_traffic") }}:{{
                        $t("ads_marketing_service.more_than_100000", { limit: 50 * form.marketing_budget })
                      }}
                    </div>
                  </div>
                  <div class="q-mt-sm text-caption text-grey-7">
                    {{ $t("ads_marketing_service.service_content") }}：<br />
                    {{ $t("ads_marketing_service.matrix_exposure_note") }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="q-mt-xs">
              <div class="text-caption">{{ $t("ads_marketing_service.exposure_region") }}</div>
              <div class="text-tip q-mt-sm">{{ $t("ads_marketing_service.select_exposure_region") }}</div>
              <div class="text-caption q-mt-sm">{{ $t("ads_marketing_service.asia_region") }}</div>
              <!--<q-btn
                outline
                color="main-color"
                class="b-radius-30 q-mr-md q-mt-md"
                :class="{ 'btn-act': item.value === form.country }"
                v-for="item in asiaList"
                :key="item.value"
                @click="setnCountry(item.value)"
              >
                {{ item.label }}
              </q-btn>-->
              <q-checkbox
                v-for="item in asiaList"
                :key="item.value"
                v-model="form.country"
                :label="item.label"
                :val="item.value"
                class="q-mr-md button-style"
              >
              </q-checkbox>
              <q-separator class="q-mt-lg" />
              <div class="text-caption q-mt-md">{{ $t("ads_marketing_service.europe_region") }}</div>
              <!-- <q-btn
                outline
                color="main-color"
                class="b-radius-30 q-mr-md q-mt-md"
                :class="{ 'btn-act': item.value === form.country }"
                v-for="item in europeList"
                :key="item.value"
                @click="setnCountry(item.value)"
              >
                {{ item.label }}
              </q-btn>-->
              <q-checkbox
                v-for="item in europeList"
                :key="item.value"
                v-model="form.country"
                :label="item.label"
                :val="item.value"
                class="q-mr-md button-style"
              >
              </q-checkbox>
              <q-separator class="q-mt-lg" />
            </div>
            <div class="q-mt-xs">
              <div class="text-subtitle2">{{ $t("ads_marketing_service.video_data") }}</div>
              <div class="row q-col-gutter-md q-mt-xs">
                <!-- 影片數量 -->
                <div class="col-4">
                  <div
                    class="q-pa-md bg-purple-1 rounded-borders"
                    style="min-height: 120px; display: flex; flex-direction: column"
                  >
                    <div class="row items-center">
                      <img src="~assets/images/common/video.webp" width="30" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-lg">{{ $t("ads_marketing_service.video_quantity") }}</div>
                    <div class="text-purple-10 text-video-data">98</div>
                  </div>
                </div>

                <!-- 總按讚數 -->
                <div class="col-4">
                  <div
                    class="q-pa-md bg-green-1 rounded-borders"
                    style="min-height: 120px; display: flex; flex-direction: column"
                  >
                    <div class="row items-center">
                      <img src="~assets/images/common/like.webp" width="30" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-lg">{{ $t("ads_marketing_service.total_likes") }}</div>
                    <div class="text-green-10 text-video-data">86,572,123</div>
                  </div>
                </div>

                <!-- 總流量 -->
                <div class="col-4">
                  <div
                    class="q-pa-md bg-orange-1 rounded-borders"
                    style="min-height: 120px; display: flex; flex-direction: column"
                  >
                    <div class="row items-center">
                      <img src="~assets/images/common/flow.webp" width="30" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-lg">{{ $t("ads_marketing_service.total_traffic") }}</div>
                    <div class="text-orange-10 text-video-data">6,572,123</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="q-mt-xs">
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
                    <!-- 序號 -->
                    <q-td key="serial_number" :props="props">
                      {{ props.row.serial_number }}
                    </q-td>

                    <!-- 影片名稱 -->
                    <q-td key="video_title" :props="props">
                      {{ props.row.video_title }}
                    </q-td>

                    <!-- like_count -->
                    <q-td key="like_count" :props="props">
                      {{ moneyFormat(props.row.like_count) }}
                    </q-td>

                    <!-- 生日禮金人數 -->
                    <q-td key="birthday_bonus_count" :props="props">
                      {{ moneyFormat(props.row.birthday_bonus_count) }}
                    </q-td>

                    <!-- view_count -->
                    <q-td key="view_count" :props="props">
                      {{ moneyFormat(props.row.view_count) }}
                    </q-td>

                    <!-- 時間 -->
                    <q-td key="upload_time" :props="props">
                      {{ props.row.upload_time }}
                    </q-td>

                    <!-- 連結 -->
                    <q-td class="cursor-pointer" key="link" :props="props">
                      <span class="text-blue" @click="onAction(props.row.link)">{{
                        $t("ads_marketing_service.link")
                      }}</span>
                    </q-td>
                  </q-tr>
                </template>
                <!-- 查無資料 -->
                <template #no-data>
                  <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
                </template>
              </q-table>
            </div>
            <!--end-->
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, watch } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar, CustomColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { CustomQTableProps } from "quasar"
  import { getProductGameType } from "@/api/product"
  import { CURRENCY_TYPE, GAME_TYPE, CALCULATE_TYPE, SETTLEMENT_CYCLE, SEND_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSiteStore } from "@/stores/siteStore"
  import type { adMarketing } from "@/api/request.type"
  import { usePermission } from "@/hook/usePermission"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"

  const { permission } = usePermission()

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const $q = useQuasar()
  const spinShow = ref(false)
  const { moneyFormat } = useCommon()

  export type DropdownType = {
    label: string
    value: string | number
  }

  const amount = ref(1000)
  const budgetList = ref<DropdownType[]>([
    { label: "1000 USD", value: 1 },
    { label: "2000 USD", value: 2 },
    { label: "3000 USD", value: 3 },
    { label: "4000 USD", value: 4 },
    { label: "5000 USD", value: 5 }
  ])

  const asiaList = ref<DropdownType[]>([
    { label: t("ads_marketing_service.taiwan"), value: 1 },
    { label: t("ads_marketing_service.vietnam"), value: 2 },
    { label: t("ads_marketing_service.bangladesh"), value: 3 },
    { label: t("ads_marketing_service.indonesia"), value: 4 },
    { label: t("ads_marketing_service.philippines"), value: 5 },
    { label: t("ads_marketing_service.turkey"), value: 6 },
    { label: t("ads_marketing_service.malaysia"), value: 7 },
    { label: t("ads_marketing_service.cambodia"), value: 8 },
    { label: t("ads_marketing_service.thailand"), value: 9 },
    { label: t("ads_marketing_service.korea"), value: 10 },
    { label: t("ads_marketing_service.singapore"), value: 11 }
  ])
  const europeList = ref<DropdownType[]>([
    { label: t("ads_marketing_service.germany"), value: 12 },
    { label: t("ads_marketing_service.spain"), value: 13 },
    { label: t("ads_marketing_service.mexico"), value: 14 },
    { label: t("ads_marketing_service.uk"), value: 15 },
    { label: t("ads_marketing_service.russia"), value: 16 },
    { label: t("ads_marketing_service.canada"), value: 17 },
    { label: t("ads_marketing_service.france"), value: 18 },
    { label: t("ads_marketing_service.usa"), value: 19 },
    { label: t("ads_marketing_service.iceland"), value: 20 },
    { label: t("ads_marketing_service.italy"), value: 21 },
    { label: t("ads_marketing_service.brazil"), value: 22 }
  ])

  const tableData = [
    {
      serial_number: 1,
      video_title: "title1",
      like_count: 1000,
      view_count: 1500,
      upload_time: "2025-05-13",
      link: ""
    },
    {
      serial_number: 2,
      video_title: "title3",
      like_count: 2000,
      view_count: 2500,
      upload_time: "2025-05-14",
      link: ""
    },
    {
      serial_number: 3,
      video_title: "title3",
      like_count: 3000,
      view_count: 3500,
      upload_time: "2025-05-15",
      link: ""
    },
    { serial_number: 4, video_title: "title4", like_count: 4200, view_count: 2500, upload_time: "2025-05-16", link: "" }
  ]

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "serial_number",
      label: t("ads_marketing_service.serial_number"),
      field: "serial_number",
      sortable: false,
      align: "center"
    },
    {
      name: "video_title",
      label: t("ads_marketing_service.video_title"),
      field: "video_title",
      sortable: false,
      align: "center"
    },
    {
      name: "like_count",
      label: t("ads_marketing_service.like_count"),
      field: "like_count",
      sortable: false,
      align: "center"
    },
    {
      name: "view_count",
      label: t("ads_marketing_service.view_count"),
      field: "view_count",
      sortable: false,
      align: "center"
    },
    {
      name: "upload_time",
      label: t("ads_marketing_service.upload_time"),
      field: "upload_time",
      sortable: false,
      align: "center"
    },
    {
      name: "link",
      label: t("ads_marketing_service.link"),
      field: "link",
      sortable: false,
      align: "center"
    }
  ])
  const form = reactive<adMarketing>({
    marketing_budget: 1,
    country: []
  })
  const handelCountryTags = (value: string[] | number[]) => {
    form.country = value
  }
  const setBudget = (value: any) => {
    form.marketing_budget = value
  }
  const setnCountry = (value: any) => {
    form.country = value
  }
  const onAction = (row: any) => {}
</script>

<style scoped>
  .text-subtitle1 {
    font-weight: bold;
    font-size: 1.5rem;
  }

  .text-subtitle2 {
    font-weight: bold;
    font-size: 1rem;
  }

  .text-caption {
    font-size: 0.875rem;
  }
  .text-tip {
    font-size: 0.75rem;
    color: red;
  }

  .text-video-data {
    font-size: 1.25rem;
  }
  .b-radius-30 {
    border-radius: 30px;
  }

  .btn-act {
    background: #6e39cb !important;
    color: white !important;
  }
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      color: #6e39cb;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 0.0625rem solid #6e39cb;
      padding: 0.5rem 32px;
      border-radius: 62.4375rem;
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        background: #6e39cb !important;
        color: white !important;
        border-width: 0.0625rem;
      }
    }
  }
</style>
