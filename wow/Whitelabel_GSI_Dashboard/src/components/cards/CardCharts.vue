<template>
  <div class="row q-col-gutter-sm q-py-sm">
    <!-- <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card
        class="q-ma-xs no-shadow"
        bordered
        style="background-color: #38b1c5"
      >
        <q-card-section class="text-h6 text-white">
          今日投注詳情
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ECharts
            :option="LineChart2"
            class="q-mt-md"
            :resizable="true"
            autoresize
            style="height: 250px"
          />
        </q-card-section>
      </q-card>
    </div> -->
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs no-shadow" bordered style="background-color: #1e88e5">
        <q-card-section class="text-h6 text-white">
          {{ $t("reward_type.today_bet_details") }}
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ECharts :option="BarChart" class="q-mt-md" :resizable="true" autoresize style="height: 250px" />
        </q-card-section>
      </q-card>
    </div>
    <!-- <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card
        class="q-ma-xs no-shadow"
        bordered
        style="background-color: #1e88e5"
      >
        <q-card-section class="text-h6 text-white">
          Today's User Visit
        </q-card-section>
        <q-card-section class="q-pa-none">
          <ECharts
            :option="LineChart"
            class="q-mt-md"
            :resizable="true"
            autoresize
            style="height: 250px"
          />
        </q-card-section>
      </q-card>
    </div> -->
  </div>
</template>

<script>
  // import {defineComponent, defineAsyncComponent} from 'vue';
  import { defineComponent } from "vue"
  import * as echarts from "echarts"
  import ECharts from "vue-echarts"

  export default defineComponent({
    name: "CardCharts",
    components: {
      ECharts
    },
    setup() {
      return {
        BarChart: {
          tooltip: { show: true },
          title: {
            show: true,
            textStyle: { color: "rgba(0, 0, 0 , .87)", fontFamily: "sans-serif" }
          },
          dataset: {
            source: [
              ["2023-08-01", "盈虧", "投注"],
              ["2023-08-02", 100, 43.3, 85.8],
              ["2023-08-03", 80, 83.1, 73.4],
              ["2023-08-04", 20, 86.4, 65.2],
              ["2023-08-05", 50, 72.4, 53.9]
            ]
          },
          xAxis: {
            type: "category",
            axisLine: {
              lineStyle: { color: "#fff", type: "dashed" }
            }
          },
          yAxis: {
            axisLine: {
              lineStyle: { color: "#fff", type: "dashed" }
            }
          },
          series: [
            {
              type: "line",
              lineStyle: {
                color: "#444",
                opacity: 0.5
              }
            },
            { type: "bar" },
            { type: "bar" }
          ]
        },
        LineChart: {
          tooltip: { show: true },
          title: {
            show: true,
            textStyle: { color: "rgba(0, 0, 0 , .87)", fontFamily: "sans-serif" }
          },
          grid: { containLabel: true, left: "0", bottom: "0", right: "0" },
          xAxis: {
            show: false,
            type: "category",
            axisLine: {
              lineStyle: { color: "rgba(0, 0, 0 , .54)", type: "dashed" }
            },
            axisTick: {
              show: true,
              alignWithLabel: true,
              lineStyle: {
                show: true,
                color: "rgba(0, 0, 0 , .54)",
                type: "dashed"
              }
            },
            axisLabel: { show: false },
            boundaryGap: false
          },
          yAxis: {
            show: false,
            type: "value",
            axisLine: {
              lineStyle: { color: "rgba(0, 0, 0 , .54)", type: "dashed" }
            },
            axisLabel: { show: false },
            splitLine: { lineStyle: { type: "dashed" } },
            axisTick: {
              show: true,
              lineStyle: {
                show: true,
                color: "rgba(0, 0, 0 , .54)",
                type: "dashed"
              }
            }
          },
          series: [{ type: "line", areaStyle: {}, smooth: true }],
          dataset: {
            source: [
              { month: "Jan", "Unique Visit": 296, "Page View": 548 },
              {
                month: "Feb",
                "Unique Visit": 1181,
                "Page View": 714
              },
              { month: "Mar", "Unique Visit": 235, "Page View": 961 },
              {
                month: "Apr",
                "Unique Visit": 294,
                "Page View": 580
              },
              { month: "May", "Unique Visit": 765, "Page View": 730 },
              {
                month: "Jun",
                "Unique Visit": 412,
                "Page View": 1249
              },
              { month: "Jul", "Unique Visit": 1125, "Page View": 267 },
              {
                month: "Aug",
                "Unique Visit": 800,
                "Page View": 251
              },
              { month: "Sep", "Unique Visit": 948, "Page View": 1043 },
              {
                month: "Oct",
                "Unique Visit": 1046,
                "Page View": 1118
              },
              { month: "Nov", "Unique Visit": 363, "Page View": 573 },
              {
                month: "Dec",
                "Unique Visit": 909,
                "Page View": 283
              }
            ]
          },
          color: ["#2196f3"]
        },
        LineChart2: {
          tooltip: { show: true },
          title: {
            show: true,
            textStyle: { color: "rgba(0, 0, 0 , .87)", fontFamily: "sans-serif" }
          },
          grid: { containLabel: true, left: "0", bottom: "0", right: "0" },
          xAxis: {
            show: false,
            type: "category",
            axisLine: {
              lineStyle: { color: "rgba(0, 0, 0 , .54)", type: "dashed" }
            },
            axisTick: {
              show: true,
              alignWithLabel: true,
              lineStyle: {
                show: true,
                color: "rgba(0, 0, 0 , .54)",
                type: "dashed"
              }
            },
            axisLabel: { show: false },
            boundaryGap: false
          },
          yAxis: {
            show: false,
            type: "value",
            axisLine: {
              lineStyle: { color: "rgba(0, 0, 0 , .54)", type: "dashed" }
            },
            axisLabel: { show: false },
            splitLine: { lineStyle: { type: "dashed" } },
            axisTick: {
              show: true,
              lineStyle: {
                show: true,
                color: "rgba(0, 0, 0 , .54)",
                type: "dashed"
              }
            }
          },
          series: [{ type: "line", areaStyle: {}, smooth: false }],
          dataset: {
            source: [
              { month: "Jan", "Unique Visit": 296, "Page View": 548 },
              {
                month: "Feb",
                "Unique Visit": 1181,
                "Page View": 714
              },
              { month: "Mar", "Unique Visit": 235, "Page View": 961 },
              {
                month: "Apr",
                "Unique Visit": 294,
                "Page View": 580
              },
              { month: "May", "Unique Visit": 765, "Page View": 730 },
              {
                month: "Jun",
                "Unique Visit": 412,
                "Page View": 1249
              },
              { month: "Jul", "Unique Visit": 1125, "Page View": 267 },
              {
                month: "Aug",
                "Unique Visit": 800,
                "Page View": 251
              },
              { month: "Sep", "Unique Visit": 948, "Page View": 1043 },
              {
                month: "Oct",
                "Unique Visit": 1046,
                "Page View": 1118
              },
              { month: "Nov", "Unique Visit": 363, "Page View": 573 },
              {
                month: "Dec",
                "Unique Visit": 909,
                "Page View": 283
              }
            ]
          },
          color: ["#45c2c5"]
        }
      }
    }
  })
</script>
