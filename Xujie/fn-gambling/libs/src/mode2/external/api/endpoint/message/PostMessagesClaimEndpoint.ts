import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGES_CLAIM_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface MessagesClaimPayload {
  ids: number[];
}

export const PostMessagesClaimEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, MessagesClaimPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_MESSAGES_CLAIM_URL,
        data: {
          IdList: payload.ids,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  return response.Body || '';
};
