import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_DAILY_MISSION_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  MissionResult,
  MissionState,
} from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';
import { MissionActionType } from '@libs/mode2/usecase/page/taskCenterPage/eventHandlers/types';

interface MissionResponse {
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
export interface PromoteDailyMissionResponse {
  deadLine?: number; // unix
  missionList?: MissionResponse[];
}

export interface PromoteDailyMissionResult {
  missionList: MissionResult[];
  resetCountDown: number;
}

export const PostPromoteDailyMissionEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteDailyMissionResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_DAILY_MISSION_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteDailyMissionResponse>
): PromoteDailyMissionResult => {
  const resp = response.Body;
  const missionList: MissionResult[] =
    resp?.missionList?.map((item, index) => {
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
    resetCountDown: resp?.deadLine || 0,
  };
};
