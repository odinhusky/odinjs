import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGES_DELETE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface MessagesDeletePayload {
  ids: number[];
}

export const PostMessagesDeleteEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, MessagesDeletePayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_MESSAGES_DELETE_URL,
        data: { messageIds: payload.ids },
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  return response.Body || '';
};
