import { ref, reactive } from "vue"
import { useQuasar } from "quasar"
import { Enums } from "@/utils/constants/currency"

export enum JackpotClaimStatus {
  Pending = 0,
  Claimed = 1,
  Failed = 2
}

export enum JackpotAuditStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export const claimStatusOptions = [
  { label: "jackpotWinningRecords.claim_status_pending", value: JackpotClaimStatus.Pending },
  { label: "jackpotWinningRecords.claim_status_claimed", value: JackpotClaimStatus.Claimed },
  { label: "jackpotWinningRecords.claim_status_failed", value: JackpotClaimStatus.Failed }
]

export const auditStatusOptions = [
  { label: "jackpotWinningRecords.audit_status_pending", value: JackpotAuditStatus.Pending },
  { label: "jackpotWinningRecords.audit_status_approved", value: JackpotAuditStatus.Approved },
  { label: "jackpotWinningRecords.audit_status_rejected", value: JackpotAuditStatus.Rejected }
]

export interface JackpotWinningRecord {
  id: string
  winning_code: string
  pool_id: string
  agent_id: number
  agent_code: string
  member_account: string
  sales_id: number
  channel_code: string
  currency: string
  provider_id: number
  provider_line_id: number
  provider_product_id: number
  winning_amount: number
  trigger_wager_code: string
  status: number // Audit Status
  audit_operator_id: number
  audit_at: string
  audit_remark: string
  claim_status: number
  claimed_at: string
  claim_transaction_code: string
  claim_retry_count: number
  last_claim_error: string
  currency_contribution_rate: number
  currency_payout_threshold: number
  currency_contribution_amount: number
  expire_at: string
  won_at: string
  created_at: string
  updated_at: string
}

