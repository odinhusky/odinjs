import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_PRIZE_WHEEL_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  PrizeWheelType,
  prizeWheelTypeMapping,
} from '@mode2/@types/prizeWheelType';
import dayjs from 'dayjs';

interface PrizeWheelInfoResponse {
  id?: number;
  endTime?: number;
  icon?: number;
  name?: string;
  // reward?: number;
  sort?: number;
  startTime?: number;
  rewardType: number;
}

export interface PromotePrizeWheelResponse {
  curPrize?: PrizeWheelInfoResponse;
  lastSpinPrize?: PrizeWheelInfoResponse;
  prizes?: PrizeWheelInfoResponse[];
  remainSpin?: number;
}

export interface PrizeWheelSegmentResult {
  indexKey: string;
  id: number;
  icon: number;
  name: string;
  // reward: number;
  type: PrizeWheelType;
}

export interface PromotePrizeWheelResult {
  wheelSegments: PrizeWheelSegmentResult[];
  remainSpin: number;
  // depositJackpotWheelLimitedOffersEndTime: number; // TODO 命名容易混亂重新命名
  doubleBuffRechargeBonusLimitedEndTime: number;
  lastSpinPrizeId: number; // 當前 || 上一次中獎id
}

export const PostPromotePrizeWheelEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromotePrizeWheelResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_PRIZE_WHEEL_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromotePrizeWheelResponse>
): PromotePrizeWheelResult => {
  const resp = response.Body;
  const wheelSegments =
    resp?.prizes?.map((item, index) => {
      const prizeWheelType =
        prizeWheelTypeMapping[item?.rewardType || 0] || PrizeWheelType.SPIN;
      return {
        indexKey: `${index}_${item?.id}_${item?.icon}_${item.name}`,
        id: item?.id || 0,
        icon: item?.icon || 0,
        name: item?.name || '',
        type: prizeWheelType,
      };
    }) || [];

  const curPrizeType =
    prizeWheelTypeMapping[resp?.curPrize?.rewardType || 0] ||
    PrizeWheelType.SPIN;

  return {
    wheelSegments: wheelSegments,
    remainSpin: resp?.remainSpin || 0,
    doubleBuffRechargeBonusLimitedEndTime:
      curPrizeType === PrizeWheelType.DEPOSIT_BONUS
        ? resp?.curPrize?.endTime || 0
        : 0, // TODO Evan 充值大獎輪盤，有兩倍充值獎勵倒數時間
    lastSpinPrizeId: resp?.lastSpinPrize?.id || 0, // || defId,
  };
};

export default PostPromotePrizeWheelEndpoint;
