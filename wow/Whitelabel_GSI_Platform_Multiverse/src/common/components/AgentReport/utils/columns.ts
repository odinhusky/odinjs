export type AgentReportColumnDef = {
  name: string
  label: string
  field: string
  align: "center"
}

export const createAgentReportColumns = (t: (key: string) => string): AgentReportColumnDef[] => [
  { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" },
  {
    name: "member_count",
    label: t("member.membershipManagement.teamMember"),
    field: "member_count",
    align: "center"
  },
  { name: "currency_id", label: t("member.profile.currency"), field: "currency_id", align: "center" },
  {
    name: "bet_count",
    label: t("member.membershipManagement.teamBetNumber"),
    field: "bet_count",
    align: "center"
  },
  {
    name: "deposit",
    label: t("member.membershipManagement.teamDepositAmount"),
    field: "deposit",
    align: "center"
  },
  {
    name: "withdraw",
    label: t("member.membershipManagement.teamWithdrawalAmount"),
    field: "withdraw",
    align: "center"
  },
  {
    name: "bet_amount",
    label: t("member.membershipManagement.teamBetAmount"),
    field: "bet_amount",
    align: "center"
  },
  {
    name: "valid_bet",
    label: t("member.membershipManagement.teamValidBetAmount"),
    field: "valid_bet",
    align: "center"
  },
  {
    name: "prize",
    label: t("member.membershipManagement.teamPayoutAmount"),
    field: "prize",
    align: "center"
  },
  {
    name: "profit",
    label: t("member.membershipManagement.teamProfit"),
    field: "profit",
    align: "center"
  },
  { name: "ngr", label: t("member.membershipManagement.teamNGR"), field: "ngr", align: "center" },
  {
    name: "rate",
    label: t("member.membershipManagement.teamProfitRatio"),
    field: "rate",
    align: "center"
  },
  {
    name: "bonus",
    label: t("member.membershipManagement.teamActivityBonus"),
    field: "bonus",
    align: "center"
  },
  {
    name: "referral_click_count",
    label: t("member.membershipManagement.teamClickCount"),
    field: "referral_click_count",
    align: "center"
  },
  {
    name: "register_count",
    label: t("member.membershipManagement.teamRegisterCount"),
    field: "register_count",
    align: "center"
  },
  {
    name: "first_time_deposit_count",
    label: t("shareholder_platform.team_first_deposits"),
    field: "first_time_deposit_count",
    align: "center"
  }
]

export const createAgentReportPersonalSharedHeaders = (t: (key: string) => string) => [
  t("member.membershipManagement.orderQuantity"),
  t("menu.deposit"),
  t("menu.withdrawal"),
  t("tableHeader.bettingAmount"),
  t("tableHeader.validBetAmount"),
  t("common.payout"),
  t("member.referralRebate.profit"),
  "NGR",
  t("tableHeader.profitRatio"),
  t("tableHeader.activityBonus")
]

export const createAgentReportTeamSharedHeaders = (t: (key: string) => string) => [
  t("member.membershipManagement.teamBetNumber"),
  t("member.membershipManagement.teamDepositAmount"),
  t("member.membershipManagement.teamWithdrawalAmount"),
  t("member.membershipManagement.teamBetAmount"),
  t("member.membershipManagement.teamValidBetAmount"),
  t("member.membershipManagement.teamPayoutAmount"),
  t("member.membershipManagement.teamProfit"),
  t("member.membershipManagement.teamNGR"),
  t("member.membershipManagement.teamProfitRatio"),
  t("member.membershipManagement.teamActivityBonus")
]
