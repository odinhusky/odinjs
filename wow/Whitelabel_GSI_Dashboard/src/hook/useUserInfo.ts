import { computed } from "vue"
import { useUserInfoStore } from "src/stores/userInfoStore"

export function useUserInfo() {
  const userInfo = useUserInfoStore()

  const useAnibetGenetalAgents = ["anib"]
  const useAnibetAgents = ["anip"]
  const useAMUSEVIP = ["samj"]
  const useGSI1 = ["gsi1"]
  const stagingIds = ["gsi1", "r017"]
  const developIds = ["gsai"]

  const isAnibetGeneralAgent = computed(() =>
    useAnibetGenetalAgents.includes(userInfo.generalAgentId.toLocaleLowerCase())
  )
  const isAnibetAgent = computed(() => useAnibetAgents.includes(userInfo.agentId.toLocaleLowerCase()))
  const isAMUSEVIP = computed(() => useAMUSEVIP.includes(userInfo.agentId.toLocaleLowerCase()))
  const isGSI1 = computed(() => useGSI1.includes(userInfo.agentId.toLocaleLowerCase()))
  const isStagingId = computed(() => stagingIds.includes(userInfo.agentId.toLocaleLowerCase()))
  const isdevelopId = computed(() => developIds.includes(userInfo.agentId.toLocaleLowerCase()))

  return {
    /** userInfo stroe */
    userInfo,

    /** 是否為anibet總代理 */
    isAnibetGeneralAgent,

    /** 是否為anibet代理 */
    isAnibetAgent,

    /** 是否為amusevip代理 */
    isAMUSEVIP,

    /** 是否為gsi1代理 */
    isGSI1,

    /** 是否為staging代理 */
    isStagingId,

    /** 是否為develop代理 */
    isdevelopId
  }
}
