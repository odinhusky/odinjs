import { Location } from 'react-router-dom';
import { useSensorsDataPageViewReport } from '@mode2/usecase/useSensorsDataPageViewReport';
import { useBindNotifyPushToken } from '@mode2/usecase/useBindNotifyPushToken';
import { useAppStore } from '@mode2/zustand/appStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { SKIP_CLEAR_CLIENT_PARAMETER_ROUTE_WHITE_LIST } from '@mode2/routerTypes/const';
import { useAdjustEventToken } from '@mode2/usecase/platform/useAdjustEventToken';
import { usePageDurationStore } from '@mode2/zustand/pageDurationStore';
import dayjs from '@commonUtils/localizedDayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  SentryEventPayload,
  SentryPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { ReportEvent } from '@libs/mode2/utils/sdk/strategy/analytics/local/types';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

/**
 * 路由攔截器，處理非定義的路由，
 * 邀請碼攔截
 * 可擴展 deepLink 之類
 * 攔截非正常退出遊戲行為
 * 綁定推播token
 * [BI] pageView 手動上報
 * [APK] JsBridge 延後交互 初始行為  window.android.firstInitialSuccess
 * @param location
 *
 *
 * @author Evan
 * @date 2025-03-12
 * @optimization
 * 降低渲染次數，移除 const { pageDurationEvents, setPageDurationEvent } = usePageDurationStore(); 寫法
 * 增加 sendPageDurationReport ， 在每次 doInterceptor 攔截時去認是否有需要上報資料，並上報
 */
export const useRoutesInterceptor = () => {
  const { doPageViewReport } = useSensorsDataPageViewReport();
  const { doBindToken } = useBindNotifyPushToken();
  // const { pageDurationEvents, setPageDurationEvent } = usePageDurationStore();

  const deferInteractionTime: number = Number(
    import.meta.env['VITE_NATIVE_DEFER_INTERACTION_TIME'] || 500
  );
  // const setReqClientParameter = useAppStore.getState().setReqClientParameter;
  const doInterceptor = (location: Location) => {
    const appStore = useAppStore.getState();

    sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
      event: 'posthog.pageView',
      postHogType: PostHogPayloadType.PAGE_VIEW,
      parameter: JSON.stringify({
        currentUrl: window.location.href,
      }),
    });

    // 檢查H5當前版本號
    sdkUtils.checkVersionUpdate();

    // 非正常退出遊戲 清除 Request Init Client Parameter
    const isSkipClearClient =
      !SKIP_CLEAR_CLIENT_PARAMETER_ROUTE_WHITE_LIST.find(
        (v) => v === location.pathname
      );
    if (isSkipClearClient) {
      useAppStore.getState().setReqClientParameter('');
    }

    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('referral_code');
    if (referralCode) {
      useAppStore.getState().setTemporaryReferralCode(referralCode);
      sdkUtils.setStorage(AppLocalStorageKey.REFERRAL_CODE, referralCode);
    }

    // android 延後交互  app start 只交互一次
    if (!appStore.isAndroidFirstInteractionSuccess) {
      setTimeout(() => {
        sdkUtils.firstInitialSuccess();
        appStore.setAndroidFirstInteractionSuccess(true);
      }, deferInteractionTime);
    }

    // 綁定推播 token
    doBindToken();

    // [BI] pageview event 手動上報
    doPageViewReport(location);

    // 嘗試獲取 gaid, adid，如果已經存在，則會自動略過
    Promise.all([
      sdkUtils.getGoogleADID(2, 300),
      sdkUtils.getAdjustADID(2, 300),
    ])
      .then(() => {})
      .catch(() => {});

    // 先執行上報
    sendPageDurationReport();

    // 頁面停留時間埋點
    const lastPageDurationInfo =
      usePageDurationStore.getState().lastPageDurationInfo;
    const from = lastPageDurationInfo.from;
    const to = location.pathname;
    const pageDuration = dayjs().valueOf() - lastPageDurationInfo.pageDuration; //毫秒

    usePageDurationStore.getState().setPageDurationEvent([
      {
        id: uuidv4(),
        message: from,
        extra: {
          from: from,
          to: to,
          pageDuration: pageDuration,
        },
      },
    ]);

    const reportEvent = {
      url: `${window.location.origin}${from}`,
      event: ReportEvent.PAGE_STAY,
      action: from,
      playerId: `${useUserProfileStore.getState().id}`,
      playerToken: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
      userRole: useUserProfileStore.getState().userRole,
      deviceId: sdkUtils.getDeviceID(),
      os: sdkUtils.getOs(),
      version: import.meta.env['VITE_VERSION'],
      duration: pageDuration, // 停留時間秒數, eg: 15.02
      timestamp: dayjs().unix(),
      additional: null,
    };
    // local PAGE_STAY 上報事件
    sdkUtils.addReportEvent(reportEvent);

    // sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
    //   event: 'postHog.event',
    //   postHogType: PostHogPayloadType.EVENT,
    //   parameter: JSON.stringify(reportEvent),
    // });

    usePageDurationStore.getState().setLastPageDurationInfo({
      from: location.pathname,
      pageDuration: dayjs().valueOf(),
    });
  };

  // 頁面停留時間埋點 上報處理
  const sendPageDurationReport = () => {
    if (usePageDurationStore.getState().pageDurationEvents.length > 0) {
      usePageDurationStore.getState().pageDurationEvents.forEach((item) => {
        const { id, ...rest } = item;
        sdkUtils.sendAnalyticsEvent<SentryEventPayload>({
          event: 'sentry.pageDuration',
          sentryType: SentryPayloadType.PAGE_DURATION,
          severityLevel: 'info',
          profile: JSON.stringify(rest),
        });
        usePageDurationStore.getState().clearEvent(id);
      });
    }
  };

  // Native App or Web 需要跟後端請求當前產品的 Adjust Event Token
  useAdjustEventToken();

  return {
    doInterceptor,
  };
};
