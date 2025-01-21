import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosCryptoBaseQuery } from '../../gateway/axiosCryptoBaseQuery';
import { axiosBaseQuery } from '@mode2/gateway/axiosBaseQuery';

import { PostLoginEndpoint } from './endpoint/user/PostLoginEndpoint';
import { PostPlayerMainInfoEndpoint } from './endpoint/user/PostPlayerMainInfoEndpoint';
import { PostRegisterEndpoint } from './endpoint/user/PostRegisterEndpoint';
import { PostForgetPasswordEndpoint } from './endpoint/user/PostForgetPasswordEndpoint';
import { PostSendOtpEndpoint } from './endpoint/user/PostSendOtpEndpoint';
import { PostPlayerInfoSaveEndpoint } from './endpoint/user/PostPlayerInfoSaveEndpoint';
import { PostCaptchaEndpoint } from './endpoint/user/PostCaptchaEndpoint';
import { PostRemoveLevelCacheEndpoint } from './endpoint/user/PostRemoveLevelCacheEndpoint';
import { PostChangePasswordEndpoint } from '@mode2API/endpoint/user/PostChangePasswordEndpoint';
import { PostHomeEndpoint } from '@mode2API/endpoint/user/PostHomeEndpoint';

import { PostAgentWeekRewardConfigEndpoint } from './endpoint/record/PostAgentWeekRewardConfigEndpoint';
import { PostAgentWeekRankingEndpoint } from './endpoint/record/PostAgentWeekRankingEndpoint';
import { PostActiveWeekRankingReceiveEndpoint } from './endpoint/record/PostActiveWeekRankingReceiveEndpoint';
import { PostFundDetailEndpoint } from './endpoint/record/PostFundDetailEndpoint';
import { PostRechargeRecordsEndpoint } from './endpoint/record/PostRechargeRecordsEndpoint';
import { PostWithdrawRecordsEndpoint } from './endpoint/record/PostWithdrawRecordsEndpoint';

import { PostAnnouncementInfoEndpoint } from './endpoint/main/PostAnnouncementInfoEndpoint';
import { PostPlayerBroadcastEndpoint } from './endpoint/main/PostPlayerBroadcastEndpoint';

import { PostEnterGameEndpoint } from './endpoint/game/PostEnterGameEndpoint';
import { PostGameCollectEndpoint } from './endpoint/game/PostGameCollectEndpoint';
import { PostGameCollectionsEndpoint } from './endpoint/game/PostGameCollectionsEndpoint';
import { PostGameHomeEndpoint } from './endpoint/game/PostGameHomeEndpoint';
import { PostGameSearchEndpoint } from './endpoint/game/PostGameSearchEndpoint';
import { PostQuiteGameEndpoint } from './endpoint/game/PostQuiteGameEndpoint';

import { PostDownloadAwardStartEndpoint } from './endpoint/active/PostDownloadAwardStartEndpoint';
import { PostDownloadReceivePrizeEndpoint } from './endpoint/active/PostDownloadReceivePrizeEndpoint';
import { PostPiggyBankDetailEndpoint } from './endpoint/active/PostPiggyBankDetailEndpoint';
import { PostPiggyBankWithdrawEndpoint } from './endpoint/active/PostPiggyBankWithdrawEndpoint';

import { PostAgentTeamStatisticsEndpoint } from './endpoint/team/PostAgentTeamStatisticsEndpoint';
import { PostPromoteDailyDetailEndpoint } from './endpoint/team/PostPromoteDailyDetailEndpoint';
import { PostVIPHomeEndpoint } from './endpoint/team/PostVIPHomeEndpoint';
import { VIPReceiveBoxEndpoint } from './endpoint/team/VIPReceiveBoxEndpoint';
import { VIPReceiveMonthlyAwardEndpoint } from './endpoint/team/VIPReceiveMonthlyAwardEndpoint';
import { PostPromoteHomeEndpoint } from '@mode2API/endpoint/team/PostPromoteHomeEndpoint';

