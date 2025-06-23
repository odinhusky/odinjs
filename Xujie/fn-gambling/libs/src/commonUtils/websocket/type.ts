import { AnnouncementType } from '@mode2/@types/announcementType';

export type WebSocketOnMessageResponseUnit = {
  id: string;
  activityType: string;
  timestamp: string;
  expireAt: string;
  message: string;
  type: 'notice' | 'promotion';
  action: 'forward' | 'confirm' | 'cancel' | 'close';
};

export type WebSocketOnMessageResponse = {
  type: 'message' | 'chat';
  data: WebSocketOnMessageResponseUnit[];
};

// -------

export enum EWebSocketOnMessageType {
  MESSAGE_NOTICE = 'message_notice',
  MESSAGE_POPUP = 'message_popup',
}

export type TWebSocketOnMessageResultNotice = {
  type: EWebSocketOnMessageType.MESSAGE_NOTICE;
  data: {
    id: string;
    action: 'forward' | 'confirm' | 'cancel' | 'close'; // TODO
    message: string;
  };
};

export type TWebSocketOnMessageResultPopup = {
  type: EWebSocketOnMessageType.MESSAGE_POPUP;
  data: {
    id: string;
    activityType: AnnouncementType;
    action: 'forward' | 'confirm' | 'cancel' | 'close'; // TODO
    message: string;
  };
};

export type TWebSocketOnMessageResultType =
  | TWebSocketOnMessageResultNotice
  | TWebSocketOnMessageResultPopup;
