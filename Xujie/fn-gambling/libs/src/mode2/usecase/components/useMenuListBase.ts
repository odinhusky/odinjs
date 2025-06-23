import { ActivityPageTabType } from '@libs/mode2/@types/activityPageTabType';
import { TeamClubPageTabType } from '@libs/mode2/@types/teamClubPageTabType';
import { BasePagePathObj, BasePagePaths } from '@libs/mode2/routerTypes/types';
import {
  MenuScenarios,
  useMenuListStore,
} from '@libs/mode2/zustand/components/menuListStore';
import { useNavigateClick } from '../useNavPageClick';
import { handleMenuRouterActionClick } from '@mode2/action/actionTypes';
import useMenuAction from '@libs/mode2/action/components/menu/menuAction';
import { useShowMenuStore } from '@libs/mode2/zustand/menuStore';
import { NavigateOptions } from 'react-router';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import { today } from '@libs/constant/date';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { useMode2ActivitySwitchPageStore } from '@libs/mode2/zustand/page/activityPageStore';
import {
  RecordPageTabs,
  useRecordPageStore,
} from '@libs/mode2/zustand/page/recordPageStore';
import { useMode2TeamClubPageStore } from '@libs/mode2/zustand/page/teamClubPageStore';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InvitePageTabType } from '@libs/mode2/@types/invitePageTabTyp';
import { useMode2InviteTabStore } from '@libs/mode2/zustand/page/invitePageStore';
import { usePlatformDynamicConfigStore } from '@libs/mode2/zustand/platform/platformDynamicConfig';
import { useBreakPoint } from '@libs/commonUtils';
import { useIsLoginStore } from '@libs/mode2/zustand/loginStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

