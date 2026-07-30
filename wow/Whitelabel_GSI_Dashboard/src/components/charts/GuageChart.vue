<template>
  <div>
    <q-card class="no-shadow" bordered>
      <q-card-section class="text-h6">
        Guage Chart
        <q-btn icon="fa fa-download" class="float-right" flat dense @click="SaveImage">
          <q-tooltip>Download PNG</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <ECharts
          ref="guagechart"
          :option="options"
          class="q-mt-md"
          :resizable="true"
          autoresize
          style="height: 285px"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import * as echarts from "echarts"
  import ECharts from "vue-echarts"
  import { defineComponent } from "vue"

  export default defineComponent({
    name: "GuageChart",
    components: {
      ECharts
    },
    data() {
      return {
        options: {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [
            {
              name: "Pressure",
              type: "gauge",
              progress: {
                show: true
              },
              detail: {
                valueAnimation: true,
                formatter: "{value}"
              },
              data: [
                {
                  value: 50,
                  name: "SCORE"
                }
              ]
            }
          ]
        }
      }
    },
    methods: {
      SaveImage() {
        const linkSource = this.$refs.guagechart.getDataURL()
        const downloadLink = document.createElement("a")
        document.body.appendChild(downloadLink)
        downloadLink.href = linkSource
        downloadLink.target = "_self"
        downloadLink.download = "GuageChart.png"
        downloadLink.click()
      }
    }
  })
</script>

<style scoped></style>
