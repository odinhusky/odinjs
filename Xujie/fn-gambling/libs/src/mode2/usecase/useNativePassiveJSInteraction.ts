import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
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

interface DeepLinkData {
  path: BasePagePaths;
  options?: NavigateOptions;
  prepAction?: () => void;
}

const mapDeepLinkPath: Record<string, DeepLinkData> = {
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
};

/**
 * 處理深度連結導航目標
 * 處理 oneSignalId 上傳
 */
export const useNativePassiveJSInteraction = () => {
  const navigate = useNavigateClick();
  useEffect(() => {
    sdkUtils.setupNativeDeepLink((path, queryString) => {
      const data = mapDeepLinkPath[path] || BasePagePathObj.HallPage;
      if (data.prepAction) {
        data.prepAction();
      }
      navigate(data.path, data.options);
    });
  }, []);

  useEffect(() => {
    sdkUtils.setupNativePushToken((oneSignalId) => {
      useAppStore.getState().setPushToken(oneSignalId);
    });
  }, []);
};
