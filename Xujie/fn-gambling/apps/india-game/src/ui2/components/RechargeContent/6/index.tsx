import React from 'react';
import cx from '@commonUtils/cx';
import { RechargeCardDescription } from '@components/RechargeCardDescription';
import useRechargeContentBase from '@/ui/hooks/components/rechargeContent/useRechargeContentBase';
import RechargeLimit from './components/RechargeLimit';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import CurrentlyPayProductInfo from './components/CurrentlyPayProductInfo';
import RechargeButton from './components/RechargeButton';
import RechargeBonusSwitch from './components/RechargeBonusSwitch';
import RechargeWeakTipsModal from './components/RechargeWeakTipsModal';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import PayChannelAmountOptions from '@components/PayChannelAmountOptions';
import PayChannelList from '@components/PayChannelList';
import InProgressCountTipsModel from './components/InProgressCountTipsModel';
import RechargeRepeatTopUpBonusModal from './components/RechargeRepeatTopUpBonusModal';
import DoubleBuffRechargeBonusTitle from './components/DoubleBuffRechargeBonusTitle';
import { RechargeContentProps } from '../RechargeContentProps';

const FromGameWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'pt-8',
        'bgi-[var(--background-light)]',
        'bg-fixed bg-bottom',
        'min-h-screen pb-[80px]'
      )}
    >
      {children}
    </div>
  );
};
const FromWalletWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'bgi-[var(--background-light)]',
        'bg-fixed bg-bottom',
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

export const RechargeContent = ({
  isRechargeFromGame = false,
}: RechargeContentProps) => {
  useRechargeContentBase({ isRechargeFromGame });
  const { handleWalletPageClick } = useWalletPageActions();

  const LayoutWrapper = isRechargeFromGame
    ? FromGameWrapper
    : FromWalletWrapper;
  return (
    <>
      <LayoutWrapper>
        <div className={cx('flex flex-col gap-2 py-3 px-4')}>
          <DoubleBuffRechargeBonusTitle />

          <RechargeLimit />

          <CurrentlyPayProductInfo />

          <PayChannelAmountOptions />

          <PayChannelList />

          <RechargeBonusSwitch />

          <RechargeCardDescription />

          <RechargeButton isRechargeFromGame={isRechargeFromGame} />
        </div>
      </LayoutWrapper>

      <InProgressCountTipsModel
        isRechargeFromGame={isRechargeFromGame}
        handleWalletPageClick={handleWalletPageClick}
      />

      <RechargeWeakTipsModal handleWalletPageClick={handleWalletPageClick} />

      <RechargeRepeatTopUpBonusModal />
    </>
  );
};

export default RechargeContent;
