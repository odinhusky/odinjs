/** VIP 開關 */
export enum VIP_REWARDS_SWITCH_ENUMS {
  /** 關閉 */
  DISABLE = 0,

  /** 開啟 */
  ENABLE = 1
}

export const VIP_REWARD_SWITCH_I18N_KEYS: Record<VIP_REWARDS_SWITCH_ENUMS, string> = {
  [VIP_REWARDS_SWITCH_ENUMS.DISABLE]: "common.disable",
  [VIP_REWARDS_SWITCH_ENUMS.ENABLE]: "common.enable"
}
