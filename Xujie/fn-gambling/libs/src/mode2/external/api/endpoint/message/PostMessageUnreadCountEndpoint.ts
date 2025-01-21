import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGE_UNREAD_COUNT_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface MessageUnreadCountResponse {
  Notice?: number;
  Mail?: number;
}

export type MessageUnreadCountResult = {
  noticeUnreadCount: number;
  mailUnreadCount: number;
};

export const PostMessageUnreadCountEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<MessageUnreadCountResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_MESSAGE_UNREAD_COUNT_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<MessageUnreadCountResponse>
): MessageUnreadCountResult => {
  const resp = response.Body;
  return {
    noticeUnreadCount: resp?.Notice || 0,
    mailUnreadCount: resp?.Mail || 0,
  };
};
