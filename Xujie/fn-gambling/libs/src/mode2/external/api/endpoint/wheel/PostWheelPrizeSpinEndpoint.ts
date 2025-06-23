import { ExternalEndpoint } from '@mode2API/types';
import { POST_WHEEL_PRIZE_SPIN_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  PrizeWheelType,
  prizeWheelTypeMapping,
} from '@mode2/@types/prizeWheelType';

interface WheelPrizeSpinResponse {
  id?: number;
  endTime?: number;
  icon?: number;
  name?: string;
  // reward?: number;
  sort?: number;
  startTime?: number;
  rewardType: number;
}

export interface WheelPrizeSpinResult {
  id: number;
  icon: number;
  name: string;
  type: PrizeWheelType;
}

export const PostWheelPrizeSpinEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WheelPrizeSpinResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WHEEL_PRIZE_SPIN_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelPrizeSpinResponse>
): WheelPrizeSpinResult => {
  const resp = response?.Body;

  const prizeWheelType =
    prizeWheelTypeMapping[resp?.rewardType || 0] || PrizeWheelType.SPIN;
  const result = {
    id: resp?.id || 0,
    icon: resp?.icon || 0,
    name: resp?.name || '',
    type: prizeWheelType, // TODO Evan is PrizeWheelType.DEPOSIT_BONUS 獲取新資訊 PostPromotePrizeWheelEndpoint
    // TODO prizeWheelType === PrizeWheelType.CASh  刷新user info 資訊
  };

  console.log('@@@===>evan.result', result);

  return {
    id: resp?.id || 0,
    icon: resp?.icon !== undefined ? resp.icon : -1,
    name: resp?.name || '',
    type: prizeWheelType, // TODO Evan is PrizeWheelType.DEPOSIT_BONUS 獲取新資訊 PostPromotePrizeWheelEndpoint
    // TODO prizeWheelType === PrizeWheelType.CASh  刷新user info 資訊
  };
};

export default PostWheelPrizeSpinEndpoint;
