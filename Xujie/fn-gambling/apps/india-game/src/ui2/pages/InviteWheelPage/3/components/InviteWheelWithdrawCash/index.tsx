import { cx, useDeepEffect, useDurationCountDown } from '@libs/commonUtils';
import { useInviteWheelPageActions } from '@mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import { useTranslation } from 'react-i18next';
import { handleInviteWheelPageCashOutClickAction } from '@mode2/action/actionTypes';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import { formatCountdownTime, formatMoney } from '@mode2/utils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

const InviteWheelWithdrawCash = () => {
  const { handleInviteWheelAction } = useInviteWheelPageActions();
  const { t } = useTranslation();

  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );
  const setShowPinduoduoFreeDrawModal = useInviteWheelPageStoreStore(
    (state) => state.setShowPinduoduoFreeDrawModal
  );

  const eventCountDown = useInviteWheelPageStoreStore(
    (state) => state.eventCountDown
  );

  const refreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.refreshInfoNumber
  );

  const isParticipated = useInviteWheelPageStoreStore(
    (state) => state.isParticipated
  );

  const setRemainFreeSpinCountDown = useInviteWheelPageStoreStore(
    (state) => state.setRemainFreeSpinCountDown
  );

  const { remainSec } = useDurationCountDown({
    forceUpdateDurationCount: refreshInfoNumber,
    duration: eventCountDown,
    key: 'eventCountDown',
  });

  useDeepEffect(() => {
    setRemainFreeSpinCountDown(remainSec >= 0 ? remainSec : 0);
    setShowPinduoduoFreeDrawModal(!isParticipated && remainSec <= 0);
  }, [remainSec, isParticipated]);

  return (
    <div
      className={cx(
        'w-full flex flex-col justify-center items-center relative z-10',
        'font-medium text-lg bgi-text-[var(--base-2-variant1)]'
      )}
    >
      <div>
        {/*{t('spin_and_share_wheel_event_countdown', {*/}
        {/*  remain: !inviteWheelPortalInfo.isWithdrawal*/}
        {/*    ? formatCountdownTime(remainSec!)*/}
        {/*    : '00:00',*/}
        {/*})}*/}

        {t('spin_and_share_wheel_event_countdown', {
          remain: formatCountdownTime(remainSec!),
        })}
      </div>

      {/*{!inviteWheelPortalInfo.isWithdrawal ? (*/}
      {/*  <div>*/}
      {/*    {t('spin_and_share_wheel_event_countdown', {*/}
      {/*      remain: formatCountdownTime(remainSec!),*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <div>{t('Your reward is ready! Cash out now!')}</div>*/}
      {/*)}*/}

      {/*<div>*/}
      {/*  {t('spin_and_share_wheel_event_countdown', {*/}
      {/*    remain: formatCountdownTime(remainSec!),*/}
      {/*  })}*/}
      {/*</div>*/}

      <AnimationFlipNumbers
        height={48}
        numbers={`${formatMoney({
          value: inviteWheelPortalInfo.cumulativeReward || 0,
          includeDecimal: true,
          showCurrency: false,
        })}`}
      />

      <BasePrimaryBtn
        className={cx(
          'w-auto h-auto',
          'font-medium',
          'text-base mt-[11px]',
          'py-2 px-8 rounded-full',
          'min-h-[35px]'
        )}
        debounceTimer={500}
        onClick={() => {
          handleInviteWheelAction({
            actionName: handleInviteWheelPageCashOutClickAction,
            payload: {
              isWithdrawal: inviteWheelPortalInfo.isWithdrawal,
            },
          });
        }}
        children={t('spin_and_share_wheel_cash_out_button')}
      />
    </div>
  );
};

export default InviteWheelWithdrawCash;
