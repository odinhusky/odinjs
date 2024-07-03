import {ExternelEndpoint} from "../../../types";
import {
  GET_USER_INVITE_CONFIG_URL,
  GET_USER_INVITE_DAILY_REPORT_DATA_URL,
  GET_USER_INVITE_REWARD_DATA_URL,
  GET_USER_INVITE_REWARD_RECORD_LIST_URL,
  GET_USER_INVITE_UNSETTLE_REWARD_DATA_URL
} from "../../../ApiUrl";


type EmptyRequest = {
  //
};

type GetInviteConfigRequestData = {
  id: number;
  proxyType: number;
  firstRecharge: number;
  bindReward: number;
  level1FlowRate: number;
  level2FlowRate: number;
  level3FlowRate: number;
  level1RewdRate: string;
  level2RewdRate: string;
  level3RewdRate: string;
  fbFlag: number;
  googleFlag: number;
  phoneFlag: number;
  level1RewdRateDisplay: any;
  jobPeriod: number;
  firstRechargeLevel: string;
  level1FlowRateDisplay: number;
  level2FlowRateDisplay: number;
  level3FlowRateDisplay: number;
  level2RewdRateDisplay: any;
  level3RewdRateDisplay: any;
  invitationFlag: number;
};

type GetInviteConfigResponse = {
  code: number;
  msg: any;
  data: GetInviteConfigRequestData;
  total: 0;
};

const GetUserInviteConfigEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetInviteConfigResponse,
  EmptyRequest
>({
  query: (query: EmptyRequest) => ({
    method: 'get',
    url: GET_USER_INVITE_CONFIG_URL,
    params: query,
  }),
})

// 已結算的團隊獎勵
type GetInviteRewardDataResponse = {
  code: number;
  msg: any;
  data: {
    userId: number; // 用户编号
    inviteId: number; // 弃用
    reward: number; // 团队总奖励
    reward1: number;  // 一级总奖励
    reward2: number;  // 二级总奖励
    reward3: number;  // 三级总奖励
    rewd: number; // 团队充提差
    rewdReward: number; // 团队充提差奖励
    bindReward: number; // 团队注册奖励
    firstRechargeReward: number; // 团队首充奖励
    firstRechargeReward2: any;
    rechargeAmount: number; // 团队充值金额
    recharge1Amount: any;
    recharge1AvgAmount?:number; // 一级邀请的平均充值金額，單位分
    withdrawAmount: number; // 团队提现金额
    withdraw1Amount: any;
    flow: number; // 团队流水
    flowReward: number; // 团队流水奖励
    flow1: number;  // 一级流水
    flow1Reward: number;  // 一级流水奖励
    rewd1: number;  // 一级充提差
    rewd1Reward: number;  // 一级充提差奖励
    flow2: number;  // 二级流水
    flow2Reward: number;  // 二级流水奖励
    flow3: number;  // 三级流水
    flow3Reward: number;  // 三级流水奖励
    recharge2Amount: number;  // 二级充值金额
    recharge3Amount: number;  // 三级充值金额
    withdraw2Amount: number;  // 二级提现金额
    withdraw3Amount: number;  // 三级提现金额
    rewd2: number;  // 二级充提差
    rewd3: number;  // 三级充提差
    rewd2Reward: number;  // 二级充提差奖励
    rewd3Reward: number;  // 三级充提差奖励
    num1: number; // 一级人数
    num2: number; // 二级人数
    num3: number; // 三级人数
    num: number;  // 团队人数
    numRecharge: number;  // 团队充值人数
    num1Recharge: number; // 一级充值人数
    num2Recharge: number; // 二级充值人数
    num3Recharge: number; // 三级充值人数
    inviteUrl: string;
    inviteDsUrl: string;
    proxyType: number;
    boxReward: number;
    nextSettleDate: string;
    nowTime: string;
    selfWithdrawAmount: number;
  };
  total: number;
};

const GetUserInviteRewardDataEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetInviteRewardDataResponse,
  EmptyRequest
>({
  query: (query: EmptyRequest) => ({
    method: 'get',
    url: GET_USER_INVITE_REWARD_DATA_URL,
    params: query,
  }),
})

