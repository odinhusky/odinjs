<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6" v-for="(item, index) in kolsData" :key="index">
        <q-card class="q-pa-md rounded-b shadow-1">
          <!-- 標題區 + 詳細資料按鈕 -->
          <div class="row items-start justify-between q-mb-sm q-mt-md">
            <div>
              <div class="text-subtitle1 q-mb-xs">{{ item.account }}</div>
              <!--<div class="text-caption text-grey-7 q-mt-sm">{{ item.remark }}</div>-->
            </div>
            <q-btn
              :label="$t('btn.view_details')"
              outline
              color="success"
              class="detail-btn q-ml-sm"
              @click="onAction(item.account)"
            />
          </div>

          <!-- 數據區塊 -->
          <q-markup-table square separator="none" class="q-mt-md q-pb-md">
            <thead>
              <tr>
                <th>{{ $t("table_header.followers") }}</th>
                <th>{{ $t("table_header.following") }}</th>
                <th>{{ $t("table_header.posts") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ moneyFormat(item.followers) }}</td>
                <td>{{ moneyFormat(item.following) }}</td>
                <td>{{ moneyFormat(item.posts) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </div>
      <div class="col-12 col-md-12">
        <q-card class="q-pa-md rounded-b shadow-1">
          <p class="text-subtitle1 q-mt-md q-ml-sm" style="color: rgba(63, 60, 68, 0.8)">
            {{ $t("table_header.follower_growth") }}
          </p>
          <div ref="chartRef" class="q-mt-md" :resizable="true" autoresize style="width: 100%; height: 450px"></div>
        </q-card>
      </div>
      <div class="col-12 col-md-12 q-pb-lg">
        <div class="table-white-bg">
          <p class="text-subtitle2">{{ $t("table_header.message_management_center") }}</p>
          <q-markup-table square separator="none" class="q-mt-md">
            <thead>
              <tr>
                <th>{{ $t("table_header.total_messages") }}</th>
                <th>{{ $t("table_header.ai_replies") }}</th>
                <th>{{ $t("table_header.follower_messages") }}</th>
                <th>{{ $t("table_header.chat_bot_cost") }}</th>
                <th>{{ $t("table_header.service_status") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ moneyFormat(system_info.total_message_count) }}</td>
                <td>{{ moneyFormat(system_info.total_ai_response_count) }}</td>
                <td>{{ moneyFormat(system_info.total_follower_request_count) }}</td>
                <td>{{ moneyFormat(system_info.chatbot_fee) }}</td>
                <td>
                  <span :style="{ color: system_info.status === 1 ? '#27B060' : 'red' }">
                    {{ system_info.status === 1 ? $t("edit_form.in_use_normally") : $t("edit_form.stop") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive, watchEffect } from "vue"
  import { useRouter } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
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

  import { getKolAccount, getKolSystemInfo } from "@/api/ai"
  import type * as Response from "@/api/response.type"

  const { moneyFormat } = useCommon()
  const router = useRouter()
  const kolsData = ref<Response.AiKolAccount["kols"]>([])
  const system_info = ref<Response.AiKolSystemInfo["system_info"]>({
    total_message_count: 0,
    total_ai_response_count: 0,
    total_follower_request_count: 0,
    chatbot_fee: 0,
    status: 1
  })
  const follower_growth = ref<Response.AiKolSystemInfo["follower_growth"][]>([])

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
    legend: { show: false },
    xAxis: [
      {
        type: "category",
        data: [] as string[],
        axisPointer: {
          type: "shadow"
        }
      }
    ],
    yAxis: [] as any[],
    series: [] as any[]
  })

  type FollowerItem = {
    date: string
    [account: string]: number | string
  }
  const chartData = reactive<{
    list: FollowerItem[]
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
  onMounted(async () => {
    chart = echarts.init(chartRef.value)
    await Promise.all([getKolAccount(), getKolSystemInfo()])
      .then(([kolAccountRes, kolSystemRes]) => {
        kolsData.value = kolAccountRes.data.kols
        system_info.value = kolSystemRes.data.system_info
        follower_growth.value = kolSystemRes.data.follower_growth

        const result = follower_growth.value.map((entry: any) => {
          const formatted: { date: string; [key: string]: any } = { date: entry.date }
          entry.follower_growth_data.forEach((kol: { account: string; followers: number }) => {
            formatted[kol.account] = kol.followers
          })
          return formatted
        })
        // echart 資料
        chartData.list = result

        genDataToChartOptions()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        isLoading.value = true
      })
  })

  // 往echart塞入資料
  function genDataToChartOptions() {
    // 1. 取得所有帳號 key（排除 date）
    const accounts = Object.keys(chartData.list[0]).filter((key) => key !== "date")

    const currentXAxisIndex = chartOptions.xAxis.findIndex((xAxisItem) => xAxisItem.type === "category")
    chartOptions.yAxis = []
    chartOptions.series = []
    accounts.forEach((account, index) => {
      chartOptions.series.push({
        id: account,
        name: account,
        type: "bar",
        symbol: "circle",
        showSymbol: false,
        barWidth: 12,
        barGap: "100%",
        symbolSize: 8,
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: getAccountColor(index)
        },
        tooltip: {
          valueFormatter: (value: number) => value.toLocaleString()
        },
        data: []
      })

      chartOptions.yAxis.push({
        id: account,
        type: "value",
        //name: account,
        nameTextStyle: {
          color: getAccountColor(index)
        },
        axisLabel: {
          formatter: "{value} "
        }
      })
    })
    chartData.list.forEach((item) => {
      chartOptions.xAxis[currentXAxisIndex].data.push(item.date)
      accounts.forEach((account, index) => {
        chartOptions.series[index].data.push(item[account])
      })
    })
    chart && chart.setOption(chartOptions)
    console.log(chartOptions)
  }
  function getAccountColor(index: number): string {
    const colorPalette = ["#3370eb", "#1bcebf", "#ffc60a", "#ed6d0c", "#A855F7", "#0EA5E9", "#FACC15"]
    return colorPalette[index % colorPalette.length]
  }

  watchEffect(() => {
    window.addEventListener("resize", resizeHandler)
  })

  const onAction = (account: string) => {
    router.push({
      name: "AiKolDetail",
      params: {
        id: account
      }
    })
  }
</script>

<style scoped>
  @import "@/css/ai.scss";
</style>
