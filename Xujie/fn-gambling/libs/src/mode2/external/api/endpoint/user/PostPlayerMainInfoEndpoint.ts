import { POST_PLAYER_MAIN_INFO_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

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

const defaultResult = {
  nickname: '',
  playerName: '',
  isLevelPopup: false,
  realPhone: '',
  playerId: 0,
  avatarOrder: '1',
  avatarFrameOrder: '',
  level: 0,
  totalAssets: 0,
  needDownloadReceivePrize: false,
  isPasswordExp: false,
  isLowBalance: false,
};

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
};

const transformResponse = (
  response: ResponseStructure<IMainInfoResponse>
): PlayerMainInfoResult => {
  const resp = response?.Body;

  if (resp) {
    const result = {
      nickname: resp?.Nickname || '',
      playerName: resp?.PlayerName || '',
      isLevelPopup: resp.IsLevelPopup || defaultResult.isLevelPopup,
      realPhone: resp.RealPhone || defaultResult.realPhone,
      playerId: resp.PlayerId || defaultResult.playerId,
      avatarOrder: resp.Avatar || defaultResult.avatarOrder,
      avatarFrameOrder: resp.AvatarFrame || defaultResult.avatarFrameOrder,
      level: resp.Level || defaultResult.level,
      totalAssets: extractApiMoneyString(resp?.TotalAssets || '0'),
      needDownloadReceivePrize: resp.DownloadRedPacketStatus === 1,
      isPasswordExp: resp?.PasswordExpired || false,
      isLowBalance: resp?.IsLowBalance || false,
    };

    return result;
  }
  return defaultResult;
};
