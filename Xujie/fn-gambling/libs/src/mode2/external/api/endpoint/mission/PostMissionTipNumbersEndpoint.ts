import { ExternalEndpoint } from '@mode2API/types';
import { POST_MISSION_TIP_NUMBERS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface MissionTipNumbersResponse {
  isNewPlayerBonusEffectivity?: boolean; // 新人任务是否生效
  dailyTip?: number;
  newPlayerTip?: number;
  totalTip?: number;
}

export interface MissionTipNumbersResult {
  newPlayerBadge: number;
  dailyBadge: number;
  totalBadge: number;
  isNewPlayerActivityPeriod: boolean; // 是否為新人活動期
}

export const PostMissionTipNumbersEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<MissionTipNumbersResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_MISSION_TIP_NUMBERS_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<MissionTipNumbersResponse>
): MissionTipNumbersResult => {
  const resp = response.Body;

  return {
    newPlayerBadge: resp?.newPlayerTip || 0,
    dailyBadge: resp?.dailyTip || 0,
    totalBadge: resp?.totalTip || 0,
    isNewPlayerActivityPeriod: resp?.isNewPlayerBonusEffectivity || false,
  };
};