import { GetEventTokensEndpoint } from './endpoint/info/GetEventTokensEndpoint';
import { PostPayRechargeEndpoint } from './endpoint/info/PostPayRechargeEndpoint';
import { PostPlayerInformationEndpoint } from './endpoint/info/PostPlayerInformationEndpoint';
import { PostRechargeIntoGameEndpoint } from './endpoint/info/PostRechargeIntoGameEndpoint';
import { PostReportGameTypeBetAmountEndpoint } from './endpoint/info/PostReportGameTypeBetAmountEndpoint';
import { StatisticsPlayerEndpoint } from './endpoint/info/StatisticsPlayerEndpoint';
import { PostWithdrawConfigEndpoint } from './endpoint/info/PostWithdrawConfigEndpoint';
import { PostPlayerUpdateAvatarEndpoint } from './endpoint/info/PostPlayerUpdateAvatarEndpoint';

import { PostMessageListEndpoint } from '@mode2API/endpoint/message/PostMessageListEndpoint';
import { PostMessageReadEndpoint } from '@mode2API/endpoint/message/PostMessageReadEndpoint';
import { PostMessageUnreadCountEndpoint } from '@mode2API/endpoint/message/PostMessageUnreadCountEndpoint';
import { PostBindPushTokenEndpoint } from '@mode2API/endpoint/message/PostBindPushTokenEndpoint';

import { GetPayCheckoutDetailEndpoint } from '@mode2API/endpoint/wallet/GetPayCheckoutDetailEndpoint';
import { PostPayCheckoutConfirmEndpoint } from './endpoint/wallet/PostPayCheckoutConfirmEndpoint';

import { PostPlayerEventReportEndpoint } from '@mode2API/endpoint/event/PostPlayerEventReportEndpoint';

import { PostCampaignListEndpoint } from './endpoint/campaign/PostCampaignListEndpoint';
import { PostCampaignLaunchEndpoint } from './endpoint/campaign/PostCampaignLaunchEndpoint';
import PostTeamBetRewardListEndpoint from '@mode2API/endpoint/teamClub/PostTeamBetRewardListEndpoint';
import PostTeamDepositRewardListEndpoint from '@mode2API/endpoint/teamClub/PostTeamDepositRewardListEndpoint';
import PostTeamInvitationRewardListEndpoint from '@mode2API/endpoint/teamClub/PostTeamInvitationRewardListEndpoint';
import PostTeamInvitationTaskRewardListEndpoint from '@mode2API/endpoint/teamClub/PostTeamInvitationTaskRewardListEndpoint';
import PostTeamLevelConfigEndpoint from '@mode2API/endpoint/teamClub/PostTeamLevelConfigEndpoint';
import PostTeamRewardClaimHistoryListEndpoint from '@mode2API/endpoint/teamClub/PostTeamRewardClaimHistoryListEndpoint';
import PostTeamRewardClaimListEndpoint from '@mode2API/endpoint/teamClub/PostTeamRewardClaimListEndpoint';
import PostPostTeamCollectRewardEndpoint from '@mode2API/endpoint/teamClub/PostTeamCollectRewardEndpoint';
import PostTeamFinanceTierSummaryListEndpoint from '@mode2API/endpoint/teamClub/PostTeamFinanceTierSummaryListEndpoint';
import PostTeamMemberSummaryEndpoint from '@mode2API/endpoint/teamClub/PostTeamMemberSummaryEndpoint';
import PostTeamInformationEndpoint from '@mode2API/endpoint/teamClub/PostTeamInformationEndpoint';
import PostTeamInviteInformationEndpoint from '@mode2API/endpoint/teamClub/PostTeamInviteInformationEndpoint';
import PostInviteDailyConfigEndpoint from '@mode2API/endpoint/teamClub/PostInviteDailyConfigEndpoint';
import PostInviteTeamRewardConfigEndpoint from '@mode2API/endpoint/teamClub/PostInviteTeamRewardConfigEnpoint';
import { PostPayConfigInfoWithOptionsEndpoint } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import PostWheelConfigEndpoint from '@mode2API/endpoint/wheel/PostWheelConfigEndpoint';
import PostWheelNewsTickerListEndpoint from '@mode2API/endpoint/wheel/PostWheelNewsTickerListEndpoint';
import { PostWheelPlayerProgressEndpoint } from '@mode2API/endpoint/wheel/PostWheelPlayerProgressEndpoint';
import { PostWheelPlayerSpinEndpoint } from '@mode2API/endpoint/wheel/PostWheelPlayerSpinEndpoint';
import { PostWheelPlayerSpinHistoryListEndpoint } from '@mode2API/endpoint/wheel/PostWheelPlayerSpinHistoryListEndpoint';
import PostInviteWheelParticipateEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelParticipateEndpoint';
import PostInviteWheelPortalInfoEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelPortalInfoEndpoint';
import PostInviteWheelRewardListEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelRewardListEndpoint';
import PostInviteWheelSpinEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelSpinEndpoint';
import PostInviteWheelWithdrawEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelWithdrawEndpoint';
import PostInviteWheelWithdrawListEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelWithdrawListEndpoint';
import PostRechargeQueryReceiptEndpoint from '@mode2API/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import PostRechargeUpdateReceiptEndpoint from '@mode2API/endpoint/recharge/PostRechargeUpdateReceiptEndpoint';
import PostRechargeUploadReceiptEndpoint from '@mode2API/endpoint/recharge/PostRechargeUploadReceiptEndpoint';
import PostInviteWheelNewsTickerListEndpoint from '@mode2API/endpoint/wheel/PostInviteWheelNewsTickerListEndpoint';

