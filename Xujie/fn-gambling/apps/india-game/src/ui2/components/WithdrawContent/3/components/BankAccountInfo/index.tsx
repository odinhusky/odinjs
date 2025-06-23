import { useTranslation } from 'react-i18next';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import React, { useEffect } from 'react';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import cx from '@commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@constant/style';
import { Icon } from '@components/Icon';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageAddAccountBtnClick } from '@mode2/action/actionTypes';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

/**
 * Evan for [V6] Done
 */
export const BankAccountInfo = () => {
  const { t } = useTranslation();
  const bankAccountInfo = useKycDataStore((state) => state.bankAccountInfo);
  const { handleWalletPageClick } = useWalletPageActions();
  const { checkIsBankFirstBind } = useUserVerifyState();
  const setWalletWeakTipsState = useWalletPageStore(
    (state) => state.setWalletWeakTipsState
  );
  const setShowBankAccountModal = useWalletPageStore(
    (state) => state.setShowBankAccountModal
  );
  const handleViewAccountAction = () => {
    setShowBankAccountModal(true);
  };

  const resetWeakTipsState = {
    isShow: false,
    isShowClose: true,
    title: t('withdrawal_bind_account_tips_title'),
    content: t('withdrawal_bind_account_tips_content'),
    primaryBtnText: t('withdrawal_bind_account_tips_confirm_button_text'),
    secondaryBtnText: t('withdrawal_bind_account_tips_cancel_button_text'),
  };

  const handleAddAccountAction = () => {
    setWalletWeakTipsState({
      ...resetWeakTipsState,
      isShow: true,
      onPrimaryCallback: () => {
        handleWalletPageClick({
          actionName: handleWalletPageAddAccountBtnClick,
        });
      },
    });
  };

  // useEffect(() => {
  //   if (checkIsBankFirstBind()) {
  //     handleAddAccountAction();
  //   }
  // }, []);

  return (
    <div
      className={cx(
        'flex flex-col gap-[6px]',
        'bgi-text-[var(--grayscale-100)] text-base font-medium'
      )}
    >
      <div className="flex justify-between items-start">
        <p>{t('withdrawal_bank_account')}</p>
        {!checkIsBankFirstBind() ? (
          <div
            className={cx(
              'text-sm font-normal bgi-text-[var(--base-1-main)]',
              'cursor-pointer underline'
            )}
            onClick={() => {
              handleViewAccountAction();
            }}
          >
            {t('withdrawal_view_account')}
          </div>
        ) : null}
      </div>

      {!checkIsBankFirstBind() ? (
        <div
          className={cx(
            'flex justify-between gap-2',
            'px-2 py-3',
            'bgi-[var(--linear-4)] rounded-md',
            'text-sm '
          )}
        >
          <p className={''}>{t(`Acc No. ${bankAccountInfo.bankCode}`)}</p>
          <p className={''}>{t(`IFSC: ${bankAccountInfo.ifsc}`)}</p>
        </div>
      ) : (
        <BaseSecondaryBtn
          className={cx(
            'w-auto h-auto',
            'font-medium text-base',
            'py-2',
            'bgi-[var(--base-2-variant6)]'
          )}
          classNameText={cx(FLEX_ITEMS_CENTER)}
          onClick={() => {
            handleWalletPageClick({
              actionName: handleWalletPageAddAccountBtnClick,
            });
            // handleAddAccountAction();
          }}
          children={
            <>
              <Icon className="h-5 w-5" name="ic_add" />
              <span className="bgi-text-[var(--base-1-main)] ml-2.5">
                {t('withdrawal_add_new_account')}
              </span>
            </>
          }
        />
      )}
    </div>
  );
};

export default BankAccountInfo;
