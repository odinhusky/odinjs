import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_TUTORIAL_STATUS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface RechargeTutorialStatusResponse {
  canGetReward?: boolean;
  isActivityEnable?: boolean;
}

export interface RechargeTutorialStatusResult {
  // canGetReward: boolean;
  // isActivityEnable: boolean;
  isEnable: boolean;
}

export const PostRechargeTutorialStatusEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeTutorialStatusResult, void>({
    query: () => ({
      method: 'post',
      url: POST_RECHARGE_TUTORIAL_STATUS_URL,
      data: {},
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RechargeTutorialStatusResponse>
): RechargeTutorialStatusResult => {
  const resp = response?.Body;
  return {
    isEnable: resp?.canGetReward === true && resp?.isActivityEnable === true,
    // canGetReward: resp?.canGetReward === true,
    // isActivityEnable: resp?.isActivityEnable === true,
  };
};