export const baseCryptoAPI = createApi({
  reducerPath: 'baseCryptoApi',
  baseQuery: axiosCryptoBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    // login
    postLogin: PostLoginEndpoint(builder),
    postRegister: PostRegisterEndpoint(builder),
    postCaptcha: PostCaptchaEndpoint(builder),
    StatisticsPlayer: StatisticsPlayerEndpoint(builder),
    // user
    postPlayerMainInfo: PostPlayerMainInfoEndpoint(builder),
    postRemoveLevelCache: PostRemoveLevelCacheEndpoint(builder),
    postHome: PostHomeEndpoint(builder),
    postPlayerInfoSave: PostPlayerInfoSaveEndpoint(builder),
    postChangePassword: PostChangePasswordEndpoint(builder),
    postSendOtp: PostSendOtpEndpoint(builder),
    postForgetPassword: PostForgetPasswordEndpoint(builder),

    // main
    postAnnouncementInfo: PostAnnouncementInfoEndpoint(builder),
    postPlayerBroadcast: PostPlayerBroadcastEndpoint(builder),

    // game
    postEnterGame: PostEnterGameEndpoint(builder),
    postGameCollect: PostGameCollectEndpoint(builder),
    postGameCollections: PostGameCollectionsEndpoint(builder),
    postGameHome: PostGameHomeEndpoint(builder),
    postGameSearch: PostGameSearchEndpoint(builder),

    // active
    postDownloadAwardStart: PostDownloadAwardStartEndpoint(builder),
    postDownloadReceivePrize: PostDownloadReceivePrizeEndpoint(builder),
    postPiggyBankDetail: PostPiggyBankDetailEndpoint(builder),
    postPiggyBankWithdraw: PostPiggyBankWithdrawEndpoint(builder),

    // team
    postPromoteHome: PostPromoteHomeEndpoint(builder),
    postAgentTeamStatistics: PostAgentTeamStatisticsEndpoint(builder),
    postPromoteDailyDetail: PostPromoteDailyDetailEndpoint(builder),
    postVIPHome: PostVIPHomeEndpoint(builder),
    VIPReceiveBox: VIPReceiveBoxEndpoint(builder),
    VIPReceiveMonthlyAward: VIPReceiveMonthlyAwardEndpoint(builder),

    // info
    postPayRecharge: PostPayRechargeEndpoint(builder),
    postPlayerInformation: PostPlayerInformationEndpoint(builder),
    postWithdrawConfig: PostWithdrawConfigEndpoint(builder),
    postReportGameTypeBetAmount: PostReportGameTypeBetAmountEndpoint(builder),
    postPlayerUpdateAvatar: PostPlayerUpdateAvatarEndpoint(builder),
    postRechargeIntoGame: PostRechargeIntoGameEndpoint(builder),

    //record
    postAgentWeekRanking: PostAgentWeekRankingEndpoint(builder),
    postAgentWeekRewardConfig: PostAgentWeekRewardConfigEndpoint(builder),
    postActiveWeekRankingReceive: PostActiveWeekRankingReceiveEndpoint(builder),
    postRechargeRecords: PostRechargeRecordsEndpoint(builder),
    postFundDetail: PostFundDetailEndpoint(builder),
    postWithdrawRecords: PostWithdrawRecordsEndpoint(builder),

    //event
    postPlayerEventReport: PostPlayerEventReportEndpoint(builder),

    // message
    postBindPushToken: PostBindPushTokenEndpoint(builder),

    // wallet
    postPayConfigInfoWithOptions: PostPayConfigInfoWithOptionsEndpoint(builder),

    // IN舊包有使用但目前頁面尚未實作
    // postLogout: PostLogoutEndpoint(builder),
    postQuiteGame: PostQuiteGameEndpoint(builder),
    // postCampaignList: PostCampaignListEndpoint(builder),
    // postCampaignLaunch: PostCampaignLaunchEndpoint(builder),
    // getSmobiles: GetSmobilesEndpoint(builder),
  }),
});

