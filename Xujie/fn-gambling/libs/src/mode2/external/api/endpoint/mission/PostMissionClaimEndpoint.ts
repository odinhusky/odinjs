import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_MISSION_CLAIM_URL } from '@mode2API/urls';

export interface MissionClaimPayload {
  claimWay: number;
  missionId: number;
}

export const PostMissionClaimEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, MissionClaimPayload>({
    query: (payload) => ({
      method: 'post',
      url: POST_MISSION_CLAIM_URL,
      data: { ...payload },
    }),
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  return '';
};
