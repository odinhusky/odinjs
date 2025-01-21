import { POST_WHEEL_PLAYER_SPIN_HISTORY_LIST_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  rechargeWheelLevelMapping,
  RechargeWheelLevelType,
} from '@mode2/@types/rechargeWheelLevelTypes';

interface WheelPlayerSpinHistoryResponse {
  id?: number;
  name?: string;
  amount?: number;
  createTime?: number;
  level?: number;
  playerId?: number;
}

export interface WheelSpinHistoryResult {
  wheelLevel: RechargeWheelLevelType; // 輪盤等級
  rewards: number; //  獎勵
  createTime: number; // unix time
}

export interface WheelPlayerSpinHistoryListResult {
  totalRewards: number;
  wheelSpinHistoryList: WheelSpinHistoryResult[];
}

// Evan done

/**
 * 充值輪盤，中獎紀錄
 * @param builder
 * @constructor
 */
export const PostWheelPlayerSpinHistoryListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<WheelPlayerSpinHistoryListResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WHEEL_PLAYER_SPIN_HISTORY_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelPlayerSpinHistoryResponse[]>
): WheelPlayerSpinHistoryListResult => {
  const resp = response?.Body;

  const totalRewards =
    resp?.reduce((rewards, item) => (rewards || 0) + (item.amount || 0), 0) ||
    0;

  const wheelSpinHistoryList: WheelSpinHistoryResult[] =
    resp?.map((item) => {
      const wheelLevel =
        rechargeWheelLevelMapping[item.level || 0] ||
        RechargeWheelLevelType.TIER_SILVER;
      return {
        wheelLevel: wheelLevel,
        rewards: item?.amount || 0,
        createTime: item?.createTime || 0,
      };
    }) || [];
  const sortedListDesc = wheelSpinHistoryList.sort(
    (a, b) => b.createTime - a.createTime
  );
  return {
    totalRewards: totalRewards,
    wheelSpinHistoryList: sortedListDesc,
  };
};