export const {
  // login
  usePostLoginMutation,
  usePostRegisterMutation,
  usePostCaptchaMutation,

  // user
  usePostPlayerMainInfoMutation,
  usePostRemoveLevelCacheMutation,
  usePostHomeMutation,
  usePostPlayerInfoSaveMutation,
  usePostChangePasswordMutation,
  usePostSendOtpMutation,
  usePostForgetPasswordMutation,

  // main
  usePostAnnouncementInfoMutation,
  usePostPlayerBroadcastMutation,

  // game
  usePostEnterGameMutation,
  usePostGameCollectMutation,
  usePostGameCollectionsMutation,
  usePostGameHomeMutation,
  usePostGameSearchMutation,

  // active
  usePostDownloadAwardStartMutation,
  usePostDownloadReceivePrizeMutation,
  usePostPiggyBankDetailMutation,
  usePostPiggyBankWithdrawMutation,

  // team
  usePostPromoteHomeMutation,
  usePostAgentTeamStatisticsMutation,
  usePostPromoteDailyDetailMutation,
  usePostVIPHomeMutation,
  useVIPReceiveBoxMutation,
  useVIPReceiveMonthlyAwardMutation,

  //record
  usePostAgentWeekRankingMutation,
  usePostAgentWeekRewardConfigMutation,
  usePostActiveWeekRankingReceiveMutation,
  usePostRechargeRecordsMutation,
  usePostFundDetailMutation,
  usePostWithdrawRecordsMutation,

  // info
  usePostPayRechargeMutation,
  usePostPlayerInformationMutation,
  usePostWithdrawConfigMutation,
  usePostReportGameTypeBetAmountMutation,
  usePostPlayerUpdateAvatarMutation,
  usePostRechargeIntoGameMutation,

  //event
  usePostPlayerEventReportMutation,

  // message
  usePostBindPushTokenMutation,

  // wallet
  usePostPayConfigInfoWithOptionsMutation,

  // IN舊包有使用但目前頁面尚未實作
  // usePostLogoutMutation,
  usePostQuiteGameMutation,
  // useGetSmobilesMutation,
  useStatisticsPlayerMutation,
} = baseCryptoAPI;

/**
 * 不加密
 */
