import { ExternalEndpoint } from '@mode2API/types';
import { POST_MISSION_ONGOING_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { MissionActionType } from '@libs/mode2/usecase/page/taskCenterPage/eventHandlers/types';

export enum MissionType {
  NEW_PLAYER = 1,
  DAILY = 2,
  // WEEKLY = 3,
}

export interface MissionOngoingPayload {
  type: MissionType | number; //1: 新人 , 2: 每日 , 3: 每週
}

interface BoxInfoResponse {
  id?: number;
  boxName?: string;
  isClaimed?: boolean;
  isCompleted?: boolean;
  requiredValue?: number;
  damaMultiple?: number;
  rewardRange?: number[];
}

export interface MissionItemResponse {
  id?: number;
  code?: string;
  isClaimed?: boolean;
  isCompleted?: boolean;
  reward?: number;
  activeValue?: number;
  confirmAction?: string;
  title?: string;
  description?: string;
}

interface MissionOngoingResponse {
  activeValue?: number; //活跃度
  expireTime?: number; //活跃度失效时间
  rule?: string;
  missionBoxList?: BoxInfoResponse[];
  missionList?: MissionItemResponse[];
}

export enum MissionState {
  COMPLETE = 'COMPLETE', // 已領取
  CLAIMABLE = 'CLAIMABLE', // 可領取
  INCOMPLETE = 'INCOMPLETE', // 未達成
}

// tips 用
export interface MissionBoxTipsInfoResult {
  damaRatio: number; // 打碼倍數
  rewardRange: number[]; //
}
export interface MissionBoxResult {
  id: number;
  state: MissionState;
  requiredVigor: number; //所需活跃度
  tipsInfo: MissionBoxTipsInfoResult;
}

export interface MissionResult {
  id: number;
  code: string;
  state: MissionState;
  title: string; // 名目
  describe: string; // 描述
  vigor: number; //活跃度
  rewardAmount: number; //獎勵
  actionType: MissionActionType; // 事件類型
}

export interface MissionOngoingResult {
  type: MissionType | number; //1: 新人 , 2: 每日
  vigor: number; //活跃度
  vigorExpireTime: number; //活跃度失效时间
  boxItems: MissionBoxResult[];
  missionList: MissionResult[];
  ruleInnerHtml: string; // 規則
  isAllClaimable: boolean; // 可全部領取
  allClaimableIds: number[]; // 全部可領取的 Ids
}

export const PostMissionOngoingEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<MissionOngoingResult, MissionOngoingPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_MISSION_ONGOING_URL,
        data: { ...payload },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<MissionOngoingResponse>,
  meta: unknown,
  arg: MissionOngoingPayload
): MissionOngoingResult => {
  const resp = response.Body;

  const boxItems: MissionBoxResult[] =
    resp?.missionBoxList?.map((item) => {
      // const state =
      //   item.isClaimed === true
      //     ? MissionState.CLAIMABLE
      //     : item.isCompleted === true
      //     ? MissionState.COMPLETE
      //     : MissionState.INCOMPLETE;

      const state =
        item.isClaimed === true && item.isCompleted === true
          ? MissionState.COMPLETE
          : item.isClaimed === false && item.isCompleted === true
          ? MissionState.CLAIMABLE
          : MissionState.INCOMPLETE;

      return {
        id: item?.id || 0,
        state: state,
        requiredVigor: item?.requiredValue || 0,
        tipsInfo: {
          damaRatio: item?.damaMultiple || 0,
          rewardRange: item?.rewardRange || [0],
        },
      };
    }) || [];

  const missionList: MissionResult[] =
    resp?.missionList?.map((item, index) => {
      // const state =
      //   item.isClaimed === true
      //     ? MissionState.CLAIMABLE
      //     : item.isCompleted === true
      //     ? MissionState.COMPLETE
      //     : MissionState.INCOMPLETE;

      const state =
        item.isClaimed === true && item.isCompleted === true
          ? MissionState.COMPLETE
          : item.isClaimed === false && item.isCompleted === true
          ? MissionState.CLAIMABLE
          : MissionState.INCOMPLETE;
      return {
        id: item?.id || 0,
        code: item?.code || '',
        state: state,
        title: item?.title || `Test Title ${index}`, // TODO Evan
        describe: item?.description || '',
        vigor: item?.activeValue || 0,
        rewardAmount: item?.reward || 0,
        actionType:
          arg.type === MissionType.NEW_PLAYER
            ? (item?.code as MissionActionType) ?? MissionActionType.NOTHING
            : MissionActionType.NAVTOHALL,
      };
    }) || [];

  const allClaimableIds = boxItems.flatMap((box) => {
    return box.state === MissionState.CLAIMABLE ? box.id : [];
  });

  const isAllClaimable = allClaimableIds.length > 0;

  return {
    type: arg.type,
    vigor: resp?.activeValue || 0,
    vigorExpireTime: resp?.expireTime || 0,
    boxItems: boxItems,
    missionList: missionList,
    ruleInnerHtml: resp?.rule || '',
    isAllClaimable: isAllClaimable,
    allClaimableIds,
  };
};
