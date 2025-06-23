import { POST_PLAYER_MAIN_INFO_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export interface IMainInfoResponse {
  PlayerId?: number; // 20005193
  PlayerName?: string; // "5555566667"
  Nickname?: string;
  Avatar?: string; // "1"
  TotalAssets?: string; // "93621.00"
  RealPhone: string;
  Email?: string;
  GameLimit?: number;
  VipRebate?: number;
  RebateRate?: string; // "0.0005"
  Rebate?: string; // "0.00"
  IsBlogger?: boolean;
  IsTodaySignIn?: boolean;
  Level?: number;
  IsAgent?: boolean;
  AgentAnnouncement?: number;
  AvatarFrame?: string;
  IsLevelPopup?: boolean;
  IsMonthlyVipRewardPopup?: boolean;
  Countdown?: number;
  ActiveNewPlayerStatuds?: number;
  RedPacketPlayerStatus?: number;
  DownloadRedPacketStatus?: number;
  // NeedKYC?: boolean; //
  Lazy?: boolean;
  PasswordExpired?: boolean;
  IsLowBalance?: boolean;
  IsVisitor?: boolean;

  Gender: string; // M 男性，F 女性
  HasSetPassword: boolean; // 是否綁定密碼
  ReferralCode: string; // 本人的推薦碼
  BindReferralCode: string; // 綁定的推薦碼
  VipRechargeAmount: string; // 升級所需金額
}

/** 獲取已登入的玩家資料 */
export const PostPlayerMainInfoEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerMainInfoResult, void>({
    query: () => {
      const reqData = {
        reqData: {},
      };
      return {
        method: 'post',
        url: POST_PLAYER_MAIN_INFO_URL,
        data: reqData,
      };
    },

    transformResponse,
  });

export type PlayerMainInfoResult = {
  nickname: string;
  playerName: string;
  isLevelPopup: boolean;
  realPhone: string;
  playerId: number;
  avatarOrder: string;
  avatarFrameOrder: string;
  level: number;
  totalAssets: number;
  needDownloadReceivePrize: boolean;
  isPasswordExp: boolean;
  isLowBalance: boolean;
  userRole: UserRoleType;

  gender: string;
  hasSetPassword: boolean; // 是否綁定密碼
  referralCode: string; // 本人的推薦碼
  bindReferralCode: string; // 綁定的推薦碼

  upgradeRequiredAmount: number; // 升級所需金額
};

const transformResponse = (
  response: ResponseStructure<IMainInfoResponse>
): PlayerMainInfoResult => {
  const resp = response?.Body;
  return {
    nickname: resp?.Nickname || '',
    playerName: resp?.PlayerName || '',
    isLevelPopup: resp?.IsLevelPopup || false,
    realPhone: resp?.RealPhone || '',
    playerId: resp?.PlayerId || 0,
    avatarOrder: resp?.Avatar || '1',
    avatarFrameOrder: resp?.AvatarFrame || '',
    level: resp?.Level || 0,
    totalAssets: extractApiMoneyString(resp?.TotalAssets || '0'),
    needDownloadReceivePrize: resp?.DownloadRedPacketStatus === 1,
    isPasswordExp: resp?.PasswordExpired || false,
    isLowBalance: resp?.IsLowBalance || false,
    userRole:
      resp?.IsVisitor === false ? UserRoleType.USER : UserRoleType.PLAYER,

    gender: resp?.Gender || '',
    hasSetPassword: resp?.HasSetPassword || false,
    referralCode: (resp?.ReferralCode || '').toUpperCase(),
    bindReferralCode: (resp?.BindReferralCode || '').toUpperCase(),
    upgradeRequiredAmount: extractApiMoneyString(
      resp?.VipRechargeAmount || '0'
    ),
  };
};
