import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGE_READ_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

type MessageReadRequest = {
  idList: number[];
};

export const PostMessageReadEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, MessageReadRequest>({
    query: (data: MessageReadRequest) => {
      return {
        method: 'post',
        url: POST_MESSAGE_READ_URL,
        data: data,
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<number>): boolean => {
  return response.Body === 1;
};