export function useJackpotWinningRecords(initialLimit = 10) {
  const $q = useQuasar()
  const loading = ref(false)
  const totalSize = ref(0)
  const tableData = ref<JackpotWinningRecord[]>([])
  const queryForm = reactive({
    currency: null as string | null,
    claim_status: null as number | null,
    audit_status: null as number | null,
    claim_transaction_code: null as string | null,
    member_account: null as string | null,
    wager_code: null as string | null,
    start: undefined as number | undefined,
    end: undefined as number | undefined,
    page: 1,
    limit: initialLimit
  })

  const generateMockId = () => {
    return (Math.floor(Math.random() * 9000) + 1000).toString()
  }

  const generateRandomCode = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateMockData = (): JackpotWinningRecord[] => {
    const data: JackpotWinningRecord[] = []
    const currencies = Object.keys(Enums).filter((key) => isNaN(Number(key)))
    const usedIds = new Set<string>()

    const agentCodes = ["GSC1", "GSC2", "GSC3", "AGT001", "AGT002"]
    const channelCodes = ["efnf", "web", "mobile", "app", "desktop"]
    const memberAccounts = [
      "ashuitest01",
      "player123",
      "vipuser99",
      "testaccount",
      "member456",
      "luckyplayer",
      "golduser",
      "silverplayer"
    ]

    const getRandomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    for (let i = 1; i <= 50; i++) {
      const currency = currencies[Math.floor(Math.random() * currencies.length)]

      const now = new Date()
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(now.getMonth() - 3)

      const wonAtDate = getRandomDate(threeMonthsAgo, now)
      const auditStatus = Math.floor(Math.random() * 3) // 0: pending, 1: approved, 2: rejected

      let claimStatus: number
      if (auditStatus === JackpotAuditStatus.Approved) {
        claimStatus = Math.floor(Math.random() * 3)
      } else {
        claimStatus = JackpotClaimStatus.Pending
      }

      let claimedAtDate = wonAtDate
      if (claimStatus === 1) {
        claimedAtDate = getRandomDate(wonAtDate, now)
      }

      const expireAtDate = new Date(wonAtDate)
      expireAtDate.setDate(expireAtDate.getDate() + 30) // 30 days to claim

      let id = generateMockId()
      while (usedIds.has(id)) {
        id = generateMockId()
      }
      usedIds.add(id)

      const winningAmount = Math.floor(Math.random() * 1000000) + 100
      const contributionRate = parseFloat((Math.random() * 5).toFixed(2))
      const contributionAmount = Math.floor(winningAmount * (contributionRate / 100))

      data.push({
        id: id,
        winning_code: generateRandomCode(22),
        pool_id: (Math.floor(Math.random() * 50) + 1).toString(),
        agent_id: Math.floor(Math.random() * 5000) + 1000,
        agent_code: agentCodes[Math.floor(Math.random() * agentCodes.length)],
        member_account: memberAccounts[Math.floor(Math.random() * memberAccounts.length)],
        sales_id: Math.floor(Math.random() * 100),
        channel_code: channelCodes[Math.floor(Math.random() * channelCodes.length)],
        currency: currency,
        provider_id: Math.floor(Math.random() * 100) + 1,
        provider_line_id: Math.floor(Math.random() * 50) + 1,
        provider_product_id: Math.floor(Math.random() * 100) + 1,
        winning_amount: winningAmount,
        trigger_wager_code: generateRandomCode(22),
        status: auditStatus,
        audit_operator_id: auditStatus > 0 ? Math.floor(Math.random() * 100) + 1 : 0,
        audit_at: auditStatus > 0 ? claimedAtDate.getTime().toString() : "0",
        audit_remark: auditStatus === 2 ? "Suspicious activity detected" : "",
        claim_status: claimStatus,
        claimed_at: claimStatus === 1 ? claimedAtDate.getTime().toString() : "0",
        claim_transaction_code: claimStatus === 1 ? generateRandomCode(20) : "",
        claim_retry_count: claimStatus === 2 ? Math.floor(Math.random() * 5) : 0,
        last_claim_error: claimStatus === 2 ? "Insufficient balance in pool" : "",
        currency_contribution_rate: contributionRate,
        currency_payout_threshold: Math.floor(Math.random() * 10000) + 100,
        currency_contribution_amount: contributionAmount,
        expire_at: expireAtDate.getTime().toString(),
        won_at: wonAtDate.getTime().toString(),
        created_at: wonAtDate.getTime().toString(),
        updated_at: claimedAtDate.getTime().toString()
      })
    }

    return data.sort((a, b) => parseInt(b.created_at) - parseInt(a.created_at))
  }

  const mockData: JackpotWinningRecord[] = generateMockData()

  const fetchWinningRecords = async () => {
    loading.value = true
    setTimeout(() => {
      let filtered = [...mockData]

      if (queryForm.currency) {
        filtered = filtered.filter((item) => item.currency === queryForm.currency)
      }

      if (queryForm.claim_status !== null) {
        filtered = filtered.filter((item) => item.claim_status === queryForm.claim_status)
      }

      if (queryForm.audit_status !== null) {
        filtered = filtered.filter((item) => item.status === queryForm.audit_status)
      }

      if (queryForm.claim_transaction_code) {
        filtered = filtered.filter((item) => item.claim_transaction_code.includes(queryForm.claim_transaction_code!))
      }

      if (queryForm.member_account) {
        filtered = filtered.filter((item) => item.member_account.includes(queryForm.member_account!))
      }

      if (queryForm.wager_code) {
        filtered = filtered.filter((item) => item.trigger_wager_code.includes(queryForm.wager_code!))
      }

      if (queryForm.start && queryForm.end) {
        filtered = filtered.filter((item) => {
          const createdAt = parseInt(item.created_at)
          return createdAt >= queryForm.start! && createdAt <= queryForm.end!
        })
      }

      const start = (queryForm.page - 1) * queryForm.limit
      const end = start + queryForm.limit

      tableData.value = filtered.slice(start, end)
      totalSize.value = filtered.length

      loading.value = false
    }, 500)
  }

  const handleApproval = async (record: JackpotWinningRecord) => {
    const index = mockData.findIndex((item) => item.id === record.id)
    if (index !== -1) {
      mockData[index] = {
        ...mockData[index],
        status: 1, // Approved
        audit_operator_id: 1,
        audit_at: Date.now().toString(),
        updated_at: Date.now().toString()
      }
    }

    fetchWinningRecords()

    $q.notify({
      type: "positive",
      message: "Winning record approved successfully",
      position: "top"
    })
  }

  const handleReject = async (record: JackpotWinningRecord, remark: string) => {
    const index = mockData.findIndex((item) => item.id === record.id)
    if (index !== -1) {
      mockData[index] = {
        ...mockData[index],
        status: 2, // Rejected
        claim_status: JackpotClaimStatus.Pending, // Ensure claim status is Pending
        audit_operator_id: 1,
        audit_at: Date.now().toString(),
        audit_remark: remark,
        updated_at: Date.now().toString()
      }
    }

    fetchWinningRecords()

    $q.notify({
      type: "positive",
      message: "Winning record rejected",
      position: "top"
    })
  }

  return {
    loading,
    totalSize,
    tableData,
    queryForm,
    fetchWinningRecords,
    handleApproval,
    handleReject
  }
}
