import { ExternalEndpoint } from '@mode2API/types';
import { POST_MESSAGE_LIST_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export enum MessageCategoryRequest {
  NOTICE = 'NOTICE', // 1
  MAIL = 'MAIL', // 2
}

type MessageListRequest = {
  category: MessageCategoryRequest; // 1 == notify, 2 == mail
  page: number;
  pageSize: number; // deg 20
};

interface MessageInfoResponse {
  userId?: number;
  id?: number;
  title?: string;
  content?: string;
  category?: number;
  read?: boolean;
  // deleted?: boolean;
  createdAt?: number;
  subTitle?: string;
  confirmAction?:
    | 'CLOSE'
    | 'FORWARD_RECHARGE'
    | 'FORWARD_PERSONAL_INFO'
    | 'FORWARD_BANK_CARD';
}

interface MessageListResponse {
  page?: number;
  pageSize?: number;
  total?: number;
  data?: MessageInfoResponse[];
}

export enum MessageCategoryResult {
  NOTICE = 'NOTICE',
  MAIL = 'MAIL',
}

export type MessageActionResult =
  | 'CLOSE'
  | 'FORWARD_RECHARGE'
  | 'FORWARD_PERSONAL_INFO'
  | 'FORWARD_BANK_CARD';

export type MessageInfoResult = {
  indexKey: string;
  category: MessageCategoryResult;
  userId: number;
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: number;
  action: MessageActionResult;
};

export type MessageListResult = {
  total: number;
  pageSize: number;
  page: number;
  messages: MessageInfoResult[];
};

export const PostMessageListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<MessageListResult, MessageListRequest>({
    query: ({ category, ...rest }: MessageListRequest) => {
      const reqData = {
        category: category === MessageCategoryRequest.NOTICE ? 1 : 2,
        ...rest,
      };
      return {
        method: 'post',
        url: POST_MESSAGE_LIST_URL,
        data: reqData,
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<MessageListResponse>
): MessageListResult => {
  const resp = response.Body;
  const items = resp?.data || [];
  const messages: MessageInfoResult[] =
    items.map((item) => {
      return {
        indexKey: `${item?.id}_${item?.userId}_${item?.category}_${item?.createdAt}`,
        category:
          item?.category === 1
            ? MessageCategoryResult.NOTICE
            : MessageCategoryResult.MAIL,
        userId: item?.userId || 0,
        id: item?.id || 0,
        title: item?.title || '',
        content: item?.content || '',
        isRead: item?.read === true,
        createdAt: item?.createdAt || 0,
        action: item?.confirmAction || 'CLOSE',
      };
    }) || [];

  return {
    total: resp?.total || 0,
    pageSize: resp?.pageSize || 0,
    page: resp?.page || 0,
    messages: messages,
  };
};
