import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_CLAIM_TUTORIAL_REWARD_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export const PostRechargeTutorialRewardClaimEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<string, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_RECHARGE_CLAIM_TUTORIAL_REWARD_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  const resp = response?.Body;
  console.log('@@@===> 教學獎勵領取', response);
  return '';
};
