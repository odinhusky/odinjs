import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import StarMark from '@components/StarMark';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import dayjs from 'dayjs';
import { useDurationCountDown } from '@libs/commonUtils';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';

/**
 * Evan for [V6] Done
 */
const BonusWrapper = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'bgi-border-[var(--base-1-variant1)]',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant4)]'
      )}
      onClick={onClick}
    >
      <div className={'w-auto h-full'}>
        <img
          alt={'check_box'}
          className="absolute right-0 bottom-0 rounded-br-[5px] h-8 w-8"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
        {children}
      </div>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
const NoBonusWrapper = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant11)]',
        'bgi-border-[var(--base-2-variant6)]'
      )}
      onClick={onClick}
    >
      <div className={'w-auto h-full'}>{children}</div>
    </div>
  );
};

/**
 * Evan for [V6] In progress
 */
export const RechargeBonusSwitch = () => {
  const { t } = useTranslation();
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const currentPayOption = useWalletPageRechargeContentStore(
    (state) => state.currentPayOption
  );

  const isWithBonus =
    currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
    currentRechargeCard === RechargeCard.HIGH_BONUS;

  const bonusMessage = isFirstDeposit
    ? t('deposit_first_deposit_reward', {
        maxRebateAmount: formatMoney({
          value: currentPayChannel.maxRebateAmount,
        }),
      })
    : t('wallet_deposit_bonus', { cashBackRate: currentOptCashBackRate });
  const Wrapper = isWithBonus ? BonusWrapper : NoBonusWrapper;

  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return doubleBuffRechargeBonusLimitedEndTime > nowUnix
      ? doubleBuffRechargeBonusLimitedEndTime - nowUnix
      : 0;
  }, [doubleBuffRechargeBonusLimitedEndTime]);

  const { remainSec } = useDurationCountDown({
    duration: countdownTime,
    onEnd: () => {
      console.log('Happy New Year!');
    },
  });

  return remainSec <= 0 ? (
    <div className="flex flex-col gap-3 justify-start">
      <div>
        <div className="flex gap-1 text-base font-medium bgi-text-[var(--grayscale-100)]">
          <p>{t('deposit_deposit_event')}</p>
          <StarMark className={'!bgi-text-[var(--base-1-main)]'} />
        </div>

        <div className={'grid grid-cols-3 gap-y-3 gap-x-2 mt-1'}>
          <Wrapper
            onClick={() => {
              setCurrentRechargeCard(
                isWithBonus ? RechargeCard.GENERAL : RechargeCard.TOP_UP_BONUS
              );
            }}
          >
            <div
              className={cx(
                'text-base text-shadow min-h-[56px] flex justify-center items-center py-1 px-3 z-10',
                {
                  'bgi-text-[var(--grayscale-100)]': isFirstDeposit,
                  'bgi-text-[var(--base-1-90)] text-shadow-lg': !isFirstDeposit,
                }
              )}
            >
              {bonusMessage}
            </div>
          </Wrapper>
        </div>
      </div>

      {isWithBonus ? (
        <div className="bgi-text-[var(--base-1-main)] font-medium text-xs">
          <p>
            {t('deposit_deposit_event_note_1', {
              requireDepositTimes: currentPayOption.withBonusDamaTimes,
            })}
          </p>
          <p>{t('deposit_deposit_event_note_2')}</p>
        </div>
      ) : null}
    </div>
  ) : null;
};

export default RechargeBonusSwitch;
