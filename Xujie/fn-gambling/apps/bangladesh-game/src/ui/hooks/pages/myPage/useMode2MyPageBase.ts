import { useEffect } from 'react';
import {
  handleMyPageActivityLineBtnClick,
  handleMyPageBankAccountLineBtnClick,
  handleMyPageChangePasswordLineBtnClick,
  handleMyPageCustomerSupportLineBtnClick,
  handleMyPageEarnMoneyLineBtnClick,
  handleMyPageFAQLineBtnClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageReloadVersionLineBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { LineBtnUnit, useMyPageStore } from '@mode2/zustand/page/myPageStore';
import useUserInfo from '@mode2/usecase/useUserInfo';
import { usePostVIPHomeMutation } from '@mode2API/index';
import useMyPageHeaderSetting from './useMyPageHeaderSetting';
import useMyPageFooterSetting from '@/ui/hooks/pages/myPage/useMyPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';
import sdkUtils from '@mode2/utils/sdk';
import { useAppStore } from '@mode2/zustand/appStore';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';

export const useMode2MyPageBase = () => {
  useUserInfo();
  // === MyPage Header Setting
  useMyPageHeaderSetting();

  // === MyPage Footer Setting
  useMyPageFooterSetting();

  // === Page FloatActionButton reset
  // 只有當不是開啟my page側邊欄時才要reset
  const { isMobile } = useBreakPoint();
  const openMyDrawer = useMyPageStore((state) => state.openMyDrawer);
  usePageResetFloatActionButton(isMobile || !openMyDrawer);

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

  const setLineBtnList = useMyPageStore((state) => state.setLineBtnList);

  const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);

  useDeepEffect(() => {
    const lineBtnListConfig: LineBtnUnit[] = [
      {
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
      },
      {
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
      },
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
    setLineBtnList(lineBtnListConfig);
  }, [realTimeH5Version]);

  useEffect(() => {
    postVIPHome();
  }, []);

  useEffect(() => {
    sdkUtils.checkVersionUpdate();
  }, []);
};

export default useMode2MyPageBase;
