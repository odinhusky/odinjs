// useTable.ts
import { ref, onMounted, watch } from "vue"

interface FetchDataResult {
  results: any[]
  total: number
}

export default function useTable(
  fetchDataFunction: (params: { offset: number; limit: number }) => Promise<FetchDataResult>
) {
  const loading = ref(false)
  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const currentPageSize = ref(5)
  const totalSize = ref(0)

  const handlePageUpdate = (newPage: number) => {
    currentPage.value = newPage
    fetchTableData()
  }

  const handlePageSizeUpdate = (newPageSize: number) => {
    if (newPageSize !== currentPageSize.value) {
      currentPageSize.value = newPageSize
      currentPage.value = 1 // Reset to the first page when page size changes
      fetchTableData()
    }
  }

  const fetchTableData = async () => {
    loading.value = true
    try {
      const data = await fetchDataFunction({
        offset: (currentPage.value - 1) * currentPageSize.value,
        limit: currentPageSize.value
      })
      if (data && Array.isArray(data.results)) {
        tableData.value = data.results
        totalSize.value = data.total
      } else {
        console.error("Data fetched does not have the expected structure:", data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    loading.value = false
  }

  onMounted(fetchTableData)

  // Watch the currentPage and currentPageSize and fetch data on change
  watch([currentPage, currentPageSize], fetchTableData)

  return {
    loading,
    tableData,
    currentPage,
    currentPageSize,
    totalSize,
    handlePageUpdate,
    handlePageSizeUpdate,
    fetchTableData
  }
}
