import {
  EWebSocketOnMessageType,
  TWebSocketOnMessageResultType,
  WebSocketOnMessageResponseUnit,
} from './type';
import { AllAnnouncementsTypeMappingStrategy } from '@mode2/usecase/announcement/useParsingAnnouncementsContent';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { WebSocketMessageType } from '@libs/mode2/zustand/webSocketStore';

const mockResultData: TWebSocketOnMessageResultType[] = [
  {
    type: EWebSocketOnMessageType.MESSAGE_NOTICE,
    data: {
      id: '-1',
      action: 'close',
      message:
        '<div class=template-1> <img alt=Share Bonus src=https://static.ttgroup.vip/in/v6/activity_lobby_banner/activity_lobby_share_spin.webp /> <div> <p>Get bouns now for posting and sharing</p> <br/> <p>Please keep your post on social media for at least 2 hours and make sure it is set to public. You can participate in the activity every day!</p> <br/> <p>Activity time: 08:00 AM - 22:00 PM</p> <p>Free bonus: ₹28 - 88</p> <p>All members are welcome to join!</p> <br/> <p>Contact us below to participate now and claim your rewards!</p> <br/> <a class=inner-tg-link >Telegram Chat</a> <br/> <br/> <a class=inner-service-link >DEV Online service</a> <br/> <br/></div></div>',
    },
  },
  {
    type: EWebSocketOnMessageType.MESSAGE_POPUP,
    data: {
      id: '-2',
      action: 'close',
      activityType: AnnouncementType.TELEGRAM,
      message: '',
    },
  },
  {
    type: EWebSocketOnMessageType.MESSAGE_NOTICE,
    data: {
      id: '-3',
      action: 'close',
      message: '<div>测试消息</div>',
    },
  },
];

/**
 * 处理websocket response
 * @param response 可能是数字、字符串、对象、数组对象等
 * @returns
 */
export const transformWebSocketResponse = (
  response:
    | WebSocketOnMessageResponseUnit[]
    | string
    | number
    | null
    | object
    | unknown,
  type: WebSocketMessageType
): TWebSocketOnMessageResultType[] => {
  console.log('[WebSocketUtils] origin data', response, type);

  if (type === 'pong') {
    return [];
  }

  // 空值
  // if (response === null || response === undefined) return mockResultData;

  if (!Array.isArray(response)) {
    return [];
  }

  // 数组对象
  if (Array.isArray(response)) {
    return response
      .map((item) => {
        if (item.type === 'notice') {
          return {
            type: EWebSocketOnMessageType.MESSAGE_NOTICE,
            data: {
              id: item.id,
              action: item.action,
              message: item.message,
            },
          };
        } else if (item.type === 'promotion') {
          const activityType =
            AllAnnouncementsTypeMappingStrategy[`${item.activityType || 0}`] ||
            AnnouncementType.UNKNOWN;
          return {
            type: EWebSocketOnMessageType.MESSAGE_POPUP,
            data: {
              id: item.id,
              activityType: activityType,
              action: item.action,
              message: item.message,
            },
          };
        } else {
          console.warn(`[WebSocketUtils] Unknown type in array: ${item.type}`);
          return undefined;
        }
      })
      .filter(
        (item): item is TWebSocketOnMessageResultType => item !== undefined
      );
  }

  // 字符串类型
  if (typeof response === 'string') {
    return mockResultData;
  }

  // 数字类型
  if (typeof response === 'number') {
    return mockResultData;
  }

  // 对象类型
  if (typeof response === 'object') {
    return mockResultData;
  }

  // 未知类型
  console.error('[WebSocketUtils] Unsupported response type');
  return mockResultData;
};
