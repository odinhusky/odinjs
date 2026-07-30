<template>
  <div class="q-pa-md" v-if="isAgentMode && !permission.view">
    <q-card class="q-mb-md col-12 dashboard-card">
      <div class="welcome-container">
        <h2 class="welcome-title">{{ $t("common.welcome_backend_system") }}</h2>
        <img :src="dashboardImg()" class="welcome-image" />
      </div>
    </q-card>
  </div>
  <div class="q-pa-md" v-else>
    <div
      v-if="rankCompList.includes(RankEnum.TodayTraffic) || rankCompList.includes(RankEnum.TodayDepositWithdraw)"
      class="row q-col-gutter-lg items-stretch"
    >
      <div class="col-12 col-md-6 column" style="display: flex; flex-direction: column">
        <!-- 今日存提款統計板 -->
        <q-card v-if="rankCompList.includes(RankEnum.TodayDepositWithdraw)" class="q-mb-md rankCard" style="flex: 1">
          <q-card-section class="q-pb-none">
            <div class="text-grey-8 text-bold row items-center dash-title">
              <span>{{ $t("reward_type.today_deposit_withdraw") }}</span>
              <q-space />
              <q-btn outline color="success" @click="onDetails(RankEnum.TodayDepositWithdraw)" class="detail-btn">
                {{ $t("btn.view_details") }}
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md rankCard">
            <div class="row q-col-gutter-md">
              <!-- 存款 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayDeposit]" />
              </div>

              <!-- 提款 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayWithdraw]" />
              </div>

              <!-- 淨出入 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayWinlose]" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 今日流量統計板 -->
        <q-card v-if="rankCompList.includes(RankEnum.TodayTraffic)" class="q-mb-md rankCard" style="flex: 1">
          <q-card-section class="q-pb-none">
            <div class="text-grey-8 text-bold row items-center dash-title">
              <span>{{ $t("reward_type.today_traffic") }}</span>
              <q-space />
              <q-btn outline color="success" @click="onDetails(RankEnum.TodayTraffic)" class="detail-btn">
                {{ $t("btn.view_details") }}
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md">
              <!-- 瀏覽人數 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayViewer]" />
              </div>

              <!-- 登入人數 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayLogin]" />
              </div>

              <!-- 下注人數 -->
              <div class="col-12 col-3 col-xs-6 col-md-4">
                <StatisticsBoard :datas="rankBoardData[STATISTICS.Enums.TodayBettingNumber]" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- 右側：表格 -->
      <div class="col-12 col-md-6 column" style="display: flex; flex-direction: column">
        <q-card class="q-mb-md rankCard" style="width: 100%; flex-shrink: 0">
          <div class="col-12 h-100 q-pa-md text-grey-8 text-bold">
            <div v-if="gscpBalance.length > 0">
              <div v-for="(item, index) in gscpBalance" :key="item.currency_id" :class="{ 'q-mt-sm': index > 0 }">
                GSC+ {{ item.currency_code }} {{ t("table_header.quota") }}：{{ moneyFormat(item.current_balance) }}
              </div>
            </div>
            <div v-else>GSC+{{ t("table_header.quota") }}：0</div>
          </div>
        </q-card>
        <q-card class="q-mb-md rankCard" style="width: 100%; flex: 1; display: flex; flex-direction: column">
          <!-- 今日熱門供應商 -->
          <div v-if="rankCompList.includes(RankEnum.Supplier)" class="col-12 h-100">
            <Supplier :datas="rankTableData[RankEnum.Supplier]" />
          </div>

          <!-- 今日流量排行 -->
          <div v-if="rankCompList.includes(RankEnum.Traffic)" class="col-12 h-100">
            <Traffic :datas="rankTableData[RankEnum.Traffic]" />
          </div>

          <!-- 今日存款排行 -->
          <div v-if="rankCompList.includes(RankEnum.Deposit)" class="col-12 h-100">
            <Deposit :datas="rankTableData[RankEnum.Deposit]" />
          </div>

          <!-- 今日投注排行 -->
          <div v-if="rankCompList.includes(RankEnum.Betting)" class="col-12 h-100">
            <Betting :datas="rankTableData[RankEnum.Betting]" />
          </div>

          <!-- 今日熱門產品排行 -->
          <div v-if="rankCompList.includes(RankEnum.Product)" class="col-12 h-100">
            <Product :datas="rankTableData[RankEnum.Product]" />
          </div>
        </q-card>
      </div>
    </div>

    <div class="row">
      <q-card class="chartCard q-mr-auto">
        <!-- 投注詳情統計 -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div v-for="(statistics, key) in statisticsData" :key="key" class="col-xs-12 col-sm-6 col-md-auto">
              <StatisticsBoard :datas="statistics" :style="{ 'min-width': '14vw' }" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-separator />
        </q-card-section>

        <!-- 圖表 e-chart -->
        <q-card-section class="q-pa-md" style="padding-bottom: 0px">
          <div>
            <q-btn
              v-for="(range, key) in statisticsRangeList"
              :key="key"
              class="dash-btn"
              :flat="range !== statisticsRange"
              :color="range === statisticsRange ? 'success2' : ''"
              :text-color="range === statisticsRange ? 'white' : 'success2'"
              :label="$t('common.num_day', { num: range })"
              @click="statisticsRange = range"
            />
          </div>
          <div ref="chartRef" class="q-mt-md" :resizable="true" autoresize style="width: 100%; height: 450px"></div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="hasChecksumPermission" class="row q-mt-lg">
      <q-card class="full-width">
        <q-card-section class="q-pb-none">
          <div class="row items-center">
            <div class="text-h6 text-grey-8 text-bold">{{ $t("common.version_verification_logs") }}</div>
            <q-space />
            <q-btn
              color="primary"
              :label="$t('common.version_verification')"
              :loading="isLoadingChecksum"
              @click="onVerifyChecksum"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
            :loading="isLoadingChecksum"
          >
            <template #body="props">
              <q-tr>
                <!--ID-->
                <q-td key="operator" :props="props">
                  {{ props.row.operator }}
                </q-td>
                <!--版本-->
                <q-td key="version" :props="props">
                  {{ props.row.version }}
                </q-td>
                <!--Hash 值-->
                <q-td key="hash_value" :props="props">
                  <div class="text-truncate" :title="props.row.hash_value">
                    {{ props.row.hash_value }}
                  </div>
                </q-td>
                <!--驗證結果-->
                <q-td key="verification_result" :props="props">
                  {{
                    props.row.verification_result
                      ? $t("table_header.verification_passed")
                      : $t("table_header.verification_failed")
                  }}
                </q-td>
                <!--驗證時間-->
                <q-td key="verified_at" :props="props">
                  {{ genTimeFormat(props.row.verified_at, "yyyy-MM-dd HH:mm:ss") }}
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
        </q-card-section>
        <q-card-section class="q-pt-none">
          <Pagination v-bind="checksumPagination" />
        </q-card-section>
      </q-card>
    </div>

    <!-- 验证结果弹窗 -->
    <q-dialog v-model="showVerifyDialog" persistent>
      <q-card class="full-width">
        <q-card-section class="q-pb-none">
          <div class="row items-center">
            <div class="text-nd text-grey-8 text-bold">{{ $t("common.version_verification") }}</div>
            <q-space />
            <q-btn flat round color="grey-13" icon="close" @click="closeVerifyDialog" />
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="dialogTableData"
            :columns="dialogTableColumn"
            row-key="id"
            table-header-class="bg-success"
            :loading="isLoadingChecksum"
          >
            <template #body="props">
              <q-tr>
                <!--ID-->
                <q-td key="id" :props="props">
                  {{ $t("common.system_module") }}
                </q-td>
                <!--驗證結果-->
                <q-td key="verification_result" :props="props">
                  {{ props.row.verification_result ? $t("common.verify_pass") : $t("common.verify_failed") }}
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
        </q-card-section>
        <q-card-section v-if="verifyResult">
          <div class="text-sm">{{ $t("table_header.system_version") }}: {{ verifyResult.version }}</div>
          <div class="text-sm">{{ $t("table_header.hash") }}: {{ verifyResult.hash_value }}</div>
        </q-card-section>
        <q-card-section class="row justify-end">
          <q-btn color="primary" :label="$t('btn.check')" @click="closeVerifyDialog" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from "vue"
  import * as echarts from "echarts/core"
  import { BarChart, LineChart } from "echarts/charts"
  import {
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent,
    LegendComponent
  } from "echarts/components"
  import { CanvasRenderer } from "echarts/renderers"
  import { useI18n } from "vue-i18n"
  import { startOfDay, endOfDay, subDays } from "date-fns"

  import Supplier from "@/components/dashboard/Supplier.vue"
  import Traffic from "@/components/dashboard/Traffic.vue"
  import Deposit from "@/components/dashboard/Deposit.vue"
  import Betting from "@/components/dashboard/Betting.vue"
  import Product from "@/components/dashboard/Product.vue"
  import StatisticsBoard from "@/components/dashboard/StatisticsBoard.vue"
  import type { IPaginationResults, IPaginationSettings } from "@/components/query/pagination.vue"
  import Pagination from "@/components/query/pagination.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useCurrencyStore } from "src/stores/currencyStore"
  import { usePermissionStore } from "src/stores/permissionStore"
  import { getCurrencyList, getDashboard, getGscpBalance } from "@/api/common"
  import { getChecksumLogs, verifyChecksum } from "@/api/checksum"
  import { STATISTICS, CURRENCY_TYPE, PERMISSION } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useImage } from "@/hook/useImage"
  import { useRoute, useRouter } from "vue-router"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import type * as Response from "@/api/response.type"
  import { useTimeZoneStore } from "@/stores/timezoneStore"
  import { useUserInfo } from "@/hook/useUserInfo"
  import { usePermission } from "@/hook/usePermission"
  import { useLanguageStore } from "src/stores/languageStore"
  import { Notify } from "quasar"

  const languageStore = useLanguageStore()

  const { moneyFormat, roundDown, genTimeFormat } = useCommon()
  const timezoneStore = useTimeZoneStore()
  const { isAnibetAgent } = useUserInfo()
  const { t } = useI18n()
  const { permission } = usePermission()
  const currencyStore = useCurrencyStore()
  const permissionStore = usePermissionStore()

  // 检查版本验证权限
  const hasChecksumPermission = computed(() => {
    const permissionList = permissionStore.permission
    let hasFeaturePermission = false
    let hasViewPermission = false

    // 遍历所有权限检查是否包含这两个权限
    for (const category in permissionList) {
      const entries = permissionList[category]
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          if (entry.id === PERMISSION.Enums.A_F_CHECKSUM_VERIFICATION) {
            hasFeaturePermission = true
            hasViewPermission = true
          }
        }
      }
    }

    return hasFeaturePermission && hasViewPermission
  })

  enum ChartColumn {
    Betting = "total_betting",
    Winloss = "total_winloss",
    Trend = "total_trend"
  }

  function getChartColumnTitle(i18nKey: string) {
    if (isAnibetAgent.value && i18nKey === ChartColumn.Winloss) {
      return t("table_header.ggr")
    }
    return t(`chart_header.${i18nKey}`)
  }

  const { dashboardImg } = useImage()

  const statisticsData = reactive<{
    [key: string]: {
      label: string
      icon: STATISTICS.Enums
      color: string
      bgColor: string
      quota: string
      percentage?: string
      prependString?: string
    }
  }>({
    [STATISTICS.Enums.TodayBetting]: {
      label: "statistics_label.today_betting",
      icon: STATISTICS.Enums.TodayBetting,
      bgColor: "pink",
      color: "deep-pink",
      quota: "0",
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayWinloss]: {
      label: isAnibetAgent.value ? "table_header.ggr" : "statistics_label.today_winloss",
      icon: STATISTICS.Enums.TodayWinloss,
      bgColor: "green",
      color: "green",
      quota: "0",
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.YesterdayBetting]: {
      label: "statistics_label.yesterday_betting",
      icon: STATISTICS.Enums.YesterdayBetting,
      bgColor: "purple",
      color: "deep-purple-6",
      quota: "0",
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.YesterdayWinloss]: {
      label: isAnibetAgent.value ? "table_header.yesterday_ggr" : "statistics_label.yesterday_winloss",
      icon: STATISTICS.Enums.YesterdayWinloss,
      bgColor: "green",
      color: "teal-5",
      quota: "0",
      percentage: undefined,
      prependString: undefined
    }
  })

  const chartOptions = reactive({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999"
        }
      }
    },
    toolbox: {
      show: false,
      orient: "horizontal",
      left: "right",
      top: "top",
      feature: {
        dataView: { show: false, readOnly: true },
        magicType: { show: false, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: [
        getChartColumnTitle(ChartColumn.Betting),
        getChartColumnTitle(ChartColumn.Winloss),
        getChartColumnTitle(ChartColumn.Trend)
      ]
    },
    xAxis: [
      {
        type: "category",
        data: [] as string[],
        axisPointer: {
          type: "shadow"
        }
      }
    ],
    yAxis: [
      {
        id: getChartColumnTitle(ChartColumn.Betting),
        type: "value",
        name: getChartColumnTitle(ChartColumn.Betting),
        nameTextStyle: {
          color: "#3370eb"
        },
        axisLabel: {
          formatter: "{value}"
        }
      },
      {
        id: getChartColumnTitle(ChartColumn.Winloss),
        type: "value",
        name: getChartColumnTitle(ChartColumn.Winloss),
        nameTextStyle: {
          color: "#1bcebf"
        },
        axisLabel: {
          formatter: "{value} %"
        }
      }
    ],
    series: [
      {
        id: getChartColumnTitle(ChartColumn.Betting),
        name: getChartColumnTitle(ChartColumn.Betting),
        type: "bar",
        barWidth: "16",
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: "#3370eb"
        },
        tooltip: {
          valueFormatter: function (value: number) {
            return value
          }
        },
        data: [] as number[]
      },
      {
        id: getChartColumnTitle(ChartColumn.Winloss),
        name: getChartColumnTitle(ChartColumn.Winloss),
        type: "bar",
        barWidth: "16",
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: "#1bcebf"
        },
        tooltip: {
          valueFormatter: function (value: number) {
            return value
          }
        },
        data: [] as number[]
      },
      {
        id: getChartColumnTitle(ChartColumn.Trend),
        name: getChartColumnTitle(ChartColumn.Trend),
        type: "line",
        yAxisIndex: 1,
        symbol: "emptyCircle",
        symbolSize: 10,
        barWidth: "16",
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: "#ffc60a",
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowBlur: 3,
          shadowOffsetY: 1
        },
        tooltip: {
          valueFormatter: function (value: number) {
            return value + " %"
          }
        },
        data: [] as number[]
      }
    ]
  })

  const chartData = reactive<{
    list: {
      date: string
      betting: number
      winloss: number
      trend: number
    }[]
  }>({
    list: []
  })

  const chartRef = ref<HTMLDivElement>()
  let chart: echarts.ECharts | null = null
  echarts.use([
    BarChart,
    LineChart,
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent,
    LegendComponent,
    CanvasRenderer
  ])

  function resizeHandler() {
    chart?.resize()
  }

  const store = useQueryStore()

  const statisticsCurrency = computed(() => {
    // 允许 0 作为有效的货币 ID
    return currencyStore.currentCurrency !== null && currencyStore.currentCurrency !== undefined
      ? currencyStore.currentCurrency
      : ""
  })
  const statisticsRangeList = ref<number[]>([7, 14, 30])
  const statisticsRange = ref<number>(7)
  let dropdownData = reactive<{
    currencyList: {
      label: string
      value: number
    }[]
  }>({
    currencyList: []
  })

  const isLoading = ref(false)
  const gscpBalance = ref<Response.GscpBalanceItem[]>([])

  // 获取 GSCP 余额
  async function fetchGscpBalance() {
    // 检查 currency 是否有效（允许 0 作为有效值）
    if (
      statisticsCurrency.value === "" ||
      statisticsCurrency.value === null ||
      statisticsCurrency.value === undefined
    ) {
      return
    }
    try {
      const { code, data } = await getGscpBalance({
        currency_id: statisticsCurrency.value
      })
      if (code === 0 && data && data.length > 0) {
        gscpBalance.value = data
      } else {
        gscpBalance.value = []
      }
    } catch (error) {
      console.error("Failed to fetch GSCP balance:", error)
      gscpBalance.value = []
    }
  }

  async function search() {
    // 检查 currency 和 range 是否有效（允许 0 作为有效值）
    if (
      statisticsCurrency.value === "" ||
      statisticsCurrency.value === null ||
      statisticsCurrency.value === undefined ||
      !statisticsRange.value
    ) {
      return
    }
    const now = new Date()
    const startTime = startOfDay(subDays(now, statisticsRange.value - 1)).getTime()
    const endTime = endOfDay(now).getTime()

    isLoading.value = true
    const { code, data } = await getDashboard({
      currency_id: statisticsCurrency.value,
      start_time: startTime,
      end_time: endTime
    })
    isLoading.value = false

    if (code !== 0) {
      chartData.list.length = 0
      return
    }

    if (!Object.keys(data).length) {
      return
    }

    Object.keys(data).forEach((key) => {
      formatApiDatas({
        statisticsKey: key,
        data
      })
    })
  }

  function formatApiDatas(options: { statisticsKey: string; data: Response.GetDashboard }) {
    switch (options.statisticsKey) {
      case "chart":
        // 今日、昨日數據
        if (options.data.chart.length) {
          const [yesterdayInfo, todayInfo] = options.data.chart.slice(-2)
          statisticsData[STATISTICS.Enums.TodayBetting].quota = todayInfo?.bet_amount ?? "0"
          statisticsData[STATISTICS.Enums.TodayBetting].percentage = todayInfo?.bet_amount_growth_rate ?? "0"
          statisticsData[STATISTICS.Enums.TodayWinloss].quota = todayInfo?.profit ?? "0"
          statisticsData[STATISTICS.Enums.TodayWinloss].percentage = todayInfo?.profit_growth_rate ?? "0"
          statisticsData[STATISTICS.Enums.YesterdayBetting].quota = yesterdayInfo?.bet_amount ?? "0"
          statisticsData[STATISTICS.Enums.YesterdayBetting].percentage = yesterdayInfo?.bet_amount_growth_rate ?? "0"
          statisticsData[STATISTICS.Enums.YesterdayWinloss].quota = yesterdayInfo?.profit ?? "0"
          statisticsData[STATISTICS.Enums.YesterdayWinloss].percentage = yesterdayInfo?.profit_growth_rate ?? "0"
        } else {
          statisticsData[STATISTICS.Enums.TodayBetting].quota = "0"
          statisticsData[STATISTICS.Enums.TodayWinloss].quota = "0"
          statisticsData[STATISTICS.Enums.YesterdayBetting].quota = "0"
          statisticsData[STATISTICS.Enums.YesterdayWinloss].quota = "0"
          statisticsData[STATISTICS.Enums.TodayBetting].percentage = "0"
          statisticsData[STATISTICS.Enums.TodayWinloss].percentage = "0"
          statisticsData[STATISTICS.Enums.YesterdayBetting].percentage = "0"
          statisticsData[STATISTICS.Enums.YesterdayWinloss].percentage = "0"
        }

        // echart 資料
        chartData.list = options.data.chart.map((item) => ({
          date: item.date,
          betting: roundDown(Number(item.bet_amount), 2),
          winloss: roundDown(Number(item.profit), 2),
          trend: roundDown(Number(item.profit_growth_rate), 2)
        }))

        resetChartOptions()
        genDataToChartOptions()
        chart && chart.setOption(chartOptions)
        break
      case "traffic_data":
        // 今日流量
        rankBoardData[STATISTICS.Enums.TodayViewer].quota =
          options.data.traffic_data && options.data.traffic_data.length ? options.data.traffic_data[0].view_count : 0
        rankBoardData[STATISTICS.Enums.TodayLogin].quota =
          options.data.traffic_data && options.data.traffic_data.length ? options.data.traffic_data[0].login_count : 0
        rankBoardData[STATISTICS.Enums.TodayBettingNumber].quota =
          options.data.traffic_data && options.data.traffic_data.length ? options.data.traffic_data[0].bet_count : 0
        break
      case "cash_data":
        // 今日存提款
        rankBoardData[STATISTICS.Enums.TodayDeposit].quota =
          options.data.cash_data && options.data.cash_data.length ? parseInt(options.data.cash_data[0].deposit) : 0
        rankBoardData[STATISTICS.Enums.TodayWithdraw].quota =
          options.data.cash_data && options.data.cash_data.length ? parseInt(options.data.cash_data[0].withdraw) : 0
        rankBoardData[STATISTICS.Enums.TodayWinlose].quota =
          options.data.cash_data && options.data.cash_data.length ? parseInt(options.data.cash_data[0].net) : 0
        break
      case "product_data":
        // 今日熱門供應商
        rankTableData[RankEnum.Supplier].list = options.data.product_data
        break
      case "traffic_rank":
        // 今日流量排行
        rankTableData[RankEnum.Traffic].list = options.data.traffic_rank
        break
      case "cash_rank":
        // 今日存款排行
        rankTableData[RankEnum.Deposit].list = options.data.cash_rank
        break
      case "bet_rank":
        // 今日投注排行
        rankTableData[RankEnum.Betting].list = options.data.bet_rank
        break
      case "product_rank":
        // 今日熱門產品
        rankTableData[RankEnum.Product].list = options.data.product_rank
        break
      default:
    }
  }

  watchEffect(() => {
    window.addEventListener("resize", resizeHandler)
  })

  watch(
    () => statisticsCurrency.value,
    (newValue, oldValue) => {
      if (!newValue) {
        return
      }

      const location = {
        query: Object.assign({}, null, {
          currency_id: newValue,
          range: statisticsRange.value
        })
      }

      router.push(location).then(async () => {
        await search()
        await fetchGscpBalance()
      })
    }
  )
  watch(
    () => languageStore.currentLanguage,
    async () => {
      await nextTick()
      chartOptions.legend.data = [
        getChartColumnTitle(ChartColumn.Betting),
        getChartColumnTitle(ChartColumn.Winloss),
        getChartColumnTitle(ChartColumn.Trend)
      ]
      // yAxis
      chartOptions.yAxis[0].id = getChartColumnTitle(ChartColumn.Betting)
      chartOptions.yAxis[0].name = getChartColumnTitle(ChartColumn.Betting)

      chartOptions.yAxis[1].id = getChartColumnTitle(ChartColumn.Winloss)
      chartOptions.yAxis[1].name = getChartColumnTitle(ChartColumn.Winloss)

      // series
      chartOptions.series[0].id = getChartColumnTitle(ChartColumn.Betting)
      chartOptions.series[0].name = getChartColumnTitle(ChartColumn.Betting)

      chartOptions.series[1].id = getChartColumnTitle(ChartColumn.Winloss)
      chartOptions.series[1].name = getChartColumnTitle(ChartColumn.Winloss)

      chartOptions.series[2].id = getChartColumnTitle(ChartColumn.Trend)
      chartOptions.series[2].name = getChartColumnTitle(ChartColumn.Trend)
      chart && chart.setOption(chartOptions, true)
      chart?.resize()
    },
    {
      deep: true
    }
  )

  watch(
    () => statisticsRange.value,
    (newValue, oldValue) => {
      if (!newValue) {
        return
      }

      const location = {
        query: Object.assign({}, null, {
          currency_id: statisticsCurrency.value,
          range: newValue
        })
      }

      router.push(location).then(async () => {
        search()
      })
    }
  )

  watch(
    () => timezoneStore.timeZone,
    (newValue, oldValue) => {
      search()
    }
  )

  onMounted(async () => {
    chart = echarts.init(chartRef.value)

    // call api 取得圖表資料
    const { data: currencyData } = await getCurrencyList()

    if (!currencyData || !Object.keys(currencyData).length) {
      return
    }

    Object.keys(currencyData).forEach((item) => {
      const currencyValue: CURRENCY_TYPE.Enums = currencyData[item]
      dropdownData.currencyList.push({
        label: CURRENCY_TYPE.I18nKeys[currencyValue],
        value: currencyValue
      })
    })

    // 确保 currency 已初始化
    // 如果 currentCurrency 无效，设置为第一个可用的货币
    if (
      statisticsCurrency.value === "" ||
      statisticsCurrency.value === null ||
      statisticsCurrency.value === undefined
    ) {
      if (dropdownData.currencyList.length > 0) {
        currencyStore.setCurrency(dropdownData.currencyList[0].value)
      }
    }

    let { range } = route.query
    if (range && statisticsRangeList.value.some((item) => item === parseInt(range as string))) {
      statisticsRange.value = parseInt(range as string)
    } else {
      statisticsRange.value = statisticsRangeList.value[0]
    }

    // 等待下一个 tick 确保 currency 已更新
    await nextTick()

    // 调用 API 获取数据
    await search()
    await fetchGscpBalance()

    // 加载 Checksum 日志（仅当有权限时）
    if (hasChecksumPermission.value) {
      loadChecksumLogs()
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler)
    chart?.dispose()
  })

  //TODO: 重置資料
  function resetChartOptions() {
    const currentXAxisIndex = chartOptions.xAxis.findIndex((xAxisItem) => xAxisItem.type === "category")
    const currentSeriesBettingIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Betting)
    )
    const currentSeriesWinlossIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Winloss)
    )
    const currentSeriesTrendIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Trend)
    )

    chartOptions.xAxis[currentXAxisIndex].data.length = 0
    chartOptions.series[currentSeriesBettingIndex].data.length = 0
    chartOptions.series[currentSeriesWinlossIndex].data.length = 0
    chartOptions.series[currentSeriesTrendIndex].data.length = 0
  }

  // 往echart塞入資料
  function genDataToChartOptions() {
    const currentXAxisIndex = chartOptions.xAxis.findIndex((xAxisItem) => xAxisItem.type === "category")
    const currentSeriesBettingIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Betting)
    )
    const currentSeriesWinlossIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Winloss)
    )
    const currentSeriesTrendIndex = chartOptions.series.findIndex(
      (seriesItem) => seriesItem.id === getChartColumnTitle(ChartColumn.Trend)
    )

    // 塞資料
    chartData.list.forEach((item) => {
      chartOptions.xAxis[currentXAxisIndex].data.push(item.date)
      chartOptions.series[currentSeriesBettingIndex].data.push(item.betting)
      chartOptions.series[currentSeriesWinlossIndex].data.push(item.winloss)
      chartOptions.series[currentSeriesTrendIndex].data.push(item.trend)
    })
  }

  const { envData, isAgentMode } = useEnv()
  const envMode = computed(() => envData().VITE_APP_MODE)

  const rankCompList = computed<RankEnum[]>(() => {
    switch (envMode.value) {
      case ENV_MODE_ENUM.ADMIN:
      case ENV_MODE_ENUM.GENERAL_AGENT:
        return [RankEnum.Traffic, RankEnum.Deposit, RankEnum.Betting, RankEnum.Product]
      default:
        return [RankEnum.TodayTraffic, RankEnum.TodayDepositWithdraw, RankEnum.Supplier]
    }
  })

  enum RankEnum {
    /** 流量排行 */
    Traffic = "traffic",

    /** 存款排行 */
    Deposit = "deposit",

    /** 投注排行 */
    Betting = "betting",

    /** 熱門產品排行 */
    Product = "product",

    /** 供應商排行 */
    Supplier = "supplier",

    /** 今日流量統計板 */
    TodayTraffic = "todayTraffic",

    /** 今日存提款統計板 */
    TodayDepositWithdraw = "todayDepositWithdraw"
  }
  type RankTableData = {
    [RankEnum.Traffic]: {
      label: string
      list: Response.TrafficRankItem[]
    }
    [RankEnum.Deposit]: {
      label: string
      list: Response.CashRankItem[]
    }
    [RankEnum.Betting]: {
      label: string
      list: Response.BetRankItem[]
    }
    [RankEnum.Product]: {
      label: string
      list: Response.ProductRankItem[]
    }
    [RankEnum.Supplier]: {
      label: string
      list: Response.ProductDataItem[]
    }
  }
  const rankTableData = reactive<RankTableData>({
    [RankEnum.Traffic]: {
      label: "reward_type.today_traffic_ranking",
      list: []
    },
    [RankEnum.Deposit]: {
      label: "reward_type.today_deposit_ranking",
      list: []
    },
    [RankEnum.Betting]: {
      label: "reward_type.today_bet_ranking",
      list: []
    },
    [RankEnum.Product]: {
      label: "reward_type.today_hot_product",
      list: []
    },
    [RankEnum.Supplier]: {
      label: "reward_type.today_hot_supplier",
      list: []
    }
  })
  const rankBoardData = reactive({
    [STATISTICS.Enums.TodayViewer]: {
      label: "statistics_label.today_viewer",
      icon: STATISTICS.Enums.TodayViewer,
      bgColor: "purple",
      color: "deep-purple-6",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayLogin]: {
      label: "statistics_label.today_login",
      icon: STATISTICS.Enums.TodayLogin,
      bgColor: "green",
      color: "green-8",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayBettingNumber]: {
      label: "statistics_label.betting_number",
      icon: STATISTICS.Enums.TodayBettingNumber,
      bgColor: "orange",
      color: "deep-orange-7",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayDeposit]: {
      label: "statistics_label.deposit",
      icon: STATISTICS.Enums.TodayDeposit,
      bgColor: "purple",
      color: "deep-purple-6",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayWithdraw]: {
      label: "statistics_label.withdraw",
      icon: STATISTICS.Enums.TodayWithdraw,
      bgColor: "green",
      color: "green-8",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    },
    [STATISTICS.Enums.TodayWinlose]: {
      label: "statistics_label.winlose",
      icon: STATISTICS.Enums.TodayWinlose,
      bgColor: "orange",
      color: "deep-orange-7",
      quota: 0,
      percentage: undefined,
      prependString: undefined
    }
  })

  const route = useRoute()
  const router = useRouter()

  // Checksum 表格相关
  const tableData = ref<Response.ChecksumLogItem[]>([])
  const tableColumn = computed(() => [
    {
      name: "operator",
      label: t("table_header.console_account"),
      field: "operator",
      align: "left" as const
    },
    {
      name: "version",
      label: t("table_header.system_version"),
      field: "version",
      align: "left" as const
    },
    {
      name: "hash_value",
      label: t("table_header.hash"),
      field: "hash_value",
      align: "left" as const
    },
    {
      name: "verification_result",
      label: t("table_header.verification_result"),
      field: "verification_result",
      align: "center" as const
    },
    {
      name: "verified_at",
      label: t("table_header.verification_time"),
      field: "verified_at",
      align: "left" as const
    }
  ])

  const isLoadingChecksum = ref(false)

  // 验证结果弹窗
  const showVerifyDialog = ref(false)
  const verifyResult = ref<{
    agent_id: number
    hash_value: string
    id: number
    operator: string
    verification_result: boolean
    verified_at: string
    version: string
  } | null>(null)

  // 分页配置
  const checksumPagination = reactive<IPaginationSettings>({
    page: 1,
    perPage: 20,
    offset: 0,
    total: 0,
    onPagination: onChecksumPagination
  })

  // 分页变更回调
  function onChecksumPagination(result: IPaginationResults) {
    checksumPagination.page = result.page
    checksumPagination.perPage = result.perPage
    checksumPagination.offset = (result.page - 1) * result.perPage
    loadChecksumLogs()
  }

  // 获取 Checksum 日志
  async function loadChecksumLogs() {
    try {
      isLoadingChecksum.value = true
      const { code, data } = await getChecksumLogs({
        offset: checksumPagination.offset,
        size: checksumPagination.perPage
      })
      if (code === 0 && data) {
        tableData.value = data.list || []
        if (data.pagination) {
          checksumPagination.total = data.pagination.total
          checksumPagination.offset = data.pagination.offset

          // 确保 page 和 offset 保持同步
          checksumPagination.page = Math.floor(checksumPagination.offset / checksumPagination.perPage) + 1
        }
      }
    } catch (error) {
      console.error("Failed to load checksum logs:", error)
    } finally {
      isLoadingChecksum.value = false
    }
  }

  // 执行版本验证
  async function onVerifyChecksum() {
    try {
      isLoadingChecksum.value = true
      const response = await verifyChecksum()
      console.log(response)

      // 处理响应数据，兼容不同的数据结构
      const resultData = (response.data as any).data || response.data

      if (response.code === 0 && resultData) {
        // 保存验证结果并打开弹窗
        verifyResult.value = {
          agent_id: resultData.agent_id,
          hash_value: resultData.hash_value,
          id: resultData.id,
          operator: resultData.operator,
          verification_result: resultData.verification_result,
          verified_at: resultData.verified_at,
          version: resultData.version
        }
        showVerifyDialog.value = true
        Notify.create({
          type: "positive",
          message: t("common.verify_success"),
          position: "top"
        })

        // 重置到第一页并重新加载数据
        checksumPagination.page = 1
        checksumPagination.offset = 0
        await loadChecksumLogs()
      } else {
        Notify.create({
          type: "negative",
          message: response.msg || t("common.verify_failed"),
          position: "top"
        })
      }
    } catch (error) {
      console.error("Failed to verify checksum:", error)
      Notify.create({
        type: "negative",
        message: t("common.verify_failed"),
        position: "top"
      })
    } finally {
      isLoadingChecksum.value = false
    }
  }

  const dialogTableData = computed(() => {
    return [
      {
        id: verifyResult.value?.id,
        verification_result: verifyResult.value?.verification_result
      }
    ]
  })
  const dialogTableColumn = computed(() => {
    return [
      {
        name: "id",
        label: t("common.verification_item"),
        field: "id",
        align: "left" as const
      },
      {
        name: "verification_result",
        label: t("table_header.status"),
        field: "verification_result",
        align: "left" as const
      }
    ]
  })

  function closeVerifyDialog() {
    showVerifyDialog.value = false
    verifyResult.value = null
  }

  function onDetails(type: RankEnum) {
    const today = new Date()
    switch (type) {
      case RankEnum.TodayTraffic:
        router.push({
          name: "UserReportList",
          query: {
            start: startOfDay(today).getTime(),
            end: endOfDay(today).getTime()
          }
        })
        break
      case RankEnum.TodayDepositWithdraw:
        router.push({
          name: "CashReportList",
          query: {
            start: startOfDay(today).getTime(),
            end: endOfDay(today).getTime(),
            currency: statisticsCurrency.value
          }
        })
        break
    }
  }
</script>
<style lang="scss" scoped>
  .chartNoData,
  .chartLoading {
    display: flex;
    height: 450px;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #999;
    line-height: 1.5rem;
    padding-bottom: 50px;
  }

  .dashboard-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: #fff;
  }

  .welcome-container {
    text-align: center;
  }

  .welcome-title {
    font-size: 4rem;
    font-weight: bold;
    color: #6a36ad;
  }

  .welcome-image {
    width: 300px;
    max-width: 100%;
    margin-top: 1rem;
  }

  .chartCard {
    width: 100%;
  }

  .SupplierCard {
    width: calc(25%);
  }

  .h-100 {
    height: 100%;
  }

  .dash-title {
    font-size: 1.125rem;
    font-weight: 700;
  }

  .dash-btn {
    min-width: 4.3125rem;
    height: 2rem;
    font-size: 0.875rem;
  }

  :deep(.q-table) {
    thead {
      tr {
        th {
          text-align: center;
        }
      }
    }
  }
</style>
