import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { SWIPER_ACTION_BUTTON_SIZE_CLASS } from '../..';
import { X_CENTER } from '@libs/constant/style';
import {
  handleSwiperActionButtonDepositJackpotWheelClick,
  handleSwiperActionButtonDepositJackpotWheelWithCountDownClick,
} from '@libs/mode2/action/actionTypes';
import { swiperActionButtonStores } from '@mode2/zustand/components/swiperActionButton';
import dayjs from 'dayjs';
import { useDepositJackpotWheelModalActions } from '@libs/mode2/action/model/DepositJackpotWheelModalAction/useDepositJackpotWheelModalAction';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { useEffect } from 'react';

export const SwiperActionButtonDepositJackpotWheel = () => {
  const { handleDepositJackpotWheelModalClick } =
    useDepositJackpotWheelModalActions();

  const isCountDownSwiperActionButtonDepositJackpotWheel =
    swiperActionButtonStores(
      (state) => state.isCountDownSwiperActionButtonDepositJackpotWheel
    );

  const depositJackpotWheelRemainSpin = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelRemainSpin
  );

  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  const setIsShowSwiperActionButtonDepositJackpotWheel =
    swiperActionButtonStores(
      (state) => state.setIsShowSwiperActionButtonDepositJackpotWheel
    );

  const setIsCountDownSwiperActionButtonDepositJackpotWheel =
    swiperActionButtonStores(
      (state) => state.setIsCountDownSwiperActionButtonDepositJackpotWheel
    );

  const nowUnix = dayjs().unix();

  const countdownTime =
    doubleBuffRechargeBonusLimitedEndTime > nowUnix
      ? (doubleBuffRechargeBonusLimitedEndTime - nowUnix) * 1000
      : 0;

  const { formattedTime } = useMillisecondCountdown({
    duration: countdownTime,
    onEnd: () => {
      if (isCountDownSwiperActionButtonDepositJackpotWheel)
        setIsShowSwiperActionButtonDepositJackpotWheel(false);
    },
    millisecondDigits: 0,
  });

  // 顯示邏輯
  useEffect(() => {
    if (formattedTime === '00:00') {
      // console.log('!! formattedTime', formattedTime);
      setIsCountDownSwiperActionButtonDepositJackpotWheel(false);
    } else if (isCountDownSwiperActionButtonDepositJackpotWheel === false) {
      setIsCountDownSwiperActionButtonDepositJackpotWheel(true);
    }
  }, [formattedTime, isCountDownSwiperActionButtonDepositJackpotWheel]);

  return (
    <button
      type="button"
      className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS, 'relative')}
      onClick={() => {
        handleDepositJackpotWheelModalClick({
          actionName: isCountDownSwiperActionButtonDepositJackpotWheel
            ? handleSwiperActionButtonDepositJackpotWheelWithCountDownClick
            : handleSwiperActionButtonDepositJackpotWheelClick,
        });
      }}
    >
      <BaseCacheImg
        src={getImgUrl(
          EResourceLevel.V,
          isCountDownSwiperActionButtonDepositJackpotWheel
            ? 'swiper_action_button_recharge_wheel_countdown_img'
            : 'swiper_action_button_recharge_wheel_img'
        )}
        className={cx('w-full h-full')}
      />

      {/* mm : ss : SSS */}
      {isCountDownSwiperActionButtonDepositJackpotWheel ? (
        <div
          className={cx(
            'absolute bottom-[3px]',
            X_CENTER,
            'text-xs',
            'bgi-text-[var(--base-1-variant1)]',
            'w-full',
            'font-bold'
          )}
        >
          {formattedTime}
        </div>
      ) : null}

      {depositJackpotWheelRemainSpin > 0 ? (
        <div
          className={cx(
            'w-4 h-4',
            'rounded-full',
            'text-xs',
            'bgi-[var(--state-error-variant2)]',
            'bgi-text-[var(--grayscale-100)]',
            'absolute top-0 right-0'
          )}
        >
          {depositJackpotWheelRemainSpin}
        </div>
      ) : null}
    </button>
  );
};

export default SwiperActionButtonDepositJackpotWheel;
