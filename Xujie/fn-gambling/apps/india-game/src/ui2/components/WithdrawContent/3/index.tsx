import React, { useEffect } from 'react';
import './index.scss';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { WithdrawButton } from './components/WithdrawButton';
import WithdrawWalletState from './components/WithdrawWalletState';
import BankAccountInfo from './components/BankAccountInfo';
import WithdrawalAmountOptions from './components/WithdrawalAmountOptions';
import { WithdrawalLimitList } from './components/WithdrawalLimitList';
import { WithdrawNoteDescription } from '@components/WithdrawNoteDescription';
import WithdrawSuccessModal from './modals/WithdrawSuccessModal';
import BankAccountModal from '@modals/BankAccountModal';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

const FromWalletWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'bgi-[var(--background-light)] bg-fixed bg-bottom',
        'min-h-screen',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 pb-[80px]'
      )}
    >
      {children}
    </div>
  );
};

export const WithdrawContent = () => {
  useEffect(() => {
    useWalletPageStore.getState().resetWalletBottomTipsState();
  }, []);

  return (
    <>
      <FromWalletWrapper>
        <div className={cx('flex flex-col gap-4 py-3 px-4')}>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <WithdrawWalletState />

          <BankAccountInfo />

          <WithdrawalAmountOptions />

          <WithdrawalLimitList />

          <WithdrawNoteDescription />

          <WithdrawButton />
        </div>
      </FromWalletWrapper>
      <WithdrawSuccessModal />
      <BankAccountModal />
    </>
  );
};

export default WithdrawContent;
