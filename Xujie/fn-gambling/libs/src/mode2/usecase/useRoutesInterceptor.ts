import { Location } from 'react-router-dom';
import { useSensorsDataPageViewReport } from '@mode2/usecase/useSensorsDataPageViewReport';
import { useBindNotifyPushToken } from '@mode2/usecase/useBindNotifyPushToken';
import { useAppStore } from '@mode2/zustand/appStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { SKIP_CLEAR_CLIENT_PARAMETER_ROUTE_WHITE_LIST } from '@mode2/routerTypes/const';
import { useAdjustEventToken } from '@mode2/usecase/platform/useAdjustEventToken';
import { useEffect } from 'react';
import { usePageDurationStore } from '@mode2/zustand/pageDurationStore';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  SentryEventPayload,
  SentryPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';

/**
 * 路由攔截器，處理非定義的路由，
 * 邀請碼攔截
 * 可擴展 deepLink 之類
 * 攔截非正常退出遊戲行為
 * 綁定推播token
 * [BI] pageView 手動上報
 * [APK] JsBridge 延後交互 初始行為  window.android.firstInitialSuccess
 * @param location
 */
export const useRoutesInterceptor = () => {
  const { doPageViewReport } = useSensorsDataPageViewReport();
  const { doBindToken } = useBindNotifyPushToken();

  const { pageDurationEvents, setPageDurationEvent } = usePageDurationStore();
  const deferInteractionTime: number = Number(
    import.meta.env['VITE_NATIVE_DEFER_INTERACTION_TIME'] || 500
  );
  const setReqClientParameter = useAppStore.getState().setReqClientParameter;
  const doInterceptor = (location: Location) => {
    const appStore = useAppStore.getState();

    // 檢查H5當前版本號
    sdkUtils.checkVersionUpdate();

    // 非正常退出遊戲 清除 Request Init Client Parameter
    const isSkipClearClient =
      !SKIP_CLEAR_CLIENT_PARAMETER_ROUTE_WHITE_LIST.find(
        (v) => v === location.pathname
      );
    if (isSkipClearClient) {
      setReqClientParameter('');
    }

    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('referral_code');
    if (referralCode) {
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

    // 頁面停留時間埋點
    const lastPageDurationInfo =
      usePageDurationStore.getState().lastPageDurationInfo;
    const from = lastPageDurationInfo.from;
    const to = location.pathname;
    const pageDuration = dayjs().valueOf() - lastPageDurationInfo.pageDuration; //毫秒
    setPageDurationEvent([
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

    usePageDurationStore.getState().setLastPageDurationInfo({
      from: location.pathname,
      pageDuration: dayjs().valueOf(),
    });
  };

  // 頁面停留時間埋點 上報處理
  useEffect(() => {
    if (pageDurationEvents.length > 0) {
      pageDurationEvents.forEach((item) => {
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
  }, [pageDurationEvents]);

  // Native App or Web 需要跟後端請求當前產品的 Adjust Event Token
  useAdjustEventToken();

  return {
    doInterceptor,
  };
};
