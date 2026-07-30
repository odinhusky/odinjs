<template>
  <q-page padding>
    <q-card>
      <div class="three-col-grid q-pa-lg">
        <div class="card-area text-center q-pa-sm">
          <div class="q-pb-xs">未解決工單</div>
          <div class="font red">110</div>
        </div>
        <div class="card-area text-center q-pa-sm">
          <div class="q-pb-xs">今日新增</div>
          <div class="font green">110</div>
        </div>
        <div class="text-center q-pa-sm">
          <div class="q-pb-xs">未分派</div>
          <div class="font blue">2</div>
        </div>
      </div>
    </q-card>
    <div class="q-pb-sm">
      <table-visits :title="'今日流量排行'" :columns="columns1" />
    </div>

    <card-charts />
  </q-page>
</template>

<script lang="ts">
  import { defineComponent, defineAsyncComponent, ref } from "vue"

  export default defineComponent({
    name: "RealTimeData",
    components: {
      TableVisits: defineAsyncComponent(() => import("components/tables/TableVisits.vue")),
      CardCharts: defineAsyncComponent(() => import("components/cards/CardCharts.vue"))
    },
    setup() {
      const columns1: any = ref([
        {
          name: "masterAgentname",
          align: "left",
          label: "總代名稱",
          field: "masterAgentName",
          sortable: false
        },
        {
          name: "operatorName",
          align: "left",
          label: "站點名稱",
          field: "operatorName",
          sortable: false
        },
        {
          name: "desc",
          required: true,
          label: "未解決",
          align: "left",
          field: (row: any) => row.name,
          sortable: false
        },
        {
          name: "date",
          align: "left",
          label: "今日新增",
          field: (row: any) => row.name,
          sortable: false
        },
        {
          name: "date",
          align: "left",
          label: "未分派",
          field: (row: any) => row.name,
          sortable: false
        }
      ])
      return {
        columns1
      }
    }
  })
</script>

<style scoped>
  .three-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media screen and (max-width: 600px) {
    .three-col-grid {
      grid-template-columns: 1fr;
    }

    .card-area {
      box-shadow: rgba(99, 99, 99, 0.07) 0px 2px 0px 0px !important;
    }
  }

  .card-area {
    box-shadow: rgba(99, 99, 99, 0.07) 2px 0px 0px 0px;
  }

  .bold {
    font-weight: 600;
  }

  .font {
    font-size: 24px;
    font-weight: 500;
  }

  .red {
    color: #ff9191;
  }

  .green {
    color: #b7eb8f;
  }

  .blue {
    color: #91caff;
  }
</style>
