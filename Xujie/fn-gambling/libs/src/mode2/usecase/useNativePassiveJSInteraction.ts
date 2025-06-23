import { useCallback, useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { useAppStore } from '@mode2/zustand/appStore';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import {
  RecordPageBalanceRecordTabs,
  RecordPageTabs,
} from '@mode2/zustand/page/recordPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

interface DeepLinkData {
  path: BasePagePaths;
  options?: NavigateOptions;
  prepAction?: () => void;
  isSupportParams?: boolean; // 支援查詢參數
}

const baseDeepLinkMap: Record<string, DeepLinkData> = {
  '/home': { path: BasePagePathObj.HallPage },
  '/wallet': { path: BasePagePathObj.WalletPage },
  '/activity': { path: BasePagePathObj.ActivityPage },
  '/account': { path: BasePagePathObj.MyPage },
  '/invite': { path: BasePagePathObj.InvitePage },
  '/inbox': {
    path: BasePagePathObj.FeedBackPage,
    options: { state: { tab: feedBackPageTabIdObj.INBOX } },
    prepAction: () => {
      useMode2FeedBackPageTabStore
        .getState()
        .setActiveTabId(feedBackPageTabIdObj.INBOX);
    },
  },
  '/teamClub': {
    path: BasePagePathObj.TeamClubPage,
    options: { state: { tab: TeamClubPageTabType.MY_REWARDS } },
  },
  '/transferRecord': {
    path: BasePagePathObj.RecordPage,
    options: {
      state: {
        tab: RecordPageTabs.RECORD,
        subTab: RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD,
      },
    },
  },
  '/depositRecord': {
    path: BasePagePathObj.RecordPage,
    options: {
      state: {
        tab: RecordPageTabs.RECORD,
        subTab: RecordPageBalanceRecordTabs.ADD_CASH_RECORD,
      },
    },
  },
  '/withdrawalRecord': {
    path: BasePagePathObj.RecordPage,
    options: {
      state: {
        tab: RecordPageTabs.RECORD,
        subTab: RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD,
      },
    },
  },
  '/rechargeWheel': { path: BasePagePathObj.RechargeWheelPage },
  '/inviteWheel': { path: BasePagePathObj.InviteWheelPage },
  '/giftCode': { path: BasePagePathObj.GiftCodeRedeemPage },
  '/vip': {
    path: BasePagePathObj.ActivityPage,
    options: {
      state: {
        tab: ActivityPageTabType.VIP,
      },
    },
  },
  '/mission': { path: BasePagePathObj.TaskCenterPage },
  '/ranking': { path: BasePagePathObj.RankingPage },
  '/secretRecharge': { path: BasePagePathObj.RechargeSecretPage },
  '/rescueBox': { path: BasePagePathObj.LowBalanceRescueBoxPage },
  '/moreGame': { path: BasePagePathObj.MoreGamePage, isSupportParams: true },
};

const versionPatches: Record<string, Partial<Record<string, DeepLinkData>>> = {
  v6: {
    '/vip': { path: BasePagePathObj.VipPage }, // v6 切出 ActivityPage，獨立頁面
    '/depositRecord': { path: BasePagePathObj.OrderDetailPage },
    '/home': { path: BasePagePathObj.HallPage, isSupportParams: true },
  },
};

// 合併基礎映射與版本覆蓋
const getDeepLinkMapByVersion = (): Record<string, DeepLinkData> => {
  const version = import.meta.env['VITE_V_VERSION'] || '';
  const patch = versionPatches[version] || {};

  return Object.entries({ ...baseDeepLinkMap, ...patch }).reduce<
    Record<string, DeepLinkData>
  >((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * 處理深度連結導航目標
 * 處理 oneSignalId 上傳
 */
export const useNativePassiveJSInteraction = () => {
  const { mapRoutesNavTo } = useNavPageClick();
  const userRole = useUserProfileStore((state) => state.userRole);

  const handleNavTo = useCallback(
    (path: string, query: string, options?: NavigateOptions) => {
      mapRoutesNavTo(path, query, options);
    },
    [userRole]
  );

  const doEventDeepLinkIntercept = async (
    path: string,
    queryString: string
  ) => {
    console.log('@@@===> native deep link', path, queryString);
    // apk deeplink 時機為 onNewIntent，App在背景未銷毀 收到deeplink事件
    if (queryString.includes('wake_up_from=pixel')) {
      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: 'posthog.onceIdentify',
        postHogType: PostHogPayloadType.ONCE_IDENTIFY,
        parameter: '{}',
      });
      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: 'posthog.webDeepLink',
        postHogType: PostHogPayloadType.WEB_DEEP_LINK,
        parameter: '{}',
      });
    } else {
      sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
        event: 'posthog.notifyDeepLink',
        postHogType: PostHogPayloadType.NOTIFY_DEEP_LINK,
        parameter: JSON.stringify({
          deepLinkPath: path,
          deepLinkQueryString: queryString,
        }),
      });
    }
  };

  const getDeepLinkQuery = (isSupportParams: boolean, queryString: string) => {
    if (isSupportParams) {
      return `?${queryString}`;
    } else {
      return '';
    }
  };

  const getDeepLinkOptions = (
    isSupportParams: boolean,
    queryString: string
  ) => {
    if (isSupportParams) {
      try {
        return Object.fromEntries(new URLSearchParams(queryString).entries());
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  };

  useEffect(() => {
    sdkUtils.setupNativeDeepLink((path, queryString) => {
      doEventDeepLinkIntercept(path, queryString);

      // 開啟 loading
      useLoadingStore.getState().setShowLoading(true);

      const mapDeepLinkPath = getDeepLinkMapByVersion();
      const data = mapDeepLinkPath[path] || BasePagePathObj.HallPage;
      if (data.prepAction) {
        data.prepAction();
      }
      useAppStore.getState().setNewIntentDeepLinkWakeUpCount();
      useLoadingStore.getState().setShowLoading(false);

      handleNavTo(
        data.path,
        getDeepLinkQuery(data.isSupportParams === true, queryString),
        {
          ...data.options,
          ...getDeepLinkOptions(data.isSupportParams === true, queryString),
        }
      );
    });
  }, [userRole]);

  useEffect(() => {
    sdkUtils.setupNativePushToken((oneSignalId) => {
      useAppStore.getState().setPushToken(oneSignalId);
    });
  }, []);
};
