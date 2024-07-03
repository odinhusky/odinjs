import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../gateway/axiosBaseQuery';
import { GetGameListEndpoint } from './GetGameListEndpoint';
import { StartGameEndpoint } from './StartGameEndpoint';
import { DownloadEndpoint } from './DownloadEndpoint';
import { environment } from '../../environments/environment';
import { WithdrawEndpoint } from './WithdrawEndpoint';
import { SendForgetPasswordSMSCodeEndpoint } from './SendForgetPasswordSMSCodeEndpoint';
import {
  GetGameRecordEndpoint,
  GetUserDamaEndpoint,
  GetUserVipAllDisplayEndpoint,
  GetVIPInfoEndpoint,
} from './UserEndpoint';
import {
  GetMailCountEndpoint,
  GetMailListEndpoint,
  PostMailReadEndpoint,
} from './MailEndpoint';
import {
  GetGlobalConfigEndpoint,
  GetMaintenanceEndpoint,
  GetRechargeConfig,
} from './SystemEndpoint';
import {
  GetBankEndpoint,
  GetRechargeRecordEndpoint,
  GetWithdrawLimitEndpoint,
  GetWithdrawRecordEndpoint,
  PostRechargeEndpoint,
} from './PaymentEndpoint';
import {
  GetPunchInConfigEndpoint,
  PostPunchInEndpoint,
} from './PunchInEndpoint';
import {
  GetUserInviteConfigEndpoint,
  GetUserInviteDailyReportDataEndpoint,
  GetUserInviteRewardDataEndpoint,
  GetUserInviteRewardRecordsEndpoint,
  GetUserInviteUnsettleRewardDataEndpoint,
} from './endpoint/invite/userInvite/GetUserInviteEndpoint';
import {
  GetUserBalanceEndpoint,
  GetUserBalanceSimpleDataEndpoint,
} from './endpoint/user/balance/GetUserBalanceEndpoint';
import { GetUserExtraInfoEndpoint } from './endpoint/user/extra/GetUserExtraEndpoint';
import { PostSignInEndpoint } from './endpoint/signin/GetSignInEndpoint';
import { PostUserUpdateEndpoint } from './endpoint/account/PostUserUpdateEndpoint';
import { GetActivityLobbyEndpoint } from './endpoint/activity/lobby/ActivityLobbyEndpoint';
import {
  GetActivityHistoryEndpoint,
  GetActivityHistoryRecordEndpoint,
} from './endpoint/activity/history/ActivityHistoryEndpoint';
import { GetLossBenefitEndpoint } from './endpoint/activity/lossBenefit/ActivityLossBenefitEndpoint';
import { GetDailyCashbackEndpoint } from './endpoint/activity/dailyCashback/ActivityDailyCashbackEndpoint';
import { PostActivityClaimEndpoint } from './endpoint/activity/claim/ActivityClaimEndpoint';
import { GetBoxInfoEndpoint } from './endpoint/activity/box/GetBoxInfoEndpoint';
import { GetBoxInviteListEndpoint } from './endpoint/activity/box/GetBoxInviteListEndpoint';
import { PostBoxClaimEndpoint } from './endpoint/activity/box/PostBoxClaimEndpoint';
import { GetUserDamaProcessEndpoint } from './endpoint/user/GetUserDamaProcessEndpoint';

// 幸運輪盤相關
import { PostLuckyWheelSpinEndpoint } from './endpoint/activity/luckyWheel/PostLuckyWheelSpinEndpoint';
import { GetLuckyWheelConfigEndpoint } from './endpoint/activity/luckyWheel/GetLuckyWheelConfigEndpoint';
import { GetUserLuckyWheelRecordsEndpoint } from './endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';
import { GetOtherUserLuckyWheelRecordsEndpoint } from './endpoint/activity/luckyWheel/GetOtherUserLuckyWheelRecordsEndpoint';
import { GetLuckyWheelLuckyValueDetailEndpoint } from './endpoint/activity/luckyWheel/GetLuckyWheelLuckyValueDetailEndpoint';
import { accountTags, LUCKY_WHEEL_LIST } from './tags';
import { PostBindWithdrawPasswordEndpoint } from './endpoint/wallet/PostBindWithdrawPasswordEndpoint';
import { PostChangeLoginPasswordEndpoint } from './endpoint/account/PostChangeLoginPasswordEndpoint';
import { PostChangePhoneEndpoint } from './endpoint/account/PostChangePhoneEndpoint';
import { PostLoginEndpoint } from './endpoint/account/PostLoginEndpoint';
import { PostRegisterEndpoint } from './endpoint/account/PostRegisterEndpoint';
import { PostDownloadRewardEndpoint } from './endpoint/activity/PostDownloadRewardEndpoint';
import { GetNoticeMarqueesEndpoint } from './endpoint/message/GetNoticeMarqueesEndpoint';
import { walletTags } from './tags/WalletTags';
import { GetHasWithdrawPasswordEndpoint } from './endpoint/wallet/GetHasWithdrawPasswordEndpoint';
import { PostVerifyWithdrawPasswordEndpoint } from './endpoint/wallet/PostVerifyWithdrawPasswordEndpoint';
import { PostForgetPasswordEndpoint } from './endpoint/account/PostForgetPasswordEndpoint';

