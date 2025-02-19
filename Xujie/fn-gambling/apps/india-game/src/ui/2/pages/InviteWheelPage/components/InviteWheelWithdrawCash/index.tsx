import { cx, useDeepEffect, useDurationCountDown } from '@libs/commonUtils';
import BaseTertiaryBtn from '@components/BaseTertiaryBtn';
import { useInviteWheelPageActions } from '@mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import { useTranslation } from 'react-i18next';
import {
  handleInviteWheelPageCashOutClickAction,
  handleInviteWheelPageNavToRecordClickAction,
  handleInviteWheelPageNavToRuleClickAction,
} from '@mode2/action/inviteWheelPageAction/actionType';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import { formatCountdownTime, formatNumber } from '@mode2/utils';
import Icon from '@components/Icon';

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
    <div className="w-full flex flex-col justify-center items-center relative mt-1">
      <AnimationFlipNumbers
        height={56}
        numbers={`${formatNumber(
          inviteWheelPortalInfo.cumulativeReward || 0,
          true
        )}`}
      />

      <div
        className={cx(
          'flex flex-col justify-center items-center gap-1',
          'font-medium text-sm bgi-text-[var(--transparent-white-70)]'
        )}
      >
        {!inviteWheelPortalInfo.isWithdrawal ? (
          <div>
            {t('spin_and_share_wheel_event_countdown', {
              remain: formatCountdownTime(remainSec!),
            })}
          </div>
        ) : (
          <div>{t('Your reward is ready! Cash out now!')}</div>
        )}
        <BaseTertiaryBtn
          className={cx(
            'w-auto h-auto',
            'font-semibold',
            'text-sm',
            'py-2 px-8'
          )}
          // disabled={currentSpinCumulativeBonus >= 500}
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

      <div className="absolute right-4 top-0 flex flex-col justify-center gap-3">
        <Icon
          className={cx('h-6 w-6 cursor-pointer')}
          name={'ic_tips'}
          color={'var(--transparent-white-70)'}
          onClick={() => {
            handleInviteWheelAction({
              actionName: handleInviteWheelPageNavToRuleClickAction,
            });
          }}
        />
        <Icon
          className={cx('h-6 w-6 cursor-pointer')}
          name={'ic_team_data'}
          color={'var(--transparent-white-70)'}
          onClick={() => {
            handleInviteWheelAction({
              actionName: handleInviteWheelPageNavToRecordClickAction,
            });
          }}
        />
      </div>
    </div>
  );
};

export default InviteWheelWithdrawCash;
