<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg">
      <div class="msk" v-if="!permission.edit"></div>
      <q-form>
        <q-card-section class="q-pa-none q-pb-lg">
          <div class="q-mt-xs q-col-gutter-md items-center q-pt-md">
            <div class="row">
              <div class="col-7 q-mr-md">
                <q-card
                  class="row items-center q-px-md q-py-sm"
                  style="
                    height: 64px;
                    border-radius: 10px;
                    border: 0;
                    background: linear-gradient(180deg, #eff7ff 0%, #bfdaff 100%);
                  "
                >
                  <!-- 左側 Icon -->
                  <div class="q-mr-md flex flex-center q-pl-sm">
                    <img src="~assets/images/common/ads/aipoint.webp" />
                  </div>

                  <div class="bold grey" style="font-size: 16px">
                    <span>{{ $t("ads_marketing_service.your_remaining") }}</span>
                    <span>AI Point：</span>
                    <span>30,000</span>
                  </div>

                  <div class="q-mx-sm" style="flex: 1"></div>

                  <q-btn @click="openAddDialog" :loading="spinShow" style="" class="btns btn-blue">{{
                    $t("btn.purchase_point_credits")
                  }}</q-btn>
                </q-card>
              </div>
              <div class="col-2 column">
                <div class="h7-bold">{{ $t("ads_marketing_service.auto_renewal") }}</div>
                <q-card-actions class="q-px-none q-py-none" align="left">
                  <q-btn-toggle
                    v-model="renew_contract"
                    class="btn_toggle_style"
                    toggle-color="primary"
                    unelevated
                    rounded
                    map-options
                    :options="[
                      { label: t('common.disable'), value: false },
                      { label: t('common.enable'), value: true }
                    ]"
                  />
                </q-card-actions>
              </div>

              <div class="col row justify-end">
                <q-btn class="btns btn-blue" @click="onSubmit" :loading="spinShow" style="min-width: 10rem">{{
                  $t("btn.submit_order")
                }}</q-btn>
              </div>
            </div>
            <q-card-section>
              <div class="bold h4-bold grey q-mt-md">
                {{ $t("ads_marketing_service.select_marketing_budget_plan") }}
              </div>
              <div class="row col-12 col-sm languageTabsWrapper q-mt-sm">
                <div class="col-12">
                  <q-tabs
                    v-model="form.marketing_budget"
                    dense
                    class="bg-transparent text-grey-8"
                    active-color="main-color"
                    content-class="languageTab"
                    outside-arrows
                  >
                    <q-tab
                      v-for="item in budgetList"
                      :key="item.value"
                      :name="item.value"
                      :label="item.label"
                      class="q-px-none q-mr-md"
                      content-class="languageTabItem"
                    />
                  </q-tabs>
                  <q-tab-panels v-model="form.marketing_budget" animated swipeable>
                    <q-tab-panel
                      v-for="(items, key) in budgetList"
                      :key="items.value"
                      :name="items.value"
                      :label="items.label"
                      class="q-px-none"
                    >
                      <q-card-section style="padding-top: 0px">
                        <div class="text-subtitle3 text-primary q-pb-md">
                          {{ $t("ads_marketing_service.marketing_budget") }} : {{ amount * form.marketing_budget }} AI
                          Point
                        </div>
                        <div class="row q-col-gutter-md">
                          <!-- 卡片區塊模板 -->
                          <div class="col-12 col-sm-4">
                            <div class="q-pa-md bg-white text-center rounded-borders shadow-1 q-pb-lg">
                              <div class="item-block">
                                <img src="~assets/images/common/ads/people.webp" class="item-image" />
                                <div class="text-caption text-weight-medium">
                                  {{ $t("ads_marketing_service.account_quantity") }}
                                </div>

                                <div class="text-primary text-h6 gradient-text">
                                  {{
                                    $t("ads_marketing_service.more_than_items", { limit: 10 * form.marketing_budget })
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-12 col-sm-4">
                            <div class="q-pa-md bg-white text-center rounded-borders shadow-1 q-pb-lg">
                              <div class="item-block">
                                <img src="~assets/images/common/ads/video.webp" class="item-image" />
                                <div class="text-caption text-weight-medium">
                                  {{ $t("ads_marketing_service.video_quantity") }}
                                </div>
                                <div class="text-primary text-h6 gradient-text">
                                  {{
                                    $t("ads_marketing_service.more_than_units", { limit: 20 * form.marketing_budget })
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-12 col-sm-4">
                            <div class="q-pa-md bg-white text-center rounded-borders shadow-1 q-pb-lg">
                              <div class="item-block">
                                <img src="~assets/images/common/ads/rendering.webp" class="item-image" />
                                <div class="text-caption text-weight-medium">
                                  {{ $t("ads_marketing_service.video_traffic") }}
                                </div>
                                <div class="text-primary text-h6 gradient-text">
                                  {{
                                    $t("ads_marketing_service.more_than_100000", { limit: 50 * form.marketing_budget })
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- 服務說明 -->
                        <div class="q-mt-md text-caption text-grey-7">
                          {{ $t("ads_marketing_service.service_content") }}：<br />
                          {{ $t("ads_marketing_service.matrix_exposure_note") }}
                        </div>
                      </q-card-section>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </div>
            </q-card-section>

            <div>
              <div class="h4-bold bold grey">{{ $t("ads_marketing_service.exposure_region") }}</div>
              <div class="h8-bold grey">{{ $t("ads_marketing_service.select_exposure_region") }}</div>
              <q-card class="q-mt-sm q-pl-sm q-pr-sm q-pb-md ad_area_style">
                <q-card-section>
                  <div class="h4-bold bold grey q-mt-sm">{{ $t("ads_marketing_service.asia_region") }}</div>

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
                  <div class="h4-bold bold grey q-mt-md">{{ $t("ads_marketing_service.europe_region") }}</div>
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
                  </q-checkbox
                ></q-card-section>
              </q-card>
            </div>
            <div class="q-mt-sm">
              <div class="h4-bold bold grey">{{ $t("ads_marketing_service.exposure_platform") }}</div>
              <div class="h8-bold grey">{{ $t("ads_marketing_service.please_select_platforms") }}</div>
              <q-card class="q-mt-sm q-pl-sm q-pr-sm q-pb-md ad_area_style">
                <q-card-section>
                  <div>
                    <div class="row items-center q-gutter-sm q-mt-xs">
                      <!-- Checkbox -->
                      <q-checkbox
                        v-model="platforms[0].selected"
                        class="col-auto"
                        :true-value="true"
                        :false-value="false"
                      />
                      <div class="s-img-w">
                        <img src="~assets/images/common/ads/tik.webp" style="height: 32px" />
                      </div>
                      <div class="row items-center">
                        <q-btn
                          v-for="(n, index) in percents"
                          :key="n"
                          :label="n + '%'"
                          :color="platforms[0].percent === n ? 'purple' : 'white'"
                          :text-color="platforms[0].percent === n ? 'white' : 'black'"
                          :flat="true"
                          :class="[
                            platforms[0].percent === n ? 'selected-btn' : 'unselected-btn',
                            index === 0 ? 'rounded-left' : '',
                            index === percents.length - 1 ? 'rounded-right' : ''
                          ]"
                          @click="platforms[0].percent = n"
                        />
                        <span class="q-ml-md"
                          >{{ $t("ads_marketing_service.video_quantity") }} : {{ platforms[0].percent
                          }}{{ $t("ads_marketing_service.unit") }}
                        </span>
                      </div>
                    </div>
                    <div class="row items-center q-gutter-sm q-mt-sm">
                      <!-- Checkbox -->
                      <q-checkbox
                        v-model="platforms[1].selected"
                        class="col-auto"
                        :true-value="true"
                        :false-value="false"
                      />
                      <div class="s-img-w">
                        <img src="~assets/images/common/ads/ins.webp" style="height: 32px" />
                      </div>
                      <div class="row items-center">
                        <q-btn
                          v-for="(n, index) in percents"
                          :key="n"
                          :label="n + '%'"
                          :color="platforms[1].percent === n ? 'purple' : 'white'"
                          :text-color="platforms[1].percent === n ? 'white' : 'black'"
                          :flat="true"
                          :class="[
                            platforms[1].percent === n ? 'selected-btn' : 'unselected-btn',
                            index === 0 ? 'rounded-left' : '',
                            index === percents.length - 1 ? 'rounded-right' : ''
                          ]"
                          @click="platforms[1].percent = n"
                        />
                        <span class="q-ml-md"
                          >{{ $t("ads_marketing_service.video_quantity") }} : {{ platforms[1].percent
                          }}{{ $t("ads_marketing_service.unit") }}
                        </span>
                      </div>
                    </div>
                    <div class="row items-center q-gutter-sm q-mt-sm">
                      <!-- Checkbox -->
                      <q-checkbox
                        v-model="platforms[2].selected"
                        class="col-auto"
                        :true-value="true"
                        :false-value="false"
                      />
                      <div class="s-img-w">
                        <img src="~assets/images/common/ads/fb.webp" style="height: 32px" />
                      </div>
                      <div class="row items-center">
                        <q-btn
                          v-for="(n, index) in percents"
                          :key="n"
                          :label="n + '%'"
                          :color="platforms[2].percent === n ? 'purple' : 'white'"
                          :text-color="platforms[2].percent === n ? 'white' : 'black'"
                          :flat="true"
                          :class="[
                            platforms[2].percent === n ? 'selected-btn' : 'unselected-btn',
                            index === 0 ? 'rounded-left' : '',
                            index === percents.length - 1 ? 'rounded-right' : ''
                          ]"
                          @click="platforms[2].percent = n"
                        />
                        <span class="q-ml-md"
                          >{{ $t("ads_marketing_service.video_quantity") }} : {{ platforms[2].percent
                          }}{{ $t("ads_marketing_service.unit") }}
                        </span>
                      </div>
                    </div>
                    <div class="row items-center q-gutter-sm q-mt-sm q-pb-xs">
                      <!-- Checkbox -->
                      <q-checkbox
                        v-model="platforms[3].selected"
                        class="col-auto"
                        :true-value="true"
                        :false-value="false"
                      />
                      <div class="s-img-w">
                        <img src="~assets/images/common/ads/yt.webp" style="height: 32px" />
                      </div>
                      <div class="row items-center">
                        <q-btn
                          v-for="(n, index) in percents"
                          :key="n"
                          :label="n + '%'"
                          :color="platforms[3].percent === n ? 'purple' : 'white'"
                          :text-color="platforms[3].percent === n ? 'white' : 'black'"
                          :flat="true"
                          :class="[
                            platforms[3].percent === n ? 'selected-btn' : 'unselected-btn',
                            index === 0 ? 'rounded-left' : '',
                            index === percents.length - 1 ? 'rounded-right' : ''
                          ]"
                          @click="platforms[3].percent = n"
                        />
                        <span class="q-ml-md"
                          >{{ $t("ads_marketing_service.video_quantity") }} : {{ platforms[3].percent
                          }}{{ $t("ads_marketing_service.unit") }}
                        </span>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="q-mt-sm">
              <div class="h7-bold">{{ $t("ads_marketing_service.exposure_time") }}</div>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <DateTimePickerSingle
                    :date-time-model="dateTimeRange.dispatched_at"
                    class="default-input"
                    :label="'YYYY-MM-DD'"
                    :with-outlined="true"
                    :with-borderless="false"
                    :on-update-date-time="(value:any) => onDateChange(value,'dispatched_at')"
                  />
                </div>
                <div style="font-size: 20px; display: flex; align-items: center">~</div>
                <div class="col-4">
                  <DateTimePickerSingle
                    :date-time-model="dateTimeRange.expired_at"
                    class="default-input"
                    :label="'YYYY-MM-DD'"
                    :with-outlined="true"
                    :with-borderless="false"
                    :on-update-date-time="(value:any) => onDateChange(value,'expired_at')"
                  />
                </div>
              </div>
              <q-separator class="q-mt-lg" style="padding-top: 0px" />
            </div>

            <div class="q-mt-sm">
              <div class="h4-bold bold grey">{{ $t("ads_marketing_service.video_data") }}</div>
              <div class="row q-col-gutter-md q-mt-xs">
                <!-- 影片數量 -->
                <div class="col-4">
                  <div class="q-pa-md video_area">
                    <div class="row items-center">
                      <img src="~assets/images/common/video.webp" width="20" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-sm h6-bold grey">{{ $t("ads_marketing_service.video_quantity") }}</div>
                    <div class="h3-bold bold">98</div>
                  </div>
                </div>

                <!-- 總按讚數 -->
                <div class="col-4">
                  <div class="q-pa-md video_area">
                    <div class="row items-center">
                      <img src="~assets/images/common/like.webp" width="20" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-sm h6-bold grey">{{ $t("ads_marketing_service.total_likes") }}</div>
                    <div class="h3-bold bold">86,572,123</div>
                  </div>
                </div>

                <!-- 總流量 -->
                <div class="col-4">
                  <div class="q-pa-md video_area">
                    <div class="row items-center">
                      <img src="~assets/images/common/flow.webp" width="20" class="q-mr-sm" />
                    </div>
                    <div class="q-mt-sm h6-bold grey">{{ $t("ads_marketing_service.total_traffic") }}</div>
                    <div class="h3-bold bold">6,572,123</div>
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
                      <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row.link)">
                        <q-tooltip anchor="top middle" self="bottom middle">{{
                          $t("ads_marketing_service.link")
                        }}</q-tooltip>
                      </q-btn>
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

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" max-width="430px">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("btn.purchase_point_credits") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <div class="bg-grey-1 rounded-borders">
            <!-- 兌換區塊 -->
            <div class="exchange-box bg-white q-pa-md rounded-borders q-mb-md">
              <!-- 扣款區塊 -->
              <div class="text-caption text-left q-mb-sm">{{ $t("ads_marketing_service.deduct") }}</div>
              <div class="row justify-between items-center">
                <div class="row items-center">
                  <img
                    src="~assets/images/common/ads/usdt.webp"
                    alt="USDT"
                    style="width: 24px; height: 24px; margin-right: 8px"
                  />
                  <span class="text-weight-medium coin">USDT</span>
                </div>
                <div class="text-h6">1000</div>
              </div>

              <!-- 中間 icon -->
              <div class="row justify-center items-center q-my-sm">
                <q-separator class="col-grow q-mr-sm" />
                <img src="~assets/images/common/ads/change.webp" alt="Switch" style="width: 30px; height: 30px" />
                <q-separator class="col-grow q-ml-sm" />
              </div>

              <!-- 換成區塊 -->
              <div class="text-caption text-left q-mb-sm">{{ $t("ads_marketing_service.convert") }}</div>
              <div class="row justify-between items-center">
                <div class="row items-center">
                  <img
                    src="~assets/images/common/ads/aipoint.webp"
                    alt="AI Point"
                    style="width: 24px; height: 24px; margin-right: 8px"
                  />
                  <span class="text-weight-medium coin">AI Point</span>
                </div>
                <div class="text-h6">10,000</div>
              </div>
            </div>

            <!-- QR Code 區塊 -->
            <div class="row justify-center">
              <img src="~assets/images/common/ads/demoqr.webp" alt="QR Code" style="width: 180px; height: 180px" />
            </div>
            <div class="row justify-center q-mt-md">
              <div class="col-12">
                <q-select
                  v-model="dialogData.add.chain"
                  :options="['Trc20']"
                  emit-value
                  :label="`${$t('edit_form.protocol')}`"
                  map-options
                  outlined
                />
              </div>
            </div>
            <div class="row justify-center q-mt-md">
              <div class="col-12">
                <q-input
                  v-model.trim="dialogData.add.address"
                  type="text"
                  outlined
                  :label="$t('table_header.wallet_address')"
                >
                  <template v-slot:append>
                    <q-icon
                      name="content_copy"
                      class="cursor-pointer"
                      @click="copyToClipboard(dialogData.add.address)"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>
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
  import { useDialog } from "@/hook/useDialog"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"

  const { permission } = usePermission()

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const $q = useQuasar()
  const spinShow = ref(false)
  const { moneyFormat } = useCommon()

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    add: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    }
  })

  const dialogData = reactive<{
    add: {
      chain?: string
      address?: string
    }
  }>({
    add: { chain: "Trc20", address: "TJqmjvT3dBHahB1o9mwcFrcrxTeQzEB7he" }
  })
  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  async function handleAdd() {}
  export type DropdownType = {
    label: string
    value: string | number
  }
  const renew_contract = ref(false)
  const amount = ref(1000)
  const budgetList = ref<DropdownType[]>([
    { label: "1000 AI Point", value: 1 },
    { label: "2000 AI Point", value: 2 },
    { label: "3000 AI Point", value: 3 },
    { label: "4000 AI Point", value: 4 },
    { label: "5000 AI Point", value: 5 }
  ])

  const dateTimeRange = reactive({
    dispatched_at: { from: "", fromHms: "00:00:00", dateTime: "" },
    expired_at: { from: "", fromHms: "00:00:00", dateTime: "" }
  })
  /*const dialogData = reactive({
    add: {
      id: 0,
      amount: 0,
      dispatched_at: { from: "", fromHms: "00:00:00", dateTime: "" },
      expired_at: { from: "", fromHms: "00:00:00", dateTime: "" }
    } as GiftQuota,
    edit: {} as GiftQuota
  })
*/
  const platforms = ref([
    {
      name: "TikTok",
      label: "TikTok",
      icon: "/icons/tiktok.svg",
      selected: true,
      percent: 0
    },
    {
      name: "Instagram",
      label: "Instagram",
      icon: "/icons/instagram.svg",
      selected: true,
      percent: 0
    },
    {
      name: "Facebook",
      label: "Facebook",
      icon: "/icons/facebook.svg",
      selected: false,
      percent: 0
    },
    {
      name: "YouTube",
      label: "YouTube",
      icon: "/icons/youtube.svg",
      selected: false,
      percent: 0
    }
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
      video_title: "Nhảy đẹp",
      like_count: 5310,
      view_count: 523123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/651651384424479"
    },
    {
      serial_number: 2,
      video_title: "Sắc đẹp",
      like_count: 1259,
      view_count: 423123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/2355235408211177"
    },
    {
      serial_number: 3,
      video_title: "Sắc đẹp",
      like_count: 968,
      view_count: 323123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/985747503722519"
    },
    {
      serial_number: 4,
      video_title: "Phải đến nhà hàng ngon này",
      like_count: 734,
      view_count: 223123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/9787293348017986"
    },
    {
      serial_number: 5,
      video_title: "Bạn nghĩ sao về kiểu trang điểm này?",
      like_count: 1015,
      view_count: 123123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/2125124307917091"
    },
    {
      serial_number: 6,
      video_title: "Xây dựng mô hình này là siêu thú vị",
      like_count: 211,
      view_count: 23123,
      upload_time: "2025-04-28",
      link: "https://www.facebook.com/reel/552999307833478"
    }
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
  const onAction = (url: string) => {
    const popup = window.open(url, "_blank")
  }

  const percents = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const selected = ref(60) // 預設選 60%

  const copyToClipboard = () => {
    $q.notify({
      type: "positive",
      message: t("message.copy_completed"),
      position: "top",
      timeout: 300
    })
  }

  function onDateChange(value: { from: string; fromHms: string }, key: "dispatched_at" | "expired_at") {
    if (!dateTimeRange[key]) {
      dateTimeRange[key] = { from: "", fromHms: "", dateTime: "" } // 確保它是物件
    }

    console.log(value)
    dateTimeRange[key].dateTime = `${value.from} ${value.fromHms}`
  }
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
  .text-subtitle3 {
    font-weight: bold;
    font-size: 1.125rem;
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
  ::v-deep(.q-tabs__content--align-center) {
    justify-content: unset !important;
  }
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      color: #535252;
      font-size: 14px;
      font-weight: 400;
      min-width: 4.9375rem;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;

      border-radius: 0.25rem;
      padding-top: 0.5rem;
      padding-right: 1rem;
      padding-bottom: 0.5rem;
      padding-left: 1rem;
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        background: #086eff !important;
        box-shadow: 0px 0px 4px 0px #086eff;
        color: white !important;
      }
    }
  }
  .enable {
    width: 8.5rem;
    height: 3.0625rem;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 60px;
    :deep(.q-toggle) {
      width: 100px;
    }
    :deep(.q-anchor--skip) {
      width: 50px;
    }
  }

  .selected-btn {
    width: 3.125rem;
    background-color: #6e39cb !important;
    color: white !important;
    border: 1px solid #ccc;
    border-radius: 0;
  }

  .unselected-btn {
    width: 3.125rem;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 0;
  }
  .rounded-left {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .rounded-right {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .item-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .item-image {
    min-width: 160px;
    min-height: 160px;
    height: 100px;
    margin-bottom: 4px;
  }

  .gradient-text {
    font-size: 32px;
    font-weight: bold;
    background: linear-gradient(90deg, rgba(222, 0, 170, 1), rgba(63, 0, 173, 1)); /* 紫到粉紫 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .s-img-w {
    width: 6.5625rem;
  }

  .exchange-box {
    border: rgba(194, 194, 202, 1) 1px solid;
    .coin {
      font-size: 20px;
    }
  }
  .ad_area_style {
    background: rgba(239, 247, 255, 1);
    padding: 1.25rem;
    border-radius: 0.625rem;
    box-shadow: none;
    padding-top: 0rem;
    padding-bottom: 0rem;
    padding-left: 0.625rem;
    padding-right: 0rem;
  }
  .video_area {
    display: flex;
    flex-direction: column;
    height: 105px;
    min-height: 105px;
    border-radius: 10px;
    padding-top: 16px;
    padding-right: 20px;
    padding-bottom: 16px;
    padding-left: 20px;
    border: 2px solid rgba(229, 229, 229, 1);
  }
</style>
