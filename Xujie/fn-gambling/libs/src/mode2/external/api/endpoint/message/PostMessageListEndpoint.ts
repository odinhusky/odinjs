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

type Attachments = {
  reward: number;
  icon: string;
  isClaim: number;
  isLock: number;
  expireTime: number;
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
  confirmAction?: string;
  // [IN][V6]新增
  attachments: Attachments[];
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

export enum MessageRewardClaimStatus {
  CLAIMABLE = '可領取',
  CLAIMED = '已領取OR已到期',
  LOCKED = '未解鎖',
  NONE = '',
}

export enum MessageActionResult {
  CLOSE = 'CLOSE',
  FORWARD_RECHARGE = 'FORWARD_RECHARGE',
  FORWARD_PERSONAL_INFO = 'FORWARD_PERSONAL_INFO',
  FORWARD_BANK_CARD = 'FORWARD_BANK_CARD',
  FORWARD_SHARE_SPIN = 'FORWARD_SHARE_SPIN',
  FORWARD_INBOX_RECHARGE = 'FORWARD_INBOX_RECHARGE',
}

const MessageActionMapping: Record<string, MessageActionResult> = {
  ['CLOSE']: MessageActionResult.CLOSE,
  ['FORWARD_RECHARGE']: MessageActionResult.FORWARD_RECHARGE,
  ['FORWARD_PERSONAL_INFO']: MessageActionResult.FORWARD_PERSONAL_INFO,
  ['FORWARD_BANK_CARD']: MessageActionResult.FORWARD_BANK_CARD,
  ['FORWARD_SHARE_SPIN']: MessageActionResult.FORWARD_SHARE_SPIN,
  ['FORWARD_INBOX_RECHARGE']: MessageActionResult.FORWARD_INBOX_RECHARGE,
};

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
  // [IN][V6]新增
  isShowAttachments: boolean;
  attachments: Attachments[];
  isLock: number;
  isClaim: number;
  reward: number;
  expireTime: number;
  isExpired: boolean;
  status: MessageRewardClaimStatus;
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
  // const items = mockData;

  const messages: MessageInfoResult[] =
    items.map((item) => {
      // QA 已確認attachments多筆金額共同解鎖共同逾期，所以狀態取第一個即可
      const list: Attachments[] =
        item.attachments && item.attachments.length > 0 ? item.attachments : [];
      const totalReward = list.reduce((sum, item) => sum + item.reward, 0);
      const isShowAttachments = list.length > 0 ? true : false;
      const detail = {
        isLock: list[0]?.isLock || 0,
        isClaim: list[0]?.isClaim || 0,
        reward: totalReward,
        expireTime: list[0]?.expireTime || 0,
      };

      const isExpired = detail.expireTime
        ? new Date(detail.expireTime * 1000) < new Date()
        : true;

      let status: MessageRewardClaimStatus = MessageRewardClaimStatus.CLAIMABLE;
      if (!isExpired && detail.isClaim === 0) {
        status = MessageRewardClaimStatus.CLAIMABLE;
      }
      if (detail.isLock === 1) {
        status = MessageRewardClaimStatus.LOCKED;
      }
      if (isExpired || detail.isClaim === 1) {
        status = MessageRewardClaimStatus.CLAIMED;
      }
      status = isShowAttachments ? status : MessageRewardClaimStatus.NONE;

      const actionResult =
        MessageActionMapping[(item?.confirmAction || '').toUpperCase()] ||
        MessageActionResult.CLOSE;
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
        action: actionResult,

        // [IN][V6]新增
        attachments: list,
        isShowAttachments,
        isLock: detail.isLock,
        isClaim: detail.isClaim,
        reward: detail.reward,
        expireTime: detail.expireTime,
        isExpired,
        status,
      };
    }) || [];

  return {
    total: resp?.total || 0,
    pageSize: resp?.pageSize || 0,
    page: resp?.page || 0,
    messages: messages,
  };
};
