import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useGivenTimeCountDown } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import {
  handleDepositJackpotWheelModalMaskClick,
  handleDepositJackpotWheelModalSpinBtnClick,
} from '@libs/mode2/action/actionTypes';
import { useDepositJackpotWheelModalActions } from '@libs/mode2/action/model/DepositJackpotWheelModalAction/useDepositJackpotWheelModalAction';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import {
  getImgUrl,
  EResourceLevel,
  formatCountdownTime,
} from '@libs/mode2/utils';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { useTranslation } from 'react-i18next';

export const DepositJackpotWheelModalFooter = () => {
  const { t } = useTranslation();

  const { handleDepositJackpotWheelModalClick } =
    useDepositJackpotWheelModalActions();

  const depositJackpotWheelRemainSpin = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelRemainSpin
  );

  const spinAnimationFinish = useDepositJackpotWheelModalStore(
    (state) => state.spinAnimationFinish
  );

  const startSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.startSpinAnimation
  );
  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  // const countdownTime = useMemo(() => {
  //   const nowUnix = dayjs().unix();
  //   console.log('@@@===> useDepositJackpotWheelModalStore doubleBuffRechargeBonusLimitedEndTime', doubleBuffRechargeBonusLimitedEndTime)
  //   return doubleBuffRechargeBonusLimitedEndTime > nowUnix
  //     ? (doubleBuffRechargeBonusLimitedEndTime - nowUnix) * 1000
  //     : 0;
  // }, [doubleBuffRechargeBonusLimitedEndTime]);

  const { remainSec } = useGivenTimeCountDown({
    targetDate: new Date(
      doubleBuffRechargeBonusLimitedEndTime === 0
        ? 0
        : doubleBuffRechargeBonusLimitedEndTime * 1000
    ),
    onEnd: () => console.log('Happy New Year!'),
  });

  return (
    <>
      <BaseCacheImg
        src={getImgUrl(
          EResourceLevel.POPUP_BANNER,
          'popup_deosit_wheel_awards'
        )}
        className="-mt-[100px]"
        onClick={() => {
          handleDepositJackpotWheelModalClick({
            actionName: handleDepositJackpotWheelModalMaskClick,
          });
        }}
      />
      {/* // 輪盤高436 - 336 = 100px */}
      <div
        className={cx(
          'w-full',
          FLEX_CENTER,
          'flex-col gap-3' /** '-mt-[100px]' */
        )}
      >
        <div
          className={cx(
            'text-base font-medium text-center',
            FLEX_CENTER,
            'flex-col',
            'bgi-text-[var(--grayscale-100)]'
          )}
        >
          {/* 沒倒數 沒spin */}
          {depositJackpotWheelRemainSpin === 0 && remainSec === 0 ? (
            <div className={cx(FLEX_CENTER, 'flex-col', 'text-base')}>
              <span>Just deposit any amount and you will</span>
              <span>have a chance to win a</span>
              <div>
                <span className="text-lg bgi-text-[var(--base-1-variant1)]">
                  MacBook Pro 16-inch{' '}
                </span>
                <span>or a </span>
                <span className="text-lg bgi-text-[var(--base-1-variant1)]">
                  iPhone 16 Pro Max
                </span>
              </div>
            </div>
          ) : null}

          {/* TODO i18n */}
          {depositJackpotWheelRemainSpin > 0 ? (
            <>
              <span>Deposit successfully</span>
              <span>and you have a chance to win a prize</span>
            </>
          ) : null}

          {remainSec! > 0 ? (
            <div className="mt-3 text-2xl font-medium">{`Ends in ${formatCountdownTime(
              remainSec || 0
            )}`}</div>
          ) : null}
        </div>

        {/* TODO i18n */}
        <BasePrimaryBtn
          children={
            depositJackpotWheelRemainSpin > 0
              ? t('deposit_wheel_spin_button').toLocaleUpperCase()
              : 'Go to Deposit'
          }
          className="w-[196px] h-11 cursor-pointer"
          classNameText="text-lg font-medium"
          debounceTimer={500}
          onClick={() => {
            const startSpinAnimation =
              useDepositJackpotWheelModalStore.getState().startSpinAnimation;
            if (startSpinAnimation) {
              return;
            }
            handleDepositJackpotWheelModalClick({
              actionName: handleDepositJackpotWheelModalSpinBtnClick,
            });
          }}
        />
      </div>
    </>
  );
};

export default DepositJackpotWheelModalFooter;
