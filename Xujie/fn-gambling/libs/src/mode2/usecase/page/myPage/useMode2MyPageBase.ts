import { useEffect } from 'react';
import {
  handleMyPageAboutUsActionClick,
  handleMyPageActivityLineBtnClick,
  handleMyPageBankAccountLineBtnClick,
  handleMyPageBankDetailActionClick,
  handleMyPageChangePasswordLineBtnClick,
  handleMyPageCustomerSupportLineBtnClick,
  handleMyPageDownloadAppLineBtnClick,
  handleMyPageEarnMoneyLineBtnClick,
  handleMyPageFAQLineBtnClick,
  handleMyPageGiftCodeLineBtnClick,
  handleMyPageMissionActionClick,
  handleMyPageMyInfoActionClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageReloadVersionLineBtnClick,
  handleMyPageTeamClubLineBtnClick,
} from '@mode2/action/actionTypes';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import {
  LineBtnUnit,
  MyPageBtnListScenarios,
  useMyPageStore,
} from '@mode2/zustand/page/myPageStore';
import { usePostVIPHomeMutation } from '@mode2API/index';
import useMyPageHeaderSetting from './useMyPageHeaderSetting';
import useMyPageFooterSetting from './useMyPageFooterSetting';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import sdkUtils from '@mode2/utils/sdk';
import { useAppStore } from '@mode2/zustand/appStore';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { AccountPageTypes } from '@libs/mode2/zustand/page/accountPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const useMode2MyPageBase = () => {
  // === MyPage Header Setting
  useMyPageHeaderSetting();

  // === MyPage Footer Setting
  useMyPageFooterSetting();

  // === Page FloatActionButton reset
  // 只有當不是開啟my page側邊欄時才要reset
  const { isMobile } = useBreakPoint();
  const openMyDrawer = useMyPageStore((state) => state.openMyDrawer);
  // usePageResetFloatActionButton(isMobile || !openMyDrawer);
  useMode2PageResetFloatActionButton(isMobile || !openMyDrawer);

  const { handleMyPageClick } = useMyPageActions();

  const [postVIPHome, { data: vipHome }] = usePostVIPHomeMutation();

  // - Bet Progress ======================================
  const setBetProgressPercent = useMyPageStore(
    (state) => state.setBetProgressPercent
  );

  const setRechargeAmount = useMyPageStore((state) => state.setRechargeAmount);
  const setVipProgressPercent = useMyPageStore(
    (state) => state.setVipProgressPercent
  );
  const setLackRechargeAmount = useMyPageStore(
    (state) => state.setLackRechargeAmount
  );
  const setVipRewardDama = useMyPageStore((state) => state.setVipRewardDama);

  useEffect(() => {
    if (!vipHome) return;

    setBetProgressPercent(vipHome.betAmountPercent);
    setRechargeAmount(vipHome.rechargeAmount);
    setVipProgressPercent(vipHome.vipPercent);
    setLackRechargeAmount(vipHome.lackRechargeAmount);
    setVipRewardDama(vipHome.rewardDamaTimes);
  }, [vipHome]);

  // - Line Button List ======================================

  const setUsageScenariosList = useMyPageStore(
    (state) => state.setUsageScenariosList
  );

  const missionTipCount = useTemplateLayoutStore(
    (state) => state.missionTipCount
  );

  const realPhone = useUserProfileStore((state) => state.realPhone);
  const hasSetPassword = useUserProfileStore((state) => state.hasSetPassword);
  const bindReferralCode = useUserProfileStore(
    (state) => state.bindReferralCode
  );
  const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);
  const shouldShowDownloadAppButton =
    !sdkUtils.isPwaInstalled() &&
    !sdkUtils.isInNative() &&
    !sdkUtils.isIOSKernel();
  // 未綁定電話、未設置密碼、未綁定推薦碼的提示數量
  const showInfoUnreadCount = [
    !realPhone,
    !hasSetPassword,
    !bindReferralCode,
  ].filter(Boolean).length;

  const activityButton: LineBtnUnit = {
    iconName: 'activity',
    name: { i18nKey: 'leftnav_activity' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageActivityLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  const earnMoneyButton: LineBtnUnit = {
    iconName: 'earn_money',
    name: { i18nKey: 'account_menu_earn_money' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageEarnMoneyLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  const teamClubButton: LineBtnUnit = {
    iconName: 'earn_money',
    name: { i18nKey: 'leftnav_earn' },
    isBorder: true,

    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageTeamClubLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  const giftCodeButton: LineBtnUnit = {
    iconName: 'gift_code',
    name: { i18nKey: 'gift_code_item' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageGiftCodeLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  // 個人詳細信息
  const myInfoButton: LineBtnUnit = {
    iconName: 'info',
    name: { i18nKey: 'profile_my_info_page_title' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageMyInfoActionClick,
        payload: { value: AccountPageTypes.MYINFO },
      });
    },
    unReadCount: 0,
  };

  // 任務中心
  const missionButton: LineBtnUnit = {
    iconName: 'mission',
    name: { i18nKey: 'profile_task_page_title' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageMissionActionClick,
        // payload: { value: AccountPageTypes.MYINFO },
      });
    },
    unReadCount: 0,
  };

  const balanceDetailButtton: LineBtnUnit = {
    iconName: 'bank',
    name: { i18nKey: 'profile_balance_details_item' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageBankDetailActionClick,
      });
    },
    unReadCount: 0,
  };

  const aboutButtton: LineBtnUnit = {
    iconName: 'aboutus',
    name: { i18nKey: 'profile_about_us_item' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageAboutUsActionClick,
      });
    },
    unReadCount: 0,
  };

  // TODO Evan 無作用先移除
  // const settinglButtton = {
  //   iconName: 'setting',
  //   name: { i18nKey: 'profile_settings_item' },
  //   isBorder: true,
  //   isShowRedDot: false,
  //   isShowArrow: true,
  //   onAction: () => {
  //     handleMyPageClick({
  //       actionName: handleMyPagSettingActionClick,
  //     });
  //   },
  // };

  const customerSupportButton: LineBtnUnit = {
    iconName: 'customer_support',
    name: { i18nKey: 'profile_live_support_item' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageCustomerSupportLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  const reloadH5VersionButton: LineBtnUnit = {
    iconName: 'reload',
    name: { i18nKey: 'account_menu_refresh_version' },
    isBorder: false,
    isShowRedDot: realTimeH5Version.isNewVersion,
    isShowArrow: false,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageReloadVersionLineBtnClick,
      });
    },
    unReadCount: realTimeH5Version.isNewVersion ? 1 : 0,
  };

  const downloadAppButton: LineBtnUnit = {
    iconName: 'download_app',
    name: { i18nKey: 'account_menu_download_app' },
    isBorder: false,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageDownloadAppLineBtnClick,
      });
    },
    unReadCount: 0,
  };

  const fixedList: LineBtnUnit[] = [
    {
      iconName: 'user',
      name: { i18nKey: 'account_menu_personal_information' },
      isBorder: true,
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPagePersonalInformationLineBtnClick,
        });
      },
      unReadCount: 0,
    },
    {
      iconName: 'bank_account', // 還不知道 icon 叫什麼名字
      name: { i18nKey: 'account_menu_bank_account' },
      isBorder: true,
      color: 'var(--base-2-main)',
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageBankAccountLineBtnClick,
        });
      },
      unReadCount: 0,
    },
    {
      iconName: 'change_password',
      name: { i18nKey: 'account_menu_change_password' },
      isBorder: true,
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageChangePasswordLineBtnClick,
        });
      },
      unReadCount: 0,
    },
    {
      iconName: 'question',
      name: { i18nKey: 'account_menu_faq' },
      isBorder: true,
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageFAQLineBtnClick,
        });
      },
      unReadCount: 0,
    },
    {
      iconName: 'customer_support_1',
      name: { i18nKey: 'account_menu_customer_support' },
      isBorder: true,
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageCustomerSupportLineBtnClick,
        });
      },
      unReadCount: 0,
    },
    {
      iconName: 'reload',
      name: { i18nKey: 'account_menu_refresh_version' },
      isBorder: false,
      isShowRedDot: realTimeH5Version.isNewVersion,
      isShowArrow: false,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageReloadVersionLineBtnClick,
        });
      },
      unReadCount: 0,
    },
  ];

  useDeepEffect(() => {
    const defaultList = [activityButton, earnMoneyButton, ...fixedList];

    const defaultScenarios = {
      scenarios: MyPageBtnListScenarios.DEFAULT,
      usageScenariosList: defaultList,
    };

    const giftCodeScenarios = {
      scenarios: MyPageBtnListScenarios.GIFT_CODE,
      usageScenariosList: [
        activityButton,
        giftCodeButton,
        teamClubButton,
        ...fixedList,
      ],
    };

    // IN[V6]
    const v6VersionDefaultScenarios = {
      scenarios: MyPageBtnListScenarios.V6_VERSION_DEFAULT,
      usageScenariosList: [
        {
          ...myInfoButton,
          isShowRedDot: showInfoUnreadCount > 0,
          unReadCount: showInfoUnreadCount,
        },
        {
          ...missionButton,
          isShowRedDot: Number(missionTipCount) > 0,
          unReadCount: missionTipCount,
        },
        balanceDetailButtton,
        customerSupportButton,
        giftCodeButton,
        aboutButtton,
        ...(shouldShowDownloadAppButton ? [downloadAppButton] : []),
        reloadH5VersionButton,
        // settinglButtton, TODO Evan 無作用先移除
      ],
    };

    setUsageScenariosList([
      defaultScenarios,
      giftCodeScenarios,
      v6VersionDefaultScenarios,
    ]);
  }, [realTimeH5Version, missionTipCount, showInfoUnreadCount]);

  useEffect(() => {
    postVIPHome();
  }, []);

  useEffect(() => {
    sdkUtils.checkVersionUpdate();
  }, []);
};

export default useMode2MyPageBase;
