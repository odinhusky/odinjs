import { useTranslation } from 'react-i18next';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { KYC_BOTH_STATE } from '@constant/KYC';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

// for [V6]  特別判斷行為前置
export const useNavToWalletWithdrawInterceptorForV6 = () => {
  const { t } = useTranslation();
  const { checkIsBankFirstBind } = useUserVerifyState();

  const { navToBindKYCPage } = useNavPageClick();

  const doBeforeNavigation = () => {
    const userRole = useUserProfileStore.getState().userRole;
    if (checkIsBankFirstBind() && userRole === UserRoleType.USER) {
      useWalletPageStore.getState().setWalletWeakTipsState({
        isShowClose: true,
        title: t('withdrawal_bind_account_tips_title'),
        content: t('withdrawal_bind_account_tips_content'),
        primaryBtnText: t('withdrawal_bind_account_tips_confirm_button_text'),
        secondaryBtnText: t('withdrawal_bind_account_tips_cancel_button_text'),
        isShow: true,
        onPrimaryCallback: () => {
          navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
        },
      });
    }
  };

  return { doBeforeNavigation };
};

export default useNavToWalletWithdrawInterceptorForV6;
