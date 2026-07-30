import { defineStore } from "pinia"
import * as Response from "src/api/response.type"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed } from "vue"
import { KYC_ENABLED, KYC_VERIFIED } from "src/common/utils/constants"

export const useUserInfoStore = defineStore("useInfoStore", {
  state: () => {
    return {
      info: {} as Response.UserInfo,
      info2: {} as Response.GetUserInfo,
      account: { self_exclusion_at: null } as Response.AccountInfo,
      walletList: [] as Response.UserWalletList,
      loginByUserClick: false,
      login_at: 0,
      bet_historys: [] as Response.UserBetHistoryTotalItem[],
      remark: "",
      levelList: [] as Response.UserLevelsInfo,
      kycStatus: KYC_VERIFIED.Enums.VERIFICATION_STATUS_PENDING as KYC_VERIFIED.Enums | number,
      kyc: [] as Response.UserKycList,
      kycEnabled: KYC_ENABLED.Enums.DISABLE,
      memberSummary: {} as Response.GetMemberSummary,
      activeWalletChangeFuncList: [] as Array<() => void | Promise<void>>
    }
  },
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info.username = userInfo.username
      this.info.real_name = userInfo.real_name
      this.info.nickname = userInfo.nickname
      this.info.email = userInfo.email
      this.info.phone = userInfo.phone
      this.info.gender = userInfo.gender
      this.info.date_of_birth = userInfo.date_of_birth ? dateformat(userInfo.date_of_birth) : ""
      this.info.invite_code = userInfo.invite_code
      this.info.contact = userInfo.contact
      this.info.empty_password = userInfo.empty_password
      this.info.member_level = userInfo.member_level
      this.info.has_withdrawal_password = userInfo.has_withdrawal_password
      this.info.avatar_path = userInfo.avatar_path
      this.info.show_avatar = userInfo.show_avatar //頭像顯示隱藏
      this.info.approval_status = userInfo.approval_status
      this.info.login_provider = userInfo.login_provider
      this.info.is_member_agent = userInfo.is_member_agent
    },
    setStoreUserInfo2(userInfo: Response.GetUserInfo) {
      for (const key in userInfo) {
        const userInfoKey = key as keyof Response.GetUserInfo
        ;(this.info2[userInfoKey] as string | number | boolean | null | undefined) = userInfo[userInfoKey]
      }
    },
    async setStoreAccountInfo(userInfo: Response.AccountInfo) {
      for (const key in userInfo) {
        const userInfoKey = key as keyof Response.GetUserInfo
        ;(this.account[userInfoKey] as string | number | boolean | null) = userInfo[userInfoKey]
      }
    },
    setUserBetHistoryTotal(data: Response.GetUserBetHistoryTotal) {
      this.login_at = data.login_at
      this.bet_historys.length = 0
      if (Array.isArray(data.bet_historys)) {
        this.bet_historys.push(...data.bet_historys)
      }
    },
    setStoreUserWalletList(walletList: Response.UserWalletList) {
      this.walletList.length = 0
      walletList?.forEach((wallet) => {
        this.walletList.push(wallet)
      })
    },
    setStoreUserRemark(remark: string) {
      this.remark = remark
    },
    setKycStatus(status: KYC_VERIFIED.Enums | number) {
      // API 返回的 status 可能是 number 類型，需要轉換為枚舉值
      // 確保值是有效的枚舉值（0-5），枚舉值本質上是數字
      const statusValue =
        typeof status === "number" && status >= 0 && status <= 5
          ? status
          : KYC_VERIFIED.Enums.VERIFICATION_STATUS_NOT_STARTED

      // 使用 $state 直接訪問原始狀態，避免 Pinia proxy 類型檢查問題
      this.$state.kycStatus = statusValue as KYC_VERIFIED.Enums
    },
    setStoreUserKyc(kyc: Response.UserKycList) {
      this.kyc = kyc
    },
    setKycEnabled(settings: Response.ISetting) {
      if ("member_kyc_verify" in settings) {
        this.kycEnabled = settings.member_kyc_verify
      }
    },
    setStoreLevelsInfo(levelList: Response.UserLevelsInfo) {
      this.levelList.length = 0
      levelList.forEach((level) => {
        this.levelList.push(level)
      })
    },
    setLoginByUserClick(status: boolean) {
      this.loginByUserClick = status
    },
    setMemberSummary(summary: Response.GetMemberSummary) {
      this.memberSummary = summary
    },
    registerActiveWalletChangeFunc(func: () => void | Promise<void>) {
      if (typeof func !== "function") {
        console.error("registerActiveWalletChangeFunc 收到非 func 參數:", func)
        return
      }
      this.activeWalletChangeFuncList.push(func)
    },
    unregisterActiveWalletChangeFunc(func: () => void | Promise<void>) {
      const index = this.activeWalletChangeFuncList.indexOf(func)
      if (index > -1) {
        this.activeWalletChangeFuncList.splice(index, 1)
      } else {
        console.warn(`未找到要取消的函數: ${func}`)
      }
    },
    async executeActiveWalletChangeFunc() {
      // 過濾掉無效的函數
      const validFuncs = this.activeWalletChangeFuncList.filter((func) => typeof func === "function")

      if (validFuncs.length === 0) {
        console.warn("沒有有效的 func 需要執行")
        return
      }

      // 將要執行的 function 一一執行
      for (const func of validFuncs) {
        try {
          await func()
        } catch (error) {
          console.error("執行 active wallet callback func 時發生錯誤:", error)
        }
      }
    }
  },
  getters: {
    userInfo: (state) => state.info,
    userInfo2: (state) => state.info2,
    accountInfo: (state) => state.account,
    lastLoginTime: (state) => state.login_at,
    winLoseList: (state) => state.bet_historys,
    userWalletList: (state) => state.walletList,
    userLevelsInfo: (state) => state.levelList,
    userRemark: (state) => state.remark,
    userKyc: (state) => state.kyc,
    isKycVerified: (state) => state.kycStatus === KYC_VERIFIED.Enums.VERIFICATION_STATUS_VERIFIED,
    isKycEnabled: (state) => state.kycEnabled === KYC_ENABLED.Enums.ENABLE
  },
  persist: false
})
