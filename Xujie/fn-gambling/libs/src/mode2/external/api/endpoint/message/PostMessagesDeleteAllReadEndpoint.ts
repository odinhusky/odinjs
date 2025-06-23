import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGES_DELETE_ALL_READ_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export const PostMessagesDeleteAllReadEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_MESSAGES_DELETE_ALL_READ_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  return response.Body || '';
};
