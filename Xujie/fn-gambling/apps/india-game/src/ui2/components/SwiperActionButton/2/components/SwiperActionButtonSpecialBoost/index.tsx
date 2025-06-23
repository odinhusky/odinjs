import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { SWIPER_ACTION_BUTTON_SIZE_CLASS } from '../..';
import { X_CENTER } from '@libs/constant/style';
import useLowBalanceRechargeModalActions from '@libs/mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';
import { handleLowBalanceRechargeModalShowModalClickAction } from '@libs/mode2/action/actionTypes';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import { swiperActionButtonStores } from '@mode2/zustand/components/swiperActionButton';
import dayjs from 'dayjs';

export const SwiperActionButtonSpecialBoost = () => {
  const { handleLowBalanceRechargeModalClick } =
    useLowBalanceRechargeModalActions();

  const setIsShowSwiperActionButtonSpecialBoost = swiperActionButtonStores(
    (state) => state.setIsShowSwiperActionButtonSpecialBoost
  );

  const nowUnix = dayjs().unix();

  const lowBalanceRechargeLimitedOffersEndTime =
    useLowBalanceRechargeModalStore(
      (state) => state.lowBalanceRechargeLimitedOffersEndTime
    );

  const countdownTime =
    lowBalanceRechargeLimitedOffersEndTime > nowUnix
      ? (lowBalanceRechargeLimitedOffersEndTime - nowUnix) * 1000
      : 0;

  const { formattedTime } = useMillisecondCountdown({
    duration: countdownTime,
    onEnd: () => {
      setIsShowSwiperActionButtonSpecialBoost(false);
    },
    millisecondDigits: 3,
  });

  return (
    <button
      type="button"
      className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS, 'relative')}
      onClick={() => {
        handleLowBalanceRechargeModalClick({
          actionName: handleLowBalanceRechargeModalShowModalClickAction,
        });
      }}
    >
      <BaseCacheImg
        src={getImgUrl(
          EResourceLevel.V,
          'swiper_action_button_specialboost_img'
        )}
        className={cx('w-full h-full')}
      />

      <div
        className={cx(
          'absolute bottom-0',
          X_CENTER,
          'text-xs',
          'w-full',
          'font-bold'
        )}
      >
        {/* mm : ss : SSS */}
        {formattedTime}
      </div>
    </button>
  );
};
