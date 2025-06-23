import { useAppStore } from '@mode2/zustand/appStore';
import {
  BottomNavigationScenarios,
  BottomNavigationUnit,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import { useBreakPoint } from '@libs/commonUtils';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { formatMoney } from '@mode2/utils';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';
import { today } from '@libs/constant/date';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const disabledBottomNavigationPageList = [
  BasePagePathObj.GamePage,
  BasePagePathObj.GameLobbyPage,
  BasePagePathObj.MoreGamePage,
  BasePagePathObj.RecordPage,
  BasePagePathObj.LoginPage,
  BasePagePathObj.ActivityRulePage,
  BasePagePathObj.SubordinateDataPage,
  BasePagePathObj.SharePage,
  BasePagePathObj.RewardsDetail,
  BasePagePathObj.FullOrderDetailPage,
  BasePagePathObj.ActivityRecordPage,
  BasePagePathObj.GiftCodeRedeemPage,
  BasePagePathObj.AccountPage,
  BasePagePathObj.SettingPage,
  BasePagePathObj.OrderDetailPage,
  BasePagePathObj.VipPage,
  BasePagePathObj.VipBonusPage,
  BasePagePathObj.SearchGamePage,
  BasePagePathObj.InboxDetailPage,
] as const;

export const useBottomNavigationBase = () => {
  const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);

  const setDisplayBottomNavigation = useBottomNavigationStore(
    (state) => state.setDisplayBottomNavigation
  );

  const setUsageScenariosList = useBottomNavigationStore(
    (state) => state.setUsageScenariosList
  );

  const maxWheelReward = usePlatformDynamicConfigStore(
    (state) => state.maxWheelReward
  );

  const missionTipCount = useTemplateLayoutStore(
    (state) => state.missionTipCount
  );

  const realPhone = useUserProfileStore((state) => state.realPhone);
  const hasSetPassword = useUserProfileStore((state) => state.hasSetPassword);
  const bindReferralCode = useUserProfileStore(
    (state) => state.bindReferralCode
  );
  // 未綁定電話、未設置密碼、未綁定推薦碼的提示數量
  const showInfoUnreadCount = [
    !realPhone,
    !hasSetPassword,
    !bindReferralCode,
  ].filter(Boolean).length;
  const realTimeH5VersionCount = realTimeH5Version.isNewVersion ? 1 : 0;

  const breakPoint = useBreakPoint();
  const location = useLocation();

  const inviteTimeRedDot = useRedDotStore((state) => state.inviteTimeRedDot);
  const setInviteTimeRedDot = useRedDotStore(
    (state) => state.setInviteTimeRedDot
  );

  useEffect(() => {
    const isDisabled = !(
      disabledBottomNavigationPageList as readonly BasePagePaths[]
    ).includes(location.pathname as BasePagePaths);
    setDisplayBottomNavigation(
      (breakPoint.isMobile || breakPoint.isTablet) && isDisabled
    );
  }, [location, breakPoint]);

  // 首頁
  const homeButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_home' },
    icon: 'ic_home',
    iconActive: 'ic_home',
    isDrop: false,
    isShowRedDot: false,
    isActive: location.pathname === BasePagePathObj.HallPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.HallPage,
    },
    unReadCount: 0,
  };

  // 活動
  const activityButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_activity' },
    icon: 'ic_activity',
    iconActive: 'ic_activity',
    isDrop: false,
    isShowRedDot: false,
    isActive: location.pathname === BasePagePathObj.ActivityPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.ActivityPage,
    },
    unReadCount: 0,
  };

  // 錢包
  const walletButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_wallet' },
    icon: 'ic_wallet',
    iconActive: 'ic_wallet',
    isDrop: false,
    isShowRedDot: false,
    isActive: location.pathname === BasePagePathObj.WalletPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.WalletPage,
    },
    unReadCount: 0,
  };

  // 個人頁
  const accountButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_account' },
    icon: 'ic_user',
    iconActive: 'ic_user',
    isDrop: false,
    isShowRedDot: realTimeH5Version.isNewVersion,
    isActive: location.pathname === BasePagePathObj.MyPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.MyPage,
    },
    unReadCount: 0,
  };

  //  邀請
  const earnButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_earn' },
    icon: 'ic_earn_money',
    iconActive: 'ic_earn_money',
    isDrop: false,
    isShowRedDot: inviteTimeRedDot,
    isActive: location.pathname === BasePagePathObj.InvitePage,
    actionPayload: {
      navigateTarget: BasePagePathObj.InvitePage,
    },
    unReadCount: 0,
  };

  // 團隊俱樂部
  const teamClubButton: BottomNavigationUnit = {
    labelKey: { i18nKey: 'leftnav_earn' },
    icon: 'ic_earn_money',
    iconActive: 'ic_earn_money',
    isDrop: false,
    isShowRedDot: false,
    isActive: location.pathname === BasePagePathObj.TeamClubPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.TeamClubPage,
      options: { state: { tab: TeamClubPageTabType.MY_REWARDS } },
    },
    unReadCount: 0,
  };

  // 邀請輪盤入口
  const inviteWheelButton: BottomNavigationUnit = {
    labelKey: {
      i18nKey: 'tabbar_spin_and_share_wheel',
      i18nOption: { maxWheelReward: formatMoney({ value: maxWheelReward }) },
    },
    icon: '',
    iconActive: '',
    isDrop: false,
    isShowRedDot: false,
    isActive: location.pathname === BasePagePathObj.InviteWheelPage,
    actionPayload: {
      navigateTarget: BasePagePathObj.InviteWheelPage,
    },
    unReadCount: 0,
  };

  const fetchData = async () => {
    const inviteTime = await userLocalForage.getItem(
      UserLocalforageStoreKeys.INVITE_TIME
    );
    setInviteTimeRedDot(inviteTime !== today);
  };

  fetchData();

  useEffect(() => {
    const defaultList = [
      homeButton,
      walletButton,
      { ...earnButton, isDrop: true },
      activityButton,
      accountButton,
    ].map((item) => ({
      ...item,
      isActive: location.pathname === item.actionPayload.navigateTarget,
    }));

    const defaultScenarios = {
      scenarios: BottomNavigationScenarios.DEFAULT,
      bottomNavigationList: defaultList,
    };

    const teamClubList = [
      homeButton,
      walletButton,
      { ...teamClubButton, isDrop: true, isShowRedDot: inviteTimeRedDot },
      activityButton,
      accountButton,
    ].map((item) => ({
      ...item,
      isActive: location.pathname === item.actionPayload.navigateTarget,
    }));

    const teamClubScenarios = {
      scenarios: BottomNavigationScenarios.TEAM_CLUB,
      bottomNavigationList: teamClubList,
    };
    const inviteWheelList = [
      homeButton,
      activityButton,
      { ...inviteWheelButton, isDrop: true },
      { ...teamClubButton, isShowRedDot: inviteTimeRedDot },
      accountButton,
    ].map((item) => ({
      ...item,
      isActive: location.pathname === item.actionPayload.navigateTarget,
    }));

    const inviteWheelScenarios = {
      scenarios: BottomNavigationScenarios.INVITE_WHEEL,
      bottomNavigationList: inviteWheelList,
    };

    const V6_DEFAULT = {
      scenarios: BottomNavigationScenarios.V6_DEFAULT,
      bottomNavigationList: [
        homeButton,
        activityButton,
        { ...inviteWheelButton, isDrop: true },
        { ...teamClubButton, ishowRedDot: false },
        {
          ...accountButton,
          isShowRedDot:
            sdkUtils.isCurrentLogin() &&
            (realTimeH5Version.isNewVersion ||
              showInfoUnreadCount > 0 ||
              Number(missionTipCount) > 0),
          unReadCount:
            showInfoUnreadCount + missionTipCount + realTimeH5VersionCount,
        },
      ].map((item) => ({
        ...item,
        isActive: location.pathname === item.actionPayload.navigateTarget,
      })),
    };

    setUsageScenariosList([
      defaultScenarios,
      teamClubScenarios,
      inviteWheelScenarios,
      V6_DEFAULT,
    ]);
  }, [
    realTimeH5Version,
    location.pathname,
    inviteTimeRedDot,
    showInfoUnreadCount,
    missionTipCount,
  ]);
};
