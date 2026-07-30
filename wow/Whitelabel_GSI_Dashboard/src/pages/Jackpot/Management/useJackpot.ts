import { ref, reactive, onMounted } from "vue"
import { useQuasar } from "quasar"
import { Enums } from "@/utils/constants/currency"

export interface JackpotPool {
  id: string
  currency: string
  contribution_rate: number
  payout_threshold: number
  is_enabled: boolean
  operator_id?: number
  created_at?: string
  updated_at?: string
  remark?: string
  current_amount?: number
}

export function useJackpot(initialLimit = 20) {
  const $q = useQuasar()
  const loading = ref(false)
  const totalSize = ref(0)
  const tableData = ref<JackpotPool[]>([])
  const queryForm = reactive({
    currency: null as string | null,
    status: null as boolean | null,
    page: 1,
    limit: initialLimit
  })

  const generateMockId = () => {
    return (Math.floor(Math.random() * 99) + 1).toString()
  }

  const generateMockData = (): JackpotPool[] => {
    const data: JackpotPool[] = []
    const currencies = Object.keys(Enums).filter((key) => isNaN(Number(key)))
    const usedIds = new Set<string>()

    const usedRates: Record<string, Set<number>> = {}
    const hasEnabled: Record<string, boolean> = {}

    const sampleRemarks = [
      "VIP Exclusive Pool - High Stakes",
      "Weekly Standard Pool",
      "Monthly Mega Jackpot Event",
      "New Year Special Promotion",
      "System Maintenance Backup",
      "Test Pool for New Features",
      "Low Tier Daily Drop",
      "Golden Dragon Festival Pool",
      "Summer Season Campaign",
      "Legacy Data Migration",
      "Operator A - Exclusive",
      "Operator B - Joint Venture",
      "Regional Specific - ASIA",
      "Weekend Bonus Multiplier",
      "Early Bird Special"
    ]

    const getRandomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    for (let i = 1; i <= 25; i++) {
      const currency = currencies[Math.floor(Math.random() * currencies.length)]

      if (!usedRates[currency]) {
        usedRates[currency] = new Set()
      }

      let rate = parseFloat((Math.random() * 5).toFixed(2))
      while (usedRates[currency].has(rate)) {
        rate = parseFloat((Math.random() * 5).toFixed(2))
      }
      usedRates[currency].add(rate)

      let isEnabled = false
      if (!hasEnabled[currency]) {
        if (Math.random() > 0.4) {
          isEnabled = true
          hasEnabled[currency] = true
        }
      }

      const now = new Date()
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(now.getMonth() - 3)

      const createdAtDate = getRandomDate(threeMonthsAgo, now)
      const updatedAtDate = getRandomDate(createdAtDate, now)

      const randomRemark = sampleRemarks[Math.floor(Math.random() * sampleRemarks.length)]

      let id = generateMockId()
      while (usedIds.has(id)) {
        id = generateMockId()
      }
      usedIds.add(id)

      data.push({
        id: id,
        currency: currency,
        contribution_rate: rate,
        payout_threshold: Math.floor(Math.random() * 1000000) + 10000,
        is_enabled: isEnabled,
        remark: `${randomRemark} (ID: ${id})`,
        current_amount: Math.floor(Math.random() * 500000),
        updated_at: updatedAtDate.getTime().toString(),
        operator_id: 1,
        created_at: createdAtDate.getTime().toString()
      })
    }
    return data
  }

  const mockData: JackpotPool[] = generateMockData()

  const fetchJackpotList = async () => {
    loading.value = true
    setTimeout(() => {
      let filtered = [...mockData]
      if (queryForm.currency) {
        filtered = filtered.filter((item) => item.currency === queryForm.currency)
      }
      if (queryForm.status !== null) {
        filtered = filtered.filter((item) => item.is_enabled === queryForm.status)
      }

      const start = (queryForm.page - 1) * queryForm.limit
      const end = start + queryForm.limit

      tableData.value = filtered.slice(start, end)
      totalSize.value = filtered.length

      loading.value = false
    }, 500)
  }

  const handleCreate = async (data: any) => {
    let newId = generateMockId()
    while (tableData.value.some((item) => item.id === newId)) {
      newId = generateMockId()
    }

    const newItem: JackpotPool = {
      id: newId,
      currency: data.currency!,
      contribution_rate: data.contribution_rate!,
      payout_threshold: data.payout_threshold!,
      is_enabled: !!data.is_enabled!,
      remark: data.remark!,
      current_amount: 0,
      updated_at: Date.now().toString(),
      operator_id: 1,
      created_at: Date.now().toString()
    }

    mockData.unshift(newItem)
    fetchJackpotList()

    $q.notify({
      type: "positive",
      message: "Jackpot Pool created successfully",
      position: "top"
    })
  }

  const handleUpdate = async (data: any) => {
    const index = mockData.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      mockData[index] = {
        ...mockData[index],
        currency: data.currency!,
        contribution_rate: data.contribution_rate!,
        payout_threshold: data.payout_threshold!,
        is_enabled: data.is_enabled!,
        remark: data.remark!,
        updated_at: Date.now().toString()
      }
    }

    fetchJackpotList()

    $q.notify({
      type: "positive",
      message: "Jackpot Pool updated successfully",
      position: "top"
    })
  }

  const handleDelete = async (data: JackpotPool) => {
    const index = mockData.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      mockData.splice(index, 1)
    }

    fetchJackpotList()

    $q.notify({
      type: "positive",
      message: "Jackpot Pool deleted successfully",
      position: "top"
    })
  }

  const switchState = reactive({
    master: true,
    payout: true
  })

  const updateSwitchState = async (data: { master: boolean; payout: boolean }) => {
    switchState.master = data.master
    switchState.payout = data.payout
    return Promise.resolve(true)
  }

  return {
    loading,
    totalSize,
    tableData,
    queryForm,
    switchState,
    fetchJackpotList,
    handleCreate,
    handleUpdate,
    handleDelete,
    updateSwitchState
  }
}
