import { useEffect } from 'react';
import {
  handleMyPageAboutUsActionClick,
  handleMyPageActivityLineBtnClick,
  handleMyPageBankAccountLineBtnClick,
  handleMyPageBankDetailActionClick,
  handleMyPageChangePasswordLineBtnClick,
  handleMyPageCustomerSupportLineBtnClick,
  handleMyPageEarnMoneyLineBtnClick,
  handleMyPageFAQLineBtnClick,
  handleMyPageGiftCodeLineBtnClick,
  handleMyPageMyInfoActionClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageReloadVersionLineBtnClick,
  handleMyPageTeamClubLineBtnClick,
  handleMyPagSettingActionClick,
} from '@mode2/action/myPageAction/acitonType';
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
  const setVipLevel = useMyPageStore((state) => state.setVipLevel);

  useEffect(() => {
    if (!vipHome) return;

    setBetProgressPercent(vipHome.betAmountPercent);
    setRechargeAmount(vipHome.rechargeAmount);
    setVipLevel(vipHome.vipLevel);
  }, [vipHome]);

  // - Line Button List ======================================

  const setUsageScenariosList = useMyPageStore(
    (state) => state.setUsageScenariosList
  );

  const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);

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
  };

  // 個人詳細信息
  const myInfoButton = {
    iconName: 'info',
    name: { i18nKey: 'My info' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageMyInfoActionClick,
        payload: { value: AccountPageTypes.MYINFO },
      });
    },
  };

  const balanceDetailButtton = {
    iconName: 'bank',
    name: { i18nKey: 'Balance details' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageBankDetailActionClick,
      });
    },
  };

  const aboutButtton = {
    iconName: 'aboutus',
    name: { i18nKey: 'About us' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageAboutUsActionClick,
      });
    },
  };

  const settinglButtton = {
    iconName: 'setting',
    name: { i18nKey: 'Setting' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPagSettingActionClick,
      });
    },
  };

  const customerSupportButton = {
    iconName: 'customer_support',
    name: { i18nKey: 'Live support' },
    isBorder: true,
    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageCustomerSupportLineBtnClick,
      });
    },
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
    },
    {
      iconName: 'customer_support',
      name: { i18nKey: 'account_menu_customer_support' },
      isBorder: true,
      isShowRedDot: false,
      isShowArrow: true,
      onAction: () => {
        handleMyPageClick({
          actionName: handleMyPageCustomerSupportLineBtnClick,
        });
      },
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
        myInfoButton,
        balanceDetailButtton,
        customerSupportButton,
        giftCodeButton,
        aboutButtton,
        settinglButtton,
      ],
    };

    setUsageScenariosList([
      defaultScenarios,
      giftCodeScenarios,
      v6VersionDefaultScenarios,
    ]);
  }, [realTimeH5Version]);

  useEffect(() => {
    postVIPHome();
  }, []);

  useEffect(() => {
    sdkUtils.checkVersionUpdate();
  }, []);
};

export default useMode2MyPageBase;