const useMenuListBase = () => {
  const navigate = useNavigateClick();
  const { handleMenuClick } = useMenuAction();
  const location = useLocation();
  const { isDesktop } = useBreakPoint();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );
  const setCurTab = useMode2TeamClubPageStore((state) => state.setCurTab);
  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);
  const setPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );
  const setTabIndex = useRecordPageStore((state) => state.setTabIndex);

  const inviteTimeRedDot = useRedDotStore((state) => state.inviteTimeRedDot);
  const setInviteTimeRedDot = useRedDotStore(
    (state) => state.setInviteTimeRedDot
  );

  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );
  const isEnableRankingReward = usePlatformDynamicConfigStore(
    (state) => state.isEnableRankingReward
  );

  const setMenuUsageScenariosList = useMenuListStore(
    (state) => state.setMenuUsageScenariosList
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  // 首頁
  const homeButton = {
    label: 'leftnav_home',
    icon: 'ic_home',
    action: () => handleMenuRouter(BasePagePathObj.HallPage),
  };

  // 錢包 - 充值
  const depositButton = {
    label: 'wallet_nav_deposit',
    icon: 'ic_wallet',
    param: '5',
    action: () => {
      setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
      handleMenuRouter(BasePagePathObj.WalletPage, {
        state: { tab: WalletPageTabType.DEPOSIT },
      });
    },
  };

  // 錢包 - 提現
  const withdrawButton = {
    label: 'wallet_nav_withdraw',
    icon: 'ic_withdraw',
    action: () => {
      if (useUserProfileStore.getState().userRole === UserRoleType.USER) {
        setCurSwitchContentTabId(WalletPageTabType.WITHDRAW);
      }
      handleMenuRouter(BasePagePathObj.WalletPage, {
        state: { tab: WalletPageTabType.WITHDRAW },
      });
    },
  };

  // 邀請 - 賺錢
  const earnButton = {
    label: 'leftnav_earn',
    icon: 'ic_earn_money',
    param: '10000',
    action: () => {
      userLocalForage.setItem(UserLocalforageStoreKeys.INVITE_TIME, today);
      setInviteTimeRedDot(false);
      setInviteCurTab(InvitePageTabType.EARN);
      handleMenuRouter(BasePagePathObj.InvitePage, {
        state: { tab: InvitePageTabType.EARN },
      });
    },
  };

  // 邀請 - 統計
  const statisticsButton = {
    label: 'leftnav_statistics',
    icon: 'ic_earn_money',
    action: () => {
      setInviteCurTab(InvitePageTabType.STATISTICS);
      handleMenuRouter(BasePagePathObj.InvitePage, {
        state: { tab: InvitePageTabType.STATISTICS },
      });
    },
  };

  // 邀請 - 團隊資料
  const teamDataButton = {
    label: 'leftnav_team_data',
    action: () => {
      setInviteCurTab(InvitePageTabType.TEAM_DATA);
      handleMenuRouter(BasePagePathObj.InvitePage, {
        state: { tab: InvitePageTabType.TEAM_DATA },
      });
    },
  };

  // 邀請 - 排行榜
  const rankListButton = {
    label: 'leftnav_ranking_list',
    action: () => {
      setInviteCurTab(InvitePageTabType.RANKING_LIST);
      handleMenuRouter(BasePagePathObj.InvitePage, {
        state: { tab: InvitePageTabType.RANKING_LIST },
      });
    },
    isHide: !isEnableRankingReward,
  };

  // 俱樂部 - 邀請好友
  const shareForBonusButton = {
    label: 'earn_tab_1',
    icon: '',
    action: () => {
      userLocalForage.setItem(UserLocalforageStoreKeys.INVITE_TIME, today);
      setCurTab(TeamClubPageTabType.SHARE_FOR_BONUS);
      setInviteTimeRedDot(false);
      handleMenuRouter(BasePagePathObj.TeamClubPage, {
        state: { tab: TeamClubPageTabType.SHARE_FOR_BONUS },
      });
    },
  };

  // 俱樂部 - 我的獎勵
  const myRewardsButton = {
    label: 'earn_tab_2',
    icon: '',
    action: () => {
      setCurTab(TeamClubPageTabType.MY_REWARDS);
      handleMenuRouter(BasePagePathObj.TeamClubPage, {
        state: { tab: TeamClubPageTabType.MY_REWARDS },
      });
    },
  };

  // 俱樂部 - 邀請獎勵
  const inviteRewardsButton = {
    label: 'earn_tab_3',
    icon: '',
    action: () => {
      setCurTab(TeamClubPageTabType.INVITE_REWARDS);
      handleMenuRouter(BasePagePathObj.TeamClubPage, {
        state: { tab: TeamClubPageTabType.INVITE_REWARDS },
      });
    },
  };

  // 俱樂部 - 規則
  const rulesButton = {
    label: 'earn_tab_4',
    icon: '',
    action: () => {
      setCurTab(TeamClubPageTabType.RULES);
      handleMenuRouter(BasePagePathObj.TeamClubPage, {
        state: { tab: TeamClubPageTabType.RULES },
      });
    },
  };

  // 活動 - 活動大廳
  const activityButton = {
    label: 'leftnav_activity',
    icon: 'ic_activity',
    param: '2',
    action: () => {
      setPageIdx(ActivityPageTabType.ACTIVITY);
      handleMenuRouter(BasePagePathObj.ActivityPage, {
        state: { tab: ActivityPageTabType.ACTIVITY },
      });
    },
  };

  // 活動 - VIP
  const vipButton = {
    label: 'leftnav_vip',
    icon: 'ic_vip',
    param: '99999',
    active:
      location.pathname === BasePagePathObj.ActivityPage &&
      pageIdx === ActivityPageTabType.VIP,
    action: () => {
      setPageIdx(ActivityPageTabType.VIP);
      handleMenuRouter(BasePagePathObj.ActivityPage, {
        state: { tab: ActivityPageTabType.VIP },
      });
    },
  };

  // 帳戶
  const accountButton = {
    label: 'leftnav_account',
    icon: 'ic_user',
    active: location.pathname === BasePagePathObj.MyPage,
    action: () => handleMenuRouter(BasePagePathObj.MyPage),
  };

  // 個人資料
  const personalButton = {
    label: 'leftnav_personal_information',
    icon: '',
    action: () =>
      handleMenuRouter(BasePagePathObj.BindKYCPage, {
        state: { tab: KYC_PERSONAL_STATE },
      }),
  };

  // 紀錄 - 記錄
  const recordButton = {
    label: 'leftnav_balance_record',
    icon: 'ic_balance_record',
    action: () => {
      setTabIndex(RecordPageTabs.RECORD);
      handleMenuRouter(BasePagePathObj.RecordPage, {
        state: { tab: RecordPageTabs.RECORD },
      });
    },
  };

  // 紀錄 - 報表
  const reportButton = {
    label: 'leftnav_balance_report',
    icon: 'ic_balance_report',
    action: () => {
      setTabIndex(RecordPageTabs.REPORT);
      handleMenuRouter(BasePagePathObj.RecordPage, {
        state: { tab: RecordPageTabs.REPORT },
      });
    },
  };

  // 錢包 group
  const walletButtonGroup = {
    label: 'leftnav_wallet',
    icon: 'ic_wallet',
    action: () => {
      handleMenuRouter(BasePagePathObj.WalletPage, {
        state: { tab: WalletPageTabType.DEPOSIT },
      });
    },
    children: [depositButton, withdrawButton],
  };

  const earnButtonGroup = {
    label: 'leftnav_earn_money',
    icon: 'ic_earn_money',
    isShowRedDot: inviteTimeRedDot,
    action: () => {
      handleMenuRouter(BasePagePathObj.InvitePage, {
        state: { tab: InvitePageTabType.STATISTICS },
      });
    },
    children: [earnButton, statisticsButton, teamDataButton, rankListButton],
  };

  // 俱樂部 group
  const teamClubButtonGroup = {
    label: 'leftnav_earn', // 'leftnav_earn_money',
    icon: 'ic_earn_money',
    isShowRedDot: inviteTimeRedDot,
    action: () => {
      handleMenuRouter(BasePagePathObj.TeamClubPage, {
        state: { tab: TeamClubPageTabType.MY_REWARDS },
      });
    },
    children: [
      shareForBonusButton,
      myRewardsButton,
      inviteRewardsButton,
      rulesButton,
    ],
  };

  // 活動大廳 group
  const activityButtonGroup = {
    label: 'leftnav_activity',
    icon: 'ic_activity',
    action: () => {
      handleMenuRouter(BasePagePathObj.ActivityPage, {
        state: { tab: ActivityPageTabType.ACTIVITY },
      });
    },
    children: [activityButton, vipButton],
  };

  // 帳戶 group
  const accountButtonGroup = {
    label: 'leftnav_account',
    icon: 'ic_user',
    active: location.pathname === BasePagePathObj.MyPage,
    action: () => handleMenuRouter(BasePagePathObj.MyPage),
    children: [personalButton, recordButton, reportButton],
  };

  useEffect(() => {
    const defaultSideMenuScenarios = {
      scenarios: MenuScenarios.DEFAULT_SIDE_MENU,
      menuList: [
        homeButton,
        walletButtonGroup,
        earnButtonGroup,
        activityButtonGroup,
        accountButtonGroup,
      ],
    };
    const defaultDrawerMenuScenarios = {
      scenarios: MenuScenarios.DEFAULT_DRAWER_MENU,
      menuList: [vipButton, accountButton, earnButtonGroup],
    };

    const teamClubSideMenuScenarios = {
      scenarios: MenuScenarios.TEAM_CLUB_SIDE_MENU,
      menuList: [
        homeButton,
        walletButtonGroup,
        teamClubButtonGroup,
        activityButtonGroup,
        accountButtonGroup,
      ],
    };
    const teamClubDrawerMenuScenarios = {
      scenarios: MenuScenarios.TEAM_CLUB_DRAWER_MENU,
      menuList: [vipButton, accountButton, teamClubButtonGroup],
    };

    // mode1 [side & drawer] menu
    const inMode1CommonMenuScenarios = {
      scenarios: MenuScenarios.IN_MODE1_COMMON_MENU,
      menuList: [
        depositButton,
        withdrawButton,
        {
          ...earnButton,
          label: 'leftnav_invite_earn',
          iconColor: 'var(--base-1-main)',
        },
        {
          ...depositButton,
          label: 'leftnav_recharge_bonus',
          iconColor: 'var(--base-1-main)',
        },
        {
          ...vipButton,
          label: 'leftnav_bonus_monthly',
          iconColor: 'var(--base-1-main)',
        },
        { ...activityButton, label: 'leftnav_loss_in_cash_back' },
        activityButton,
        recordButton,
        reportButton,
      ],
    };

    const pkMode1CommonMenuScenarios = {
      scenarios: MenuScenarios.PK_MODE1_COMMON_MENU,
      menuList: [
        {
          ...statisticsButton,
          label: 'leftnav_invite_earn',
          param: '10000',
        },
        {
          ...vipButton,
          label: 'leftnav_bonus_monthly',
          param: '99999',
        },
        activityButton,
        depositButton,
        withdrawButton,
        recordButton,
        reportButton,
      ],
    };

    setMenuUsageScenariosList([
      defaultSideMenuScenarios,
      defaultDrawerMenuScenarios,
      teamClubSideMenuScenarios,
      teamClubDrawerMenuScenarios,
      inMode1CommonMenuScenarios,
      pkMode1CommonMenuScenarios,
    ]);
  }, [isDesktop, inviteTimeRedDot, isLogin, userRole]);

  const handleMenuRouter = (path: BasePagePaths, options?: NavigateOptions) => {
    handleMenuClick({
      actionName: handleMenuRouterActionClick,
      payload: {
        callback: () => {
          navigate(path, options);
          useShowMenuStore.getState().closeMenu();
        },
      },
    });
  };
};

export default useMenuListBase;
