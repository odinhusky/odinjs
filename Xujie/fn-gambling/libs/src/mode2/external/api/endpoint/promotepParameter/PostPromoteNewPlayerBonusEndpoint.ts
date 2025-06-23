import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_NEW_PLAYER_BONUS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  MissionResult,
  MissionState,
} from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';
import { MissionActionType } from '@libs/mode2/usecase/page/taskCenterPage/eventHandlers/types';

export interface PromoteNewPlayerBonusResponse {
  id?: number;
  code?: string;
  isClaimed?: boolean;
  isCompleted?: boolean;
  reward?: number;
  activeValue?: number;
  confirmAction?: string;
  title?: string; // TODO Evan 跟後端確認
  description?: string;
}

export interface PromoteNewPlayerBonusResult {
  missionList: MissionResult[];
}

export const PostPromoteNewPlayerBonusEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteNewPlayerBonusResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_NEW_PLAYER_BONUS_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteNewPlayerBonusResponse[]>
): PromoteNewPlayerBonusResult => {
  const resp = response.Body;

  const missionList: MissionResult[] =
    resp?.map((item, index) => {
      const state =
        item.isClaimed === true
          ? MissionState.CLAIMABLE
          : item.isCompleted === true
          ? MissionState.COMPLETE
          : MissionState.INCOMPLETE;
      return {
        id: item?.id || 0,
        code: item?.code || '',
        state: state,
        title: item?.title || `Test Title ${index}`, // TODO Evan
        describe: item?.description || '',
        vigor: item?.activeValue || 0,
        rewardAmount: item?.reward || 0,
        actionType: MissionActionType.NOTHING,
      };
    }) || [];

  return {
    missionList: missionList,
  };
};
