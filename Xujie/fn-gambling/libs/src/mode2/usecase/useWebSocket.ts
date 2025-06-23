import WebSocketService from '@libs/commonUtils/websocket';
import { useEffect } from 'react';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import { UserRoleType } from '../@types/userRoleTypes';
import {
  EWebSocketOnMessageType,
  TWebSocketOnMessageResultNotice,
  TWebSocketOnMessageResultPopup,
} from '@libs/commonUtils/websocket/type';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import {
  HallAdModelCommand,
  SocketNotice,
  SourceFrom,
} from '@mode2/usecase/announcement/command/HallAdModelCommand';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { useWebSocketStore } from '@mode2/zustand/webSocketStore';
import { v4 as uuidv4 } from 'uuid';
import {
  LimitedOfferResponse,
  mapLimitedOffersResult,
} from '@mode2API/endpoint/user/PostHomeEndpoint';
import dayjs from 'dayjs';
import useLowBalanceRechargeModalStore from '@mode2/zustand/modal/LowBalanceRechargeModal';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';

interface ActivityTypeByCase {
  doHandleCase: (message: TWebSocketOnMessageResultPopup) => void;
}

const handleActivityTypeByCase: Partial<
  Record<AnnouncementType, ActivityTypeByCase>
> = {
  [AnnouncementType.LOW_BALANCE_RECHARGE]: {
    doHandleCase: (message) => {
      try {
        const nowUnix = dayjs().unix();
        const limitedOffer: LimitedOfferResponse = JSON.parse(
          message.data.message || '{}'
        );
        const result = mapLimitedOffersResult(nowUnix, limitedOffer);

        if (result.countdownTime > 0) {
          useLowBalanceRechargeModalStore
            .getState()
            .upLowBalanceRechargeLimitedOffersEndTime(result.endTime);
          if (result.countdownTime > 0) {
            hallAdModelInvoker.addCommandFromSocket(
              new HallAdModelCommand({
                uniqueId: uuidv4(),
                orderId: -1,
                parameter: '',
                type: AnnouncementType.LOW_BALANCE_RECHARGE,
                from: SourceFrom.WEB_SOCKET,
                onShowAction: (uniqueId, type) => {
                  useModalLayoutStore.getState().setHallAdModelCommandTypes({
                    uniqueId: uniqueId,
                    type: type,
                    parameterJson: '',
                    from: SourceFrom.WEB_SOCKET,
                  });
                },
              })
            );
          }
        }
      } catch (e) {}
    },
  },
  [AnnouncementType.LOW_BALANCE_RESCUE_BOX]: {
    doHandleCase: (message) => {
      const nowUnix = dayjs().unix();
      const limitedOffer: LimitedOfferResponse = JSON.parse(
        message.data.message || '{}'
      );
      const result = mapLimitedOffersResult(nowUnix, limitedOffer);
      useLowBalanceRescueBoxModalStore
        .getState()
        .upLowBalanceRescueBoxLimitedOffersEndTime(result.endTime);

      try {
        hallAdModelInvoker.addCommandFromSocket(
          new HallAdModelCommand({
            uniqueId: uuidv4(),
            orderId: -1,
            parameter: '',
            type: AnnouncementType.LOW_BALANCE_RESCUE_BOX,
            from: SourceFrom.WEB_SOCKET,
            onShowAction: (uniqueId, type) => {
              useModalLayoutStore.getState().setHallAdModelCommandTypes({
                uniqueId: uniqueId,
                type: type,
                parameterJson: '',
                from: SourceFrom.WEB_SOCKET,
              });
            },
          }),
          true // 即時顯示
        );
      } catch (e) {}
    },
  },
};

export const useWebSocket = () => {
  const userRole = useUserProfileStore((state) => state.userRole);
  const status = useWebSocketStore((state) => state.status);

  // 如果走sub domain 在調整為吃設定檔方式['VITE_WEBSOCKET_URL']
  // const url = import.meta.env['VITE_WEBSOCKET_URL'];

  const url = `wss://${window.location.host}/ws/notice`;
  const webSocket = WebSocketService.getInstance(url);

  useEffect(() => {
    webSocket.subscribe('chat', (message) => {
      if (message.type === EWebSocketOnMessageType.MESSAGE_NOTICE) {
        // add useMobileExclusiveModalLayoutOverride
        onMessageNotice(message);
      } else if (message.type === EWebSocketOnMessageType.MESSAGE_POPUP) {
        onMessagePopup(message);
      }
    });
  }, []);

  // 消息類型是 'message_notice'
  const onMessageNotice = (message: TWebSocketOnMessageResultNotice) => {
    console.log('[WebSocketService] 收到 message_notice 消息:', message);
    hallAdModelInvoker.addCommandFromSocket(
      new HallAdModelCommand({
        uniqueId: uuidv4(),
        orderId: -1,
        parameter: JSON.stringify(message.data),
        type: SocketNotice.GLOBAL_NOTICE,
        from: SourceFrom.WEB_SOCKET,
        onShowAction: (uniqueId, type) => {
          useModalLayoutStore.getState().setHallAdModelCommandTypes({
            uniqueId: uniqueId,
            type: type,
            parameterJson: JSON.stringify(message.data),
            from: SourceFrom.WEB_SOCKET,
          });
        },
      })
    );
  };

  // 消息類型是 'message_popup'
  const onMessagePopup = (message: TWebSocketOnMessageResultPopup) => {
    console.log('[WebSocketService] 收到 message_popup 消息:', message);
    // TODO  先暫時解決 parameter問題，依照 activityType 獲取對應 parameterJson
    const popupAnnouncement = usePlatformNotifyStore
      .getState()
      .hallPopupAnnouncementsItems.find(
        (item) => item.type === message.data.activityType
      );
    // TODO  AnnouncementType.UNKNOWN 不加入
    if (message.data.activityType === AnnouncementType.UNKNOWN) {
      console.log(
        '[WebSocketService] 收到 message_popup 消息不支援activityType 被過濾:',
        message
      );
      return;
    }

    // Handle ActivityType By Case [破產充值優惠彈窗，破產獎勵寶箱]
    const doHandleCase = handleActivityTypeByCase[message.data.activityType];
    if (doHandleCase) {
      doHandleCase.doHandleCase(message);
      return;
    }

    // immediately = false 無需要立即處理
    hallAdModelInvoker.addCommandFromSocket(
      new HallAdModelCommand({
        uniqueId: uuidv4(),
        orderId: 999,
        parameter: popupAnnouncement?.popupParameterJson || '',
        type: message.data.activityType,
        from: SourceFrom.WEB_SOCKET,
        onShowAction: (uniqueId, type) => {
          useModalLayoutStore.getState().setHallAdModelCommandTypes({
            uniqueId: uniqueId,
            type: type,
            parameterJson: popupAnnouncement?.popupParameterJson || '',
            from: SourceFrom.WEB_SOCKET,
          });
        },
      })
    );
  };

  // websocket斷連後需要清除webSocketCommands
  useEffect(() => {
    console.log('[WebSocketService] useEffect status:', status);
    if (status !== 'open') {
      hallAdModelInvoker.clearWebSocketCommands();
    }
  }, [status]);

  useEffect(() => {
    console.log('[WebSocketService] useEffect userRole:', userRole);

    if ([UserRoleType.PLAYER, UserRoleType.USER].includes(userRole)) {
      // 角色切換先關閉再連接
      webSocket.close();

      setTimeout(() => {
        webSocket.connect();
      }, 1500);
    }
  }, [userRole]);
};
