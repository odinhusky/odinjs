import { computed } from "vue"
import { useEnv } from "src/common/hooks/useEnv"

// 想要和 GOG 相同邏輯的代理商，可以在此擴充
const GOG_AGENTS = ["gog1", "8888", "gogd", "hai1"]
const RYSM_AGENTS = ["rys1"]
const BXM9_AGENTS = ["9bx1"]
const AGLM_AGENTS = ["agl1"]
const A99M_AGENTS = [
  "a991",
  "dobr",
  "a902",
  "a903",
  "a904",
  "a905",
  "a906",
  "a907",
  "a908",
  "a909",
  "a910",
  "a911",
  "a912",
  "a913",
  "a914",
  "a915",
  "a916",
  "a917",
  "a918",
  "a919",
  "a920"
]
const NBL1_AGENTS = ["nbl1"]
const NS4M_AGENTS = ["ns41", "obrb"]
const PHBM_AGENTS = ["phb1"]
const W01M_AGENTS = ["w001", "obbd"]
const W02M_AGENTS = ["w002"]
const F03M_AGENTS = ["f003"]
const W04M_AGENTS = ["w004"]
const W05M_AGENTS = ["w005"]
const F06M_AGENTS = ["f006"]
const W07M_AGENTS = ["w007"]
const W08M_AGENTS = ["w008"]
const W09M_AGENTS = ["w009"]
const G01M_AGENTS = ["g001"]
const F11M_AGENTS = ["f011"]
const FA11_AGENTS = ["fa11"]
const W12M_AGENTS = ["w012"]
const F13M_AGENTS = ["f013"]
const FA21_AGENTS = ["fa21"]
const SITS_AGENTS = ["gsi1", "r017"]
const BLYM_AGENTS = ["bly1"]
const NOVM_AGENTS = ["nov1"]
const IF91_AGENTS = ["if91"]
const BCYM_AGENTS = ["bcy1"]
const ZPL1_AGENTS = ["zpl1"]
const ARG1_AGENTS = ["arg1"]
const BBF1_AGENTS = ["bbf1"]

// 想要切換 CNY 為 USDT 的代理商，可以在此擴充
const CNY_TO_USDT_AGENTS = [...GOG_AGENTS]

// 強制不要將 IDR 轉為 EUR 的網址（即使 agentCode 命中 IDR_TO_EUR_AGENTS 也維持顯示 IDR）
const IDR_TO_EUR_DISABLED_HOSTS = [
  "demo1.playsoft88.com",
  "demo2.playsoft88.com",
  "demo1.psps8asia.com",
  "demo2.psps8asia.com",
  "demo1.ps8asia.com",
  "demo2.ps8asia.com"
]

// 想要切換 IDR 為 EUR 的代理商，可以在此擴充
const IDR_TO_EUR_AGENTS = [
  ...W01M_AGENTS,
  ...W02M_AGENTS,
  ...F03M_AGENTS,
  ...W04M_AGENTS,
  ...W05M_AGENTS,
  ...F06M_AGENTS,
  ...W07M_AGENTS,
  ...W08M_AGENTS,
  ...W09M_AGENTS,
  ...G01M_AGENTS,
  ...F11M_AGENTS,
  ...W12M_AGENTS,
  ...F13M_AGENTS,
  ...SITS_AGENTS
]

// 共用檢查
// agentList: 代理商清單 **全部小寫**
const checkAgentCode = (options: { agentList: string[]; agentCode: string }) => {
  try {
    if (!options || !options.agentCode) {
      console.warn(`agent code: ${options.agentCode} not found.`)
      return false
    }
    return options.agentList.includes(options.agentCode.toLowerCase())
  } catch (error) {
    console.error(error)
    return false
  }
}

export function useAgentCode() {
  const { envData } = useEnv()
  // 沒拿到 agentCode 則預設為空字串
  const { agentCode = "" } = envData()

  const isCNYToUSDT = computed(() =>
    checkAgentCode({
      agentList: CNY_TO_USDT_AGENTS,
      agentCode
    })
  )

  const isIDRToEUR = computed(() => {
    // 指定網址強制顯示 IDR（不轉為 EUR）
    if (typeof window !== "undefined" && IDR_TO_EUR_DISABLED_HOSTS.includes(window.location.hostname)) {
      return false
    }
    return checkAgentCode({
      agentList: IDR_TO_EUR_AGENTS,
      agentCode
    })
  })

  const isGOG = computed(() => checkAgentCode({ agentList: GOG_AGENTS, agentCode }))
  const isRYSM = computed(() => checkAgentCode({ agentList: RYSM_AGENTS, agentCode }))
  const isBXM9 = computed(() => checkAgentCode({ agentList: BXM9_AGENTS, agentCode }))
  const isAGLM = computed(() => checkAgentCode({ agentList: AGLM_AGENTS, agentCode }))
  const isA99M = computed(() => checkAgentCode({ agentList: A99M_AGENTS, agentCode }))
  const isNBL1 = computed(() => checkAgentCode({ agentList: NBL1_AGENTS, agentCode }))
  const isNS4M = computed(() => checkAgentCode({ agentList: NS4M_AGENTS, agentCode }))
  const isPHBM = computed(() => checkAgentCode({ agentList: PHBM_AGENTS, agentCode }))
  const isBLYM = computed(() => checkAgentCode({ agentList: BLYM_AGENTS, agentCode }))
  const isNOVM = computed(() => checkAgentCode({ agentList: NOVM_AGENTS, agentCode }))
  const isIF91 = computed(() => checkAgentCode({ agentList: IF91_AGENTS, agentCode }))
  const isFA11 = computed(() => checkAgentCode({ agentList: FA11_AGENTS, agentCode }))
  const isFA21 = computed(() => checkAgentCode({ agentList: FA21_AGENTS, agentCode }))
  const isFA1M = computed(() => checkAgentCode({ agentList: FA11_AGENTS, agentCode }))
  const isFA2M = computed(() => checkAgentCode({ agentList: FA21_AGENTS, agentCode }))
  const isBCYM = computed(() => checkAgentCode({ agentList: BCYM_AGENTS, agentCode }))
  const isZPL1 = computed(() => checkAgentCode({ agentList: ZPL1_AGENTS, agentCode }))
  const isARG1 = computed(() => checkAgentCode({ agentList: ARG1_AGENTS, agentCode }))
  const isBBF1 = computed(() => checkAgentCode({ agentList: BBF1_AGENTS, agentCode }))
  /// 傳入agentCodeList 只要符合當前 agentCode 則返回 true
  const allowAgentCodes = (agentCodeList: Array<string>) => {
    return agentCodeList.find((code: string) => code.toLowerCase() === agentCode.toLowerCase()) !== undefined
  }

  const currentAgentCode = computed(() => {
    return agentCode
  })

  return {
    isCNYToUSDT,
    isIDRToEUR,
    isGOG,
    isRYSM,
    isBXM9,
    isAGLM,
    isA99M,
    isNBL1,
    isNS4M,
    isPHBM,
    isBLYM,
    isNOVM,
    isIF91,
    isFA11,
    isFA21,
    isFA1M,
    isFA2M,
    isBCYM,
    isZPL1,
    isARG1,
    isBBF1,
    currentAgentCode,
    allowAgentCodes
  }
}