export const baseAPI = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    getEventTokens: GetEventTokensEndpoint(builder),
    postMessageUnreadCount: PostMessageUnreadCountEndpoint(builder),
    postMessageList: PostMessageListEndpoint(builder),
    postMessageRead: PostMessageReadEndpoint(builder),
    // wallet
    getPayCheckoutDetail: GetPayCheckoutDetailEndpoint(builder),
    postPayCheckoutConfirm: PostPayCheckoutConfirmEndpoint(builder),
    postCampaignList: PostCampaignListEndpoint(builder),
    postCampaignLaunch: PostCampaignLaunchEndpoint(builder),

    // - Team club 相關 Start ========================
    postInviteDailyConfig: PostInviteDailyConfigEndpoint(builder),
    postInviteTeamRewardConfig: PostInviteTeamRewardConfigEndpoint(builder),

    postTeamBetRewardList: PostTeamBetRewardListEndpoint(builder),
    postTeamDepositRewardList: PostTeamDepositRewardListEndpoint(builder),
    postTeamInvitationRewardList: PostTeamInvitationRewardListEndpoint(builder),
    postTeamInvitationTaskRewardList:
      PostTeamInvitationTaskRewardListEndpoint(builder),

    postTeamLevelConfig: PostTeamLevelConfigEndpoint(builder),
    postTeamRewardClaimHistoryList:
      PostTeamRewardClaimHistoryListEndpoint(builder),
    postTeamRewardClaimList: PostTeamRewardClaimListEndpoint(builder),

    postTeamCollectReward: PostPostTeamCollectRewardEndpoint(builder),
    postTeamFinanceTierSummaryList:
      PostTeamFinanceTierSummaryListEndpoint(builder),
    postTeamInformation: PostTeamInformationEndpoint(builder),
    postTeamInviteInformation: PostTeamInviteInformationEndpoint(builder),
    postTeamMemberSummary: PostTeamMemberSummaryEndpoint(builder),

    // - Team club 相關 End ========================

    // - Wheel 相關 Start ===========
    postWheelConfig: PostWheelConfigEndpoint(builder),
    postWheelNewsTickerList: PostWheelNewsTickerListEndpoint(builder),
    postWheelPlayerProgress: PostWheelPlayerProgressEndpoint(builder),
    postWheelPlayerSpin: PostWheelPlayerSpinEndpoint(builder),
    postWheelPlayerSpinHistoryList:
      PostWheelPlayerSpinHistoryListEndpoint(builder),
    // postWheelPlayerSummary: PostWheelPlayerSummaryEndpoint(builder),
    // Invite Wheel
    postInviteWheelNewsTickerList:
      PostInviteWheelNewsTickerListEndpoint(builder),
    postInviteWheelParticipate: PostInviteWheelParticipateEndpoint(builder),
    postInviteWheelPortalInfo: PostInviteWheelPortalInfoEndpoint(builder),
    postInviteWheelRewardList: PostInviteWheelRewardListEndpoint(builder),
    postInviteWheelSpin: PostInviteWheelSpinEndpoint(builder),
    postInviteWheelWithdraw: PostInviteWheelWithdrawEndpoint(builder),
    postInviteWheelWithdrawList: PostInviteWheelWithdrawListEndpoint(builder),
    // - Wheel 相關 End ===========

    // - 上報 UTR 相關 Start ===========
    postRechargeQueryReceipt: PostRechargeQueryReceiptEndpoint(builder),
    postRechargeUpdateReceipt: PostRechargeUpdateReceiptEndpoint(builder),
    postRechargeUploadReceipt: PostRechargeUploadReceiptEndpoint(builder),

    // - 上報 UTR 相關 End ===========
  }),
});

export const {
  useGetEventTokensQuery,
  usePostMessageUnreadCountMutation,
  usePostMessageListMutation,
  usePostMessageReadMutation,
  useLazyGetPayCheckoutDetailQuery,
  usePostPayCheckoutConfirmMutation,
  usePostCampaignListMutation,
  usePostCampaignLaunchMutation,

  // - Team club 相關 Start ========================
  usePostInviteDailyConfigMutation,
  usePostInviteTeamRewardConfigMutation,

  usePostTeamBetRewardListMutation,
  usePostTeamDepositRewardListMutation,
  usePostTeamInvitationRewardListMutation,
  usePostTeamInvitationTaskRewardListMutation,

  usePostTeamLevelConfigMutation,
  usePostTeamRewardClaimHistoryListMutation,
  usePostTeamRewardClaimListMutation,

  usePostTeamCollectRewardMutation,
  usePostTeamFinanceTierSummaryListMutation,
  usePostTeamInformationMutation,
  usePostTeamInviteInformationMutation,
  usePostTeamMemberSummaryMutation,

  // - Team club 相關 End ========================

  // - Wheel 相關 Start ===========
  usePostWheelConfigMutation,
  usePostWheelNewsTickerListMutation,
  usePostWheelPlayerProgressMutation,
  usePostWheelPlayerSpinMutation,
  usePostWheelPlayerSpinHistoryListMutation,
  // usePostWheelPlayerSummaryMutation,
  // Invite Wheel
  usePostInviteWheelNewsTickerListMutation,
  usePostInviteWheelParticipateMutation,
  usePostInviteWheelPortalInfoMutation,
  usePostInviteWheelRewardListMutation,
  usePostInviteWheelSpinMutation,
  usePostInviteWheelWithdrawMutation,
  usePostInviteWheelWithdrawListMutation,
  // - Wheel 相關 End ===========

  // - 上報 UTR 相關 Start ===========
  usePostRechargeQueryReceiptMutation,
  usePostRechargeUpdateReceiptMutation,
  usePostRechargeUploadReceiptMutation,

  // - 上報 UTR 相關 End ===========
} = baseAPI;