// type GetBoxInfoContextVo = {
//   amount: number;
//   number: number;
//   receiveFlag: number;
// };

// type GetBoxInfoResponse = {
//   code: number;
//   msg: any;
//   data: {
//     id: number;
//     contentVoList: GetBoxInfoContextVo[];
//     status: number;
//     number: number;
//     receiveAmount: number;
//   };
//   total: number;
// };

type MailCountRequest = {
  token: string;
};

type GetUserGameRecordRequest = {
  dayMin: string;
  dayMax: string;
  pageNum: number;
  pageSize: number;
  token: string;
};

export type GetUserGameRecordResponse = {
  total: number;
  rows: {
    gameId: number;
    roomId: number;
    userId: number;
    bet: number;
    win: number;
    jackpotWin: number;
    currentBalance: number;
    createTime: string;
    day: number;
    gameName: number;
    provider: number;
  }[];
  code: number;
  msg: string;
};

export const API = createApi({
  reducerPath: 'api',
  // baseQuery:(
  //   args,
  //   { signal, dispatch, getState },
  //   extraOptions
  // ) => {
  //   console.log("getState", getState())
  //   if (Math.random() > 0.5) return { error: 'Too high!' }
  //   return { data: 'All good!' }
  // },
  tagTypes: [LUCKY_WHEEL_LIST, ...accountTags, ...walletTags],
  baseQuery: axiosBaseQuery({
    baseUrl: environment.baseUrl,
  }),
  // baseQuery: async (
  //   args,
  //   { signal, dispatch, getState },
  //   extraOptions
  // ) => {
  //   console.log("getState", getState())
  //
  //   // if (Math.random() > 0.5) return { error: 'Too high!' }
  //   // return { data: 'All good!' }
  //
  //   return await axiosBaseQuery({
  //     baseUrl: environment.baseUrl
  //   }, {
  //     signal,
  //     dispatch,
  //     getState,
  //   })
  //
  // },
  refetchOnReconnect: true,
  // NOTICE: 有些需要 token 的 api 也會更新...先暫時取消
  refetchOnFocus: false,
  // keepUnusedDataFor: 60,
  // refetchOnMountOrArgChange: 60,
  endpoints: (builder) => {
    return {
      getGlobalConfig: GetGlobalConfigEndpoint(builder),
      postRegister: PostRegisterEndpoint(builder),
      sendForgetPasswordSMSCode: SendForgetPasswordSMSCodeEndpoint(builder),
      postForgetPassword: PostForgetPasswordEndpoint(builder),

      postLogin: PostLoginEndpoint(builder),
      getRecharge: GetRechargeConfig(builder),
      recharge: PostRechargeEndpoint(builder),
      rechargeHistoryList: GetRechargeRecordEndpoint(builder),
      getWithdrawLimit: GetWithdrawLimitEndpoint(builder),
      withdraw: WithdrawEndpoint(builder),
      withdrawHistoryList: GetWithdrawRecordEndpoint(builder),
      getBalance: GetUserBalanceEndpoint(builder),
      startGame: StartGameEndpoint(builder),
      getGameList: GetGameListEndpoint(builder),
      download: DownloadEndpoint(builder),
      getBoxInfo: GetBoxInfoEndpoint(builder),
      getBoxInviteList: GetBoxInviteListEndpoint(builder),
      postBoxClaim: PostBoxClaimEndpoint(builder),
      getVIPInfo: GetVIPInfoEndpoint(builder),
      getUserVIPAllInfo: GetUserVipAllDisplayEndpoint(builder),
      postPunchIn: PostPunchInEndpoint(builder),
      getPunchInConfig: GetPunchInConfigEndpoint(builder),
      getSignInRecord: PostSignInEndpoint(builder),
      getMailCount: GetMailCountEndpoint(builder),
      getNoticeMarquees: GetNoticeMarqueesEndpoint(builder),
      getExtraInfo: GetUserExtraInfoEndpoint(builder),
      getInviteConfig: GetUserInviteConfigEndpoint(builder),
      getSimpleBalance: GetUserBalanceSimpleDataEndpoint(builder),
      Mains: GetMaintenanceEndpoint(builder),
      getDama: GetUserDamaEndpoint(builder),
      postLetterRead: PostMailReadEndpoint(builder),
      getLetterList: GetMailListEndpoint(builder),
      getBank: GetBankEndpoint(builder),
      getInviteRewardData: GetUserInviteRewardDataEndpoint(builder),
      getUnsettleInviteRewardData:
        GetUserInviteUnsettleRewardDataEndpoint(builder),
      getUserGameRecord: GetGameRecordEndpoint(builder),
      getInviteUserDayReportData: GetUserInviteDailyReportDataEndpoint(builder),
      getUserInviteRewardRecord: GetUserInviteRewardRecordsEndpoint(builder),
      postUserUpdate: PostUserUpdateEndpoint(builder),
      getActivityLobby: GetActivityLobbyEndpoint(builder),
      getActivityHistory: GetActivityHistoryEndpoint(builder),
      getActivityHistoryRecord: GetActivityHistoryRecordEndpoint(builder),
      getLossBenefit: GetLossBenefitEndpoint(builder),
      getDailyCashback: GetDailyCashbackEndpoint(builder),
      postActivityClaim: PostActivityClaimEndpoint(builder),
      getUserDamaProcess: GetUserDamaProcessEndpoint(builder),
      // 輪盤相關
      postLuckyWheelSpin: PostLuckyWheelSpinEndpoint(builder),
      getLuckyWheelConfig: GetLuckyWheelConfigEndpoint(builder),
      getUserLuckyWheelRecords: GetUserLuckyWheelRecordsEndpoint(builder),
      getOtherUserLuckyWheelRecords:
        GetOtherUserLuckyWheelRecordsEndpoint(builder),
      getLuckyWheelLuckyValueDetail:
        GetLuckyWheelLuckyValueDetailEndpoint(builder),
      postDownloadReward: PostDownloadRewardEndpoint(builder),

      // wallet
      postBindWithdrawPassword: PostBindWithdrawPasswordEndpoint(builder),
      postVerifyWithdrawPassword: PostVerifyWithdrawPasswordEndpoint(builder),
      getHasWithdrawPassword: GetHasWithdrawPasswordEndpoint(builder),
      // account
      postChangeLoginPassword: PostChangeLoginPasswordEndpoint(builder),
      postChangePhone: PostChangePhoneEndpoint(builder),
    };
  },
});