// 未結算的團隊獎勵
type GetUnsettleInviteRewardDataResponse = {
  code: number;
  msg: any;
  data: {
    userId: number; // 用户编号
    inviteId: number; // 弃用
    reward: number; // 团队总奖励
    reward1: number;  // 一级总奖励
    reward2: number;  // 二级总奖励
    reward3: number;  // 三级总奖励
    rewd: number; // 团队充提差
    rewdReward: number; // 团队充提差奖励
    bindReward: number; // 团队注册奖励
    firstRechargeReward: number; // 团队首充奖励
    firstRechargeReward2: any;
    rechargeAmount: number; // 团队充值金额
    recharge1Amount: any;
    withdrawAmount: number; // 团队提现金额
    withdraw1Amount: any;
    flow: number; // 团队流水
    flowReward: number; // 团队流水奖励
    flow1: number;  // 一级流水
    flow1Reward: number;  // 一级流水奖励
    rewd1: number;  // 一级充提差
    rewd1Reward: number;  // 一级充提差奖励
    flow2: number;  // 二级流水
    flow2Reward: number;  // 二级流水奖励
    flow3: number;  // 三级流水
    flow3Reward: number;  // 三级流水奖励
    recharge2Amount: number;  // 二级充值金额
    recharge3Amount: number;  // 三级充值金额
    withdraw2Amount: number;  // 二级提现金额
    withdraw3Amount: number;  // 三级提现金额
    rewd2: number;  // 二级充提差
    rewd3: number;  // 三级充提差
    rewd2Reward: number;  // 二级充提差奖励
    rewd3Reward: number;  // 三级充提差奖励
    num1: number; // 一级人数
    num2: number; // 二级人数
    num3: number; // 三级人数
    num: number;  // 团队人数
    numRecharge: number;  // 团队充值人数
    num1Recharge: number; // 一级充值人数
    num2Recharge: number; // 二级充值人数
    num3Recharge: number; // 三级充值人数
    inviteUrl: any;
    inviteDsUrl: any;
    proxyType: any;
    boxReward: any;
    nextSettleDate: any;
    nowTime: any;
    selfWithdrawAmount: number;
  };
  total: number;
};
const GetUserInviteUnsettleRewardDataEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetUnsettleInviteRewardDataResponse,
  EmptyRequest
>({
  query: (query: EmptyRequest) => ({
    method: 'get',
    url: GET_USER_INVITE_UNSETTLE_REWARD_DATA_URL,
    params: query,
  }),
})


type GetInviteUserDayReportData = {
  bindReward: number;
  day: number;
  firstRechargeReward: number;
  flow: number;
  flow1: number;
  flow1Reward: number;
  flow2: number;
  flow2Reward: number;
  flow3: number;
  flow3Reward: number;
  flowReward: number;
  inviteId: number;
  num1: number;
  num1FirstRecharge: number;
  num1Recharge: number;
  num2: number;
  num2FirstRecharge: number;
  num2Recharge: number;
  num3: number;
  num3FirstRecharge: number;
  num3Recharge: number;
  recharge1Amount: number;
  recharge2Amount: number;
  recharge3Amount: number;
  rechargeAmount: number;
  reward: number;
  reward1: number;
  reward2: number;
  reward3: number;
  rewd: number;
  rewd1: number;
  rewd1Reward: number;
  rewd2: number;
  rewd2Reward: number;
  rewd3: number;
  rewd3Reward: number;
  rewdReward: number;
  userId: number;
  withdraw1Amount: number;
  withdraw2Amount: number;
  withdraw3Amount: number;
  withdrawAmount: number;
}

type GetInviteUserDayReportDataResponse = {
  code: number;
  msg: any;
  data: {
    records: GetInviteUserDayReportData[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: any;
    maxLimit: any;
    pages: number;
  };
  total: number;
};

type GetInviteUserDayReportDataRequest = {
  pageNum: string;
  pageSize: string;
  token: string;
  userId: string;
  dayMin: string;
  dayMax: string;
};


const GetUserInviteDailyReportDataEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetInviteUserDayReportDataResponse,
  GetInviteUserDayReportDataRequest
>({
  query: (query: GetInviteUserDayReportDataRequest) => ({
    method: 'get',
    // url: `/japi/invite/userInvite/queryInviteDayReportData?pageNum=${query.pageNum}&pageSize=${query.pageSize}&token=${query.token}&userId=${query.userId}&dayMin=${query.dayMin}&dayMax=${query.dayMax}`,
    url: GET_USER_INVITE_DAILY_REPORT_DATA_URL,
    params: query,
  }),
})


export type GetRewardRecordData = {
  id: number;
  settleId: number;
  userId: number;
  reward: number;
  recharge1Amount: number;
  recharge2Amount: number;
  flow1: number;
  flow1Reward: number;
  flow2: number;
  flow2Reward: number;
  rewd1: number;
  rewd1Reward: number;
  rewd2: number;
  rewd2Reward: number;
  updateTime: string;
}

type GetRewardRecordResponse = {
  total: number;
  rows: GetRewardRecordData[];
  code: number;
  msg: string;
};

type GetRewardRecordRequest = {
  userId: string;
  pageNum: string;
  pageSize: string;
  startTime: string;
  endTime: string;
};

const GetUserInviteRewardRecordsEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetRewardRecordResponse,
  GetRewardRecordRequest
>({
  query: (query: GetRewardRecordRequest) => ({
    method: 'get',
    // url: `/japi/invite/userInvite/getRewardRecordList?userId=${query.userId}&pageNum=${query.pageNum}&pageSize=${query.pageSize}&startTime=${query.startTime}&endTime=${query.endTime}`,
    url: GET_USER_INVITE_REWARD_RECORD_LIST_URL,
    params: query,
  }),
})

export {
  GetUserInviteConfigEndpoint,
  GetUserInviteRewardDataEndpoint,
  GetUserInviteUnsettleRewardDataEndpoint,
  GetUserInviteDailyReportDataEndpoint,
  GetUserInviteRewardRecordsEndpoint,

  GetInviteRewardDataResponse,
  GetUnsettleInviteRewardDataResponse,
}
