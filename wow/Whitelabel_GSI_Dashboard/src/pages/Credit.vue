<template>
  <q-page class="q-pa-sm">
    <tables-basic v-if="tableData" :table-column="tableColumn" :loading="spinShow" :table-data="tableData" />
  </q-page>
</template>

<script>
  import { defineComponent, defineAsyncComponent, ref, watch, onMounted } from "vue"
  import { getCreditList } from "../api/credit.ts"
  import { useSearchCondition } from "../hook/searchCondition"
  import { useSearch } from "../hook/useSearch"

  export default defineComponent({
    name: "TablesPage",
    components: {
      TablesBasic: defineAsyncComponent(() => import("components/tables/TableBasic.vue"))
    },
    setup() {
      let { spinShow, data: tableData, search } = useSearch(getCreditList)
      // [說明] searchBaseData為全頁面都有的參數 ,  searchFormInitData 為該頁面多出來的搜尋條件(非共用)
      let { searchBaseData, addSearchCondition } = useSearchCondition()
      let searchFormInitData = ref({
        // search_type: '',
        // status: '',
      })

      const tableColumn = [
        {
          name: "agent_code",
          required: true,
          label: "代理代碼",
          align: "left",
          field: (row) => row.agent_code,
          format: (val) => `${val}`,
          sortable: false
        },
        {
          name: "agent_account",
          required: true,
          label: "代理帳號",
          align: "left",
          field: (row) => row.agent_account,
          format: (val) => `${val}`,
          sortable: false
        },
        {
          name: "agent_nickname",
          required: true,
          label: "代理名稱",
          align: "left",
          field: (row) => row.agent_nickname,
          format: (val) => `${val}`,
          sortable: false
        },
        {
          name: "currency",
          required: true,
          label: "幣種",
          align: "left",
          field: (row) => row.currency,
          format: (val) => `${val}`,
          sortable: false
        },
        {
          name: "score",
          required: true,
          label: "額度",
          align: "left",
          field: (row) => row.score,
          format: (val) => `${val}`,
          sortable: false
        },
        {
          name: "creator",
          required: true,
          label: "申請人",
          align: "left",
          field: (row) => row.creator,
          format: (val) => `${val}`,
          sortable: false
        }
      ]

      // 初始化資料
      const init = async () => {
        await search(searchBaseData.value)
        // await getPlatformDropdownList().then(res => platformDropdownList.value = res.data)
        // await getMemberTagDropdownList().then(res => labelListDropdownList.value = res.data)
      }

      const fetch = () => {
        search(searchBaseData.value)
      }

      onMounted(async () => {
        await init()
      })

      watch(
        () => searchFormInitData,
        () => {
          addSearchCondition(searchFormInitData.value)
        },
        {
          deep: true,
          immediate: true
        }
      )

      watch(
        () => searchBaseData.value.offset,
        () => search(searchBaseData.value)
      )

      return {
        fetch,
        spinShow,
        searchBaseData,
        tableColumn,
        tableData,
        searchFormInitData
      }
    }
  })
</script>

<style></style>
