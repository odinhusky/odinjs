import React from 'react';
import cx from '@commonUtils/cx';
import { PayChannelList } from '@components/PayChannelList';
import { RechargeCardDescription } from '@components/RechargeCardDescription';
import useRechargeContentBase from '@/ui/hooks/components/rechargeContent/useRechargeContentBase';
import { PayChannelAmountOptions } from '@components/PayChannelAmountOptions';
import RechargeLimit from './components/RechargeLimit';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import CurrentlyPayProductInfo from './components/CurrentlyPayProductInfo';
import RechargeButton from './components/RechargeButton';
import RechargeBonusSwitch from './components/RechargeBonusSwitch';

const FromGameWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'bgi-[var(--background-light)] bg-fixed bg-bottom',
        'min-h-screen pb-[80px]'
        // 'w-screen',
        // MOBILE_BREAK_POINT_MAX_WIDTH,
        // '-mx-4 pb-[80px]'
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

export const RechargeContent = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  useRechargeContentBase({ isRechargeFromGame });

  // const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);
  // const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);

  // if (isRechargeFromGame) {
  //   if (rechargeStatus === RechargeStatusResult.INTERNAL) {
  //     return <InternalPayContent id={'pay-iframe'} title={'pay iframe'} />;
  //   } else if (rechargeStatus === RechargeStatusResult.CUSTOMIZED) {
  //     return <CustomizeCheckoutPage />;
  //   }
  // }

  const LayoutWrapper = isRechargeFromGame
    ? FromGameWrapper
    : FromWalletWrapper;
  return (
    <LayoutWrapper>
      <div className={cx('flex flex-col gap-2 py-3 px-4')}>
        <RechargeLimit />

        <CurrentlyPayProductInfo />

        <PayChannelAmountOptions />

        <PayChannelList />

        <RechargeBonusSwitch />

        <RechargeCardDescription />

        <RechargeButton isRechargeFromGame={isRechargeFromGame} />
      </div>
    </LayoutWrapper>
  );
};

export default RechargeContent;
