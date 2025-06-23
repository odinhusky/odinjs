import { cx } from '@libs/commonUtils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useEffect, useMemo } from 'react';
import SwiperActionButtonTelegram from './components/SwiperActionButtonTelegram';
import { SwiperActionButtonRanking } from './components/SwiperActionButtonRanking';
import { SwiperActionButtonSpecialBoost } from './components/SwiperActionButtonSpecialBoost';
import { SwiperActionButtonDepositJackpotWheel } from './components/SwiperActionButtonDepositJackpotWheel';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocationStore } from '@libs/mode2/zustand/locationStore';
import { swiperActionButtonStores } from '@libs/mode2/zustand/components/swiperActionButton';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import dayjs from 'dayjs';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const SWIPER_ACTION_BUTTON_SIZE_CLASS = cx('w-[80px] h-[80px]');

export const SwiperActionButton = () => {
  const location = useLocationStore((state) => state.location);
  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  // const headerElMetrics = useTemplateLayoutStore(
  //   (state) => state.headerElMetrics
  // );

  const mainContentElMetrics = useTemplateLayoutStore(
    (state) => state.mainContentElMetrics
  );

  const isShowSwiperActionButtonSpecialBoost = swiperActionButtonStores(
    (state) => state.isShowSwiperActionButtonSpecialBoost
  );

  // const isShowSwiperActionButtonDepositJackpotWheel = swiperActionButtonStores(
  //   (state) => state.isShowSwiperActionButtonDepositJackpotWheel
  // );

  const userRole = useUserProfileStore((state) => state.userRole);

  const setIsShowSwiperActionButtonSpecialBoost = swiperActionButtonStores(
    (state) => state.setIsShowSwiperActionButtonSpecialBoost
  );

  const lowBalanceRechargeLimitedOffersEndTime =
    useLowBalanceRechargeModalStore(
      (state) => state.lowBalanceRechargeLimitedOffersEndTime
    );

  useEffect(() => {
    const nowUnix = dayjs().unix();
    setIsShowSwiperActionButtonSpecialBoost(
      lowBalanceRechargeLimitedOffersEndTime > nowUnix
    );
  }, [lowBalanceRechargeLimitedOffersEndTime]);

  const mainContentWidth = useMemo(() => {
    const width = mainContentElMetrics?.width || 750;
    return width > 750 ? (width - 750) / 2 : 0;
  }, [mainContentElMetrics]);

  const bottomNavHeight = useMemo(() => {
    const height = bottomNavigationElMetrics?.height || 100;
    return height + 8;
  }, [bottomNavigationElMetrics]);

  const isDisplay = useMemo(() => {
    return location?.pathname === BasePagePathObj.HallPage;
  }, [location]);

  return isDisplay ? (
    <div
      className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS, 'fixed z-[10]')}
      style={{
        right: `${mainContentWidth + 16}px`,
        bottom: `${bottomNavHeight + 20}px`,
      }}
    >
      <Swiper
        key={`${isShowSwiperActionButtonSpecialBoost}`}
        spaceBetween={16}
        slidesPerView={1}
        slidesPerGroup={1}
        centeredSlides={false}
        slideToClickedSlide={false}
        loop={true}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay]}
      >
        {/* 充值輪盤 */}
        {[UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) ? (
          <SwiperSlide className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}>
            <SwiperActionButtonDepositJackpotWheel />
          </SwiperSlide>
        ) : null}

        {/* Ranking 小飛機 */}
        <SwiperSlide className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}>
          <SwiperActionButtonRanking />
        </SwiperSlide>

        {/* 破產Bonus 小公主 */}
        {isShowSwiperActionButtonSpecialBoost ? (
          <SwiperSlide className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}>
            <SwiperActionButtonSpecialBoost />
          </SwiperSlide>
        ) : null}

        {/* Telegram */}
        <SwiperSlide className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}>
          <SwiperActionButtonTelegram />
        </SwiperSlide>
      </Swiper>
    </div>
  ) : null;
};

export default SwiperActionButton;
