import { ExternalEndpoint } from '@mode2API/types';
import { POST_MISSION_CLAIM_BOX_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface MissionClaimBoxPayload {
  boxIds: number[];
}

export const PostMissionClaimBoxEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, MissionClaimBoxPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_MISSION_CLAIM_BOX_URL,
        data: { boxId: payload.boxIds },
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  return '';
};
