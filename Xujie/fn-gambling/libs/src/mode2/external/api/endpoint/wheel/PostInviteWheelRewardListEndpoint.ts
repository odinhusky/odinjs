import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_REWARD_LIST_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface InviteWheelRewardResponse {
  rewardAmount?: number;
  rewardType?: number;
  rewardedTime?: number;
}

export enum InviteWheelRewardType {
  INVITE = 'Invite',
  FREE = 'Free',
  PINDUODUO = 'Pinduoduo',
}

export interface InviteWheelRewardResult {
  amount: number;
  time: number;
  type: InviteWheelRewardType;
}

export interface InviteWheelRewardListResult {
  rewardList: InviteWheelRewardResult[];
}

//1: 禮包, 2: 免費轉盤獎金, 3: 邀請轉盤獎金 4: 免費轉盤次數 5: 邀請轉盤次數
const typeMapping: Record<number, InviteWheelRewardType> = {
  [1]: InviteWheelRewardType.PINDUODUO,
  [2]: InviteWheelRewardType.FREE,
  [3]: InviteWheelRewardType.INVITE,
};

// Evan Done
/**
 *  邀請輪盤中獎紀錄
 * @param builder
 * @constructor
 */
export const PostInviteWheelRewardListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<InviteWheelRewardListResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_REWARD_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteWheelRewardResponse[]>
): InviteWheelRewardListResult => {
  const resp = response?.Body;
  const rewardList =
    resp?.map((item) => {
      const type =
        typeMapping[item.rewardType || -1] || InviteWheelRewardType.FREE;
      return {
        amount: item.rewardAmount || 0,
        time: item.rewardedTime || 0,
        type: type,
      };
    }) || [];
  const sortedListDesc = rewardList.sort((a, b) => b.time - a.time);
  return {
    rewardList: sortedListDesc,
  };
};

export default PostInviteWheelRewardListEndpoint;
