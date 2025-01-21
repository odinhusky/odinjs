import { POST_WHEEL_PLAYER_SPIN_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  rechargeWheelLevelMapping,
  RechargeWheelLevelType,
} from '@mode2/@types/rechargeWheelLevelTypes';

interface WheelPlayerSpinResponse {
  createTime?: number;
  id?: number;
  level?: number;
  playerId?: number;
  rewardId?: number;
}

export interface WheelPlayerSpinResult {
  wheelLevel: RechargeWheelLevelType; // 找 PostWheelConfigEndpoint.levelConfigs.wheelLevel === wheelLevel
  wheelSegmentId: number; // 找 PostWheelConfigEndpoint.levelConfigs[wheelLevel].wheelSegments[id] === wheelSegmentId
}

export interface WheelPlayerSpinRequest {
  level: number; // 參照 rechargeWheelLevelMapping
}

// Evan done

/**
 * 充值輪盤，參與抽獎
 * @param builder
 * @constructor
 */
export const PostWheelPlayerSpinEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WheelPlayerSpinResult, WheelPlayerSpinRequest>({
    query: ({ level }) => {
      return {
        method: 'post',
        url: POST_WHEEL_PLAYER_SPIN_URL,
        data: {
          level,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelPlayerSpinResponse>
): WheelPlayerSpinResult => {
  const resp = response?.Body;
  const level =
    rechargeWheelLevelMapping[resp?.level || 0] ||
    RechargeWheelLevelType.TIER_SILVER;
  return {
    wheelLevel: level,
    wheelSegmentId: resp?.rewardId || 0,
  };
};
