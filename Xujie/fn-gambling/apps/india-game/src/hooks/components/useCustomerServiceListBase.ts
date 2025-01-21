import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { usePlatformServicesStore } from '@mode2/zustand/platform/platformServicesStore';
import useCustomerServiceAction from '@mode2/action/components/customerServiceList/useCustomerServiceAction';
import { handleCustomerServiceAction } from '@mode2/action/components/customerServiceList/acitonType';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useDeepEffect } from '@commonUtils/hooks';
import sdkUtils from '@mode2/utils/sdk';
import { useCallback } from 'react';
import { AppSchemeData } from '@constant/AppSchemeData';

export const useCustomerServiceListBase = () => {
  const { handleCustomerServiceClick } = useCustomerServiceAction();
  const servicesList = usePlatformServicesStore((state) => state.servicesList);
  const setUsageScenariosList = useCustomerServiceListStore(
    (state) => state.setUsageScenariosList
  );

  const findLink = useCallback(
    (type: ServicesTypeResult, def: string): string => {
      const link = servicesList.find((item) => item.type === type)?.link;
      return link || def;
    },
    [servicesList]
  );


  const getOfficialUrl = (type: ServicesTypeResult): string => {
    const key = type.toLowerCase().replace('_', '');
    const schemeData = AppSchemeData[key];
    return schemeData?.url || '';
  }

  useDeepEffect(() => {
    const linkData: Record<
      ServicesTypeResult,
      { isLink: boolean; target: string }
    > = {
      [ServicesTypeResult.WHATS_APP]: {
        isLink: true,
        target: findLink(ServicesTypeResult.WHATS_APP, getOfficialUrl(ServicesTypeResult.WHATS_APP)),
      },
      [ServicesTypeResult.INSTAGRAM]: {
        isLink: true,
        target: findLink(ServicesTypeResult.INSTAGRAM, getOfficialUrl(ServicesTypeResult.INSTAGRAM)),
      },
      [ServicesTypeResult.TELEGRAM]: {
        isLink: true,
        target: findLink(ServicesTypeResult.TELEGRAM, getOfficialUrl(ServicesTypeResult.TELEGRAM)),
      },
      [ServicesTypeResult.LIVE_CHAT]: {
        isLink: true,
        target: findLink(ServicesTypeResult.LIVE_CHAT, ''),
      },
      [ServicesTypeResult.YOUTUBE]: {
        isLink: true,
        target: findLink(ServicesTypeResult.YOUTUBE, getOfficialUrl(ServicesTypeResult.YOUTUBE)),
      },
      [ServicesTypeResult.FACEBOOK]: {
        isLink: true,
        target: findLink(
          ServicesTypeResult.FACEBOOK, getOfficialUrl(ServicesTypeResult.FACEBOOK)),
      },
      [ServicesTypeResult.TIKTOK]: {
        isLink: true,
        target: findLink(ServicesTypeResult.TIKTOK, getOfficialUrl(ServicesTypeResult.TIKTOK)),
      },
      [ServicesTypeResult.TWITTER]: {
        isLink: true,
        target: findLink(ServicesTypeResult.TWITTER, getOfficialUrl(ServicesTypeResult.TWITTER)),
      },
      [ServicesTypeResult.UNKNOWN]: { isLink: true, target: '' },
    };

    const whatsAppInfo = {
      label: 'Whatsapp',
      type: ServicesTypeResult.WHATS_APP,
      payload: linkData[ServicesTypeResult.WHATS_APP],
      icon: 'social/icon_whatsapp',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.WHATS_APP],
        });
      },
    };

    const instagramInfo = {
      label: 'Instagram',
      type: ServicesTypeResult.INSTAGRAM,
      payload: linkData[ServicesTypeResult.INSTAGRAM],
      icon: 'social/icon_instagram',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.INSTAGRAM],
        });
      },
    };

    const telegramInfo = {
      label: 'Telegram',
      type: ServicesTypeResult.TELEGRAM,
      payload: linkData[ServicesTypeResult.TELEGRAM],
      icon: 'social/icon_telegram',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.TELEGRAM],
        });
      },
    };

    const liveChatInfo = {
      label: 'LiveChat',
      type: ServicesTypeResult.LIVE_CHAT,
      payload: linkData[ServicesTypeResult.LIVE_CHAT],
      icon: 'social/icon_live_chat',
      onActionClick: () => {
        sdkUtils.openChat(() => {
          handleCustomerServiceClick({
            actionName: handleCustomerServiceAction,
            payload: linkData[ServicesTypeResult.LIVE_CHAT],
          });
        });
      },
    };

    const youtubeInfo = {
      label: 'Youtube',
      type: ServicesTypeResult.YOUTUBE,
      payload: linkData[ServicesTypeResult.YOUTUBE],
      icon: 'social/icon_youtube',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.YOUTUBE],
        });
      },
    };

    const facebookInfo = {
      label: 'Facebook',
      type: ServicesTypeResult.FACEBOOK,
      payload: linkData[ServicesTypeResult.FACEBOOK],
      icon: 'social/icon_facebook',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.FACEBOOK],
        });
      },
    };

    const tiktokInfo = {
      label: 'Tiktok',
      type: ServicesTypeResult.TIKTOK,
      payload: linkData[ServicesTypeResult.TIKTOK],
      icon: 'social/icon_tiktok',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.TIKTOK],
        });
      },
    };

    const twitterInfo = {
      label: '',
      type: ServicesTypeResult.TWITTER,
      payload: linkData[ServicesTypeResult.TWITTER],
      icon: 'social/icon_twitter',
      onActionClick: () => {
        handleCustomerServiceClick({
          actionName: handleCustomerServiceAction,
          payload: linkData[ServicesTypeResult.TWITTER],
        });
      },
    };

    const drawerMenuScenarios = {
      scenarios: CustomerServiceScenarios.DRAWER_MENU,
      customerServiceList: [
        telegramInfo,
        instagramInfo,
        youtubeInfo,
        whatsAppInfo,
      ],
    };

    const fabScenarios = {
      scenarios: CustomerServiceScenarios.FAB,
      customerServiceList: [
        liveChatInfo,
        telegramInfo,
        instagramInfo,
        youtubeInfo,
        whatsAppInfo,
      ],
    };

    const loginScenarios = {
      scenarios: CustomerServiceScenarios.LOGIN,
      customerServiceList: [
        telegramInfo,
        instagramInfo,
        youtubeInfo,
        whatsAppInfo,
      ],
    };

    const inviteScenarios = {
      scenarios: CustomerServiceScenarios.INVITE,
      customerServiceList: [
        telegramInfo,
        instagramInfo,
        youtubeInfo,
        whatsAppInfo,
        facebookInfo,
        tiktokInfo,
        twitterInfo,
      ],
    };

    const footerScenarios = {
      scenarios: CustomerServiceScenarios.FOOTER,
      customerServiceList: [
        liveChatInfo,
        telegramInfo,
        instagramInfo,
        youtubeInfo,
        whatsAppInfo,
      ],
    };

    const feedbackScenarios = {
      scenarios: CustomerServiceScenarios.FEEDBACK,
      customerServiceList: [liveChatInfo],
    };

    setUsageScenariosList([
      fabScenarios,
      drawerMenuScenarios,
      loginScenarios,
      inviteScenarios,
      footerScenarios,
      feedbackScenarios,
    ]);
  }, [servicesList]);
};
