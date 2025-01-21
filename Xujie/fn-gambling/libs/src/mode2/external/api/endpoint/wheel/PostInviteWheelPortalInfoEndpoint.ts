import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_PORTAL_INFO_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  WheelSegmentCategoryResult,
  WheelSegmentResult,
} from './PostWheelConfigEndpoint';
import { RechargeWheelLevelType } from '@libs/mode2/@types/rechargeWheelLevelTypes';

interface InviteWheelConfigResponse {
  icon?: number;
  value?: string; // 會有 "100" , "10~100" 兩種格式
}

interface InviteWheelPortalInfoResponse {
  countDown?: number;
  cumulativeReward?: number;
  withdrawRequire?: number;
  freeSpinCountDown?: number;
  // remindFreeSpin?: number;
  remindSpin?: number;
  spinType?: number; // SpinTypeFreeSpin = 4 //SpinTypeInviteSpin= 5
  wheelConfig?: InviteWheelConfigResponse[];
  withdrawable?: boolean;
  isParticipated?: boolean;
}

export interface WheelSegment {
  iconNumber: number;
  values: number[];
}

export enum InviteWheelSpinType {
  FREE_SPIN = 'FREE_SPIN',
  INVITE_SPIN = 'INVITE_SPIN',
}

const spinTypeMapping: Record<number, InviteWheelSpinType> = {
  [4]: InviteWheelSpinType.FREE_SPIN,
  [5]: InviteWheelSpinType.INVITE_SPIN,
};

export interface InviteWheelPortalInfoResult {
  cumulativeReward: number; // 當前累積獎勵
  withdrawRequire: number; // 提取要求額度
  eventCountDown: number; // 活動倒數
  isWithdrawal: boolean; // 可以 cash out，(withdrawable && cumulativeReward >= withdrawRequire)
  wheelSegments: WheelSegmentResult[];
  nextFreeSpinCountDown: number; // 下一個免費轉盤機會倒數
  // for modals
  remainingReward: number; // 提取目標剩餘量，only {remainingReward} to go
  remindSpin: number; // 剩餘轉盤次數
  completionRate: number; // 提取目標完成率
  isParticipated: boolean;
  spinType: InviteWheelSpinType;
}

export const DEFAULT_EVENT_COUNT_DOWN = 259200;
export const DEFAULT_FREE_SPIN_COUNT_DOWN = 86400;

// Evan Done
/**
 * 邀請輪盤，主頁資訊
 * 追加提示 modals
 * @param builder
 * @constructor
 */
export const PostInviteWheelPortalInfoEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<InviteWheelPortalInfoResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_PORTAL_INFO_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteWheelPortalInfoResponse>
): InviteWheelPortalInfoResult => {
  const resp = response?.Body;
  const cumulativeReward = resp?.cumulativeReward || 0;
  const withdrawRequire = resp?.withdrawRequire || 0;
  const wheelSegments: WheelSegmentResult[] =
    resp?.wheelConfig?.map((item, index) => {
      const values = item.value?.split('~').map((item) => Number(item || 0));
      return {
        id: index,
        icon: item.icon || 1,
        wheelLevel: RechargeWheelLevelType.TIER_GOLD, // TODO 不需要的欄位
        category: WheelSegmentCategoryResult.SPIN,
        value: values || [0],
      };
    }) || [];

  const completionRate = Math.floor(
    (cumulativeReward / withdrawRequire || 0) * 100
  );
  const remainingReward =
    cumulativeReward > withdrawRequire ? 0 : withdrawRequire - cumulativeReward;

  // 可以 cash out
  const isWithdrawal =
    resp?.withdrawable === true && withdrawRequire >= cumulativeReward;
  // 可能小於 0 防呆
  const eventCountDown = (resp?.countDown || 0) < 0 ? 0 : resp?.countDown || 0;
  // 小於0 給預設，避免造成遞迴
  const nextFreeSpinCountDown =
    (resp?.freeSpinCountDown || 0) < 0
      ? DEFAULT_FREE_SPIN_COUNT_DOWN
      : resp?.freeSpinCountDown || 0;

  const spinType =
    spinTypeMapping[resp?.spinType || 4] || InviteWheelSpinType.FREE_SPIN;
  return {
    cumulativeReward: cumulativeReward,
    withdrawRequire: withdrawRequire,
    eventCountDown: isWithdrawal ? DEFAULT_EVENT_COUNT_DOWN : eventCountDown,
    isWithdrawal: isWithdrawal,
    wheelSegments: wheelSegments,
    nextFreeSpinCountDown: nextFreeSpinCountDown,
    remainingReward: parseFloat(remainingReward.toFixed(2)),
    remindSpin: resp?.remindSpin || 0,
    completionRate: completionRate,
    isParticipated:
      resp?.isParticipated === undefined ? true : resp.isParticipated,
    spinType: spinType,
  };
};

export default PostInviteWheelPortalInfoEndpoint;