export const {
  useGetGlobalConfigQuery,
  useGetGameListQuery,
  useLazyGetGameListQuery,
  usePostLoginMutation,
  useLazyGetBalanceQuery,
  useLazyGetSimpleBalanceQuery,
  useLazyGetUserGameRecordQuery,
  usePostRegisterMutation,
  useSendForgetPasswordSMSCodeMutation,
  // useForgetPasswordMutation,
  usePostForgetPasswordMutation,
  useLazyGetRechargeQuery,
  usePostUserUpdateMutation,
  useRechargeMutation,
  useLazyGetLetterListQuery,
  useRechargeHistoryListMutation,
  useLazyGetInviteConfigQuery,
  useLazyGetInviteRewardDataQuery,
  useLazyGetInviteUserDayReportDataQuery,
  useLazyGetUnsettleInviteRewardDataQuery,
  useLazyGetUserInviteRewardRecordQuery,
  useGetWithdrawLimitMutation,
  useWithdrawMutation,
  useWithdrawHistoryListMutation,
  useGetSignInRecordMutation,
  useLazyGetUserVIPAllInfoQuery,
  useLazyGetVIPInfoQuery,
  useLazyDownloadQuery,
  usePostLetterReadMutation,
  useLazyGetMailCountQuery,
  useGetNoticeMarqueesQuery,
  usePostPunchInMutation,
  useLazyGetPunchInConfigQuery,
  useGetBoxInfoQuery,
  useLazyGetBoxInfoQuery,
  usePostBoxClaimMutation,
  useGetBoxInviteListQuery,
  useGetActivityLobbyQuery,
  // useLazyGetActivityLobbyQuery,
  useLazyGetActivityHistoryQuery,
  useLazyGetActivityHistoryRecordQuery,
  useLazyGetLossBenefitQuery,
  useLazyGetDailyCashbackQuery,
  usePostActivityClaimMutation,
  useLazyGetUserDamaProcessQuery,
  // 輪盤相關
  usePostLuckyWheelSpinMutation,
  useGetLuckyWheelConfigQuery,
  useGetUserLuckyWheelRecordsQuery,
  useGetOtherUserLuckyWheelRecordsQuery,
  useGetLuckyWheelLuckyValueDetailQuery,
  usePostDownloadRewardMutation,

  // wallet
  usePostBindWithdrawPasswordMutation,
  usePostVerifyWithdrawPasswordMutation,
  useGetHasWithdrawPasswordQuery,
  // account
  usePostChangePhoneMutation,
  usePostChangeLoginPasswordMutation,
} = API;

export const API3 = createApi({
  reducerPath: 'api3',
  baseQuery: axiosBaseQuery({
    baseUrl: environment.baseUrl,
  }),
  // keepUnusedDataFor: 600,
  // keepUnusedDataFor: 1,
  // refetchOnMountOrArgChange: 60,
  endpoints: (builder) => ({
    startGame: StartGameEndpoint(builder),
  }),
});

export const { useStartGameMutation } = API3;
export const selectConfigResult = API.endpoints.getGlobalConfig.select(
  {} as any
);

// const selectUsersData = createSelector(
//   selectConfigResult,
//   usersResult => usersResult.data
// )
