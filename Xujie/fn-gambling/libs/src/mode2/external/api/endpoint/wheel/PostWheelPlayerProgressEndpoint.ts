import { POST_WHEEL_PLAYER_PROGRESS_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  allRechargeWheelLevels,
  rechargeWheelLevelMapping,
  RechargeWheelLevelType,
} from '@mode2/@types/rechargeWheelLevelTypes';

interface WheelProgressSpinsResponse {
  playerId?: number;
  balance?: number;
  level?: number;
}

export interface WheelPlayerProgressResponse {
  playerId?: number;
  deposit?: number;
  spins?: WheelProgressSpinsResponse[];
}

export interface WheelPlayerProgressSpinResult {
  wheelLevel: RechargeWheelLevelType; // 轉盤等級
  remainingSpins: number; //剩餘 可用的 spin 次數 // balance
}

export interface WheelPlayerProgressResult {
  currentDeposit: number; // 當前累積充值量
  spinProgress: WheelPlayerProgressSpinResult[]; // 4個等級的 可用 spin 資訊
}

const fullSpinProgress = (
  spinProgress: WheelPlayerProgressSpinResult[]
): WheelPlayerProgressSpinResult[] => {
  const uniqueSpinProgress = spinProgress.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.wheelLevel === value.wheelLevel)
  );
  const missingLevels = allRechargeWheelLevels.filter(
    (level) => !uniqueSpinProgress.some((config) => config.wheelLevel === level)
  );
  const missingSpinProgress: WheelPlayerProgressSpinResult[] =
    missingLevels.map((level) => ({
      wheelLevel: level,
      remainingSpins: 0,
    }));
  const completeSpinProgress = [...uniqueSpinProgress, ...missingSpinProgress];
  return completeSpinProgress.sort((a, b) => a.wheelLevel - b.wheelLevel);
};

// Evan done

/**
 * 充值輪盤 - spin 資訊
 * @param builder
 * @constructor
 */
export const PostWheelPlayerProgressEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WheelPlayerProgressResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WHEEL_PLAYER_PROGRESS_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelPlayerProgressResponse>
): WheelPlayerProgressResult => {
  const resp = response?.Body;
  const spinProgress: WheelPlayerProgressSpinResult[] =
    resp?.spins?.map((item) => {
      const level =
        rechargeWheelLevelMapping[item.level || -1] ||
        RechargeWheelLevelType.TIER_SILVER;
      return {
        wheelLevel: level,
        remainingSpins: item.balance || 0,
      };
    }) || [];
  const completeSpinProgress = fullSpinProgress(spinProgress);

  return {
    currentDeposit: resp?.deposit || 0,
    spinProgress: completeSpinProgress,
  };
};
