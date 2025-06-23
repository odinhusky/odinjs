import SpinWheel from '@components/SpinWheel';
import {
  cx,
  useObserverElementMetrics,
  useUpdateEffect,
} from '@libs/commonUtils';
import { RECHARGE_TAB_NAMES } from '@libs/constant/wheelConst';
import {
  rechargeWheelLevelTypeMapping,
  rechargeWheelLevelTypeToNumberMapping,
} from '@libs/mode2/@types/rechargeWheelLevelTypes';
import useRechargeWheelAction from '@libs/mode2/action/rechargeWheel/useRechargeWheelAction';
import {
  RechargeWheelType,
  useRechargeWheelTabStore,
} from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { RefObject, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { handleRechargeWheelSpinButtonClick } from '@mode2/action/actionTypes';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import { DEFAULT_DEBOUNCE_DELAY } from '@constant/functionParams';
import debounce from 'lodash/debounce';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

interface RechargeWheelsProps {}

export const RechargeWheels = (props: RechargeWheelsProps) => {
  const { t } = useTranslation();
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const rechargeWheelsRefsObj: Record<
    RechargeWheelType,
    RefObject<HTMLDivElement>
  > = {
    silver: useRef<HTMLDivElement>(null),
    gold: useRef<HTMLDivElement>(null),
    diamond: useRef<HTMLDivElement>(null),
    supreme: useRef<HTMLDivElement>(null),
  };

  const { elementRef: mainElRef, elementMetrics: mainElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const mainElWidth = mainElMetrics.width;

  const timesNumber =
    mainElWidth <= 750 && mainElWidth > 600
      ? 0.16
      : mainElWidth <= 600 && mainElWidth > 479
      ? 0.19
      : mainElMetrics.width <= 480
      ? 0.25
      : 0;

  const spaceBetween = mainElWidth * timesNumber * -1;

  const { handleWheelSpinAnimation, handleRechargeWheelClick } =
    useRechargeWheelAction();

  const isAnimatingObj = useMode2RechargeWheelPageStore(
    (state) => state.isAnimatingObj
  );

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  const wheelLevelConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelLevelConfigObj
  );

  const spinedRewardIndex = useMode2RechargeWheelPageStore(
    (state) => state.spinedRewardIndex
  );

  const spinedRewardIsMoney = useMode2RechargeWheelPageStore(
    (state) => state.spinedRewardIsMoney
  );

  const spinedRewardValue = useMode2RechargeWheelPageStore(
    (state) => state.spinedRewardValue
  );

  const isCurrentWheelSlowSpin = useMode2RechargeWheelPageStore(
    (state) => state.isCurrentWheelSlowSpin
  );

  const wheelRemainSpinNumberObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelRemainSpinNumberObj
  );

  const spinedAPIDoneCount = useMode2RechargeWheelPageStore(
    (state) => state.spinedAPIDoneCount
  );

  const setIsCurrentWheelSlowSpin = useMode2RechargeWheelPageStore(
    (state) => state.setIsCurrentWheelSlowSpin
  );

  const setActiveRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.setActiveRechargeActiveTab
  );

  const setIsAnimatingObj = useMode2RechargeWheelPageStore(
    (state) => state.setIsAnimatingObj
  );

  const refreshPostPlayerProgressCount = useMode2RechargeWheelPageStore(
    (state) => state.refreshPostPlayerProgressCount
  );

  const showToast = useToastStore((state) => state.showToast);

  const swiperRef = useRef<SwiperCore | null>();

  // 一開始的時候設定當前的輪盤慢慢旋轉
  useEffect(() => {
    setIsCurrentWheelSlowSpin(true);
  }, []);

  // Swiper 跟 active tabs 連動
  const initialSlideIdx =
    rechargeWheelLevelTypeToNumberMapping[activeRechargeActiveTab] - 1;

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(initialSlideIdx);
    }
  }, [activeRechargeActiveTab, initialSlideIdx]);

  const handleSlideChange = debounce((swiper: SwiperCore) => {
    const activeIndex = swiper.activeIndex;

    if (isCurrentWheelSlowSpin === false) {
      // 如果進入旋轉轉盤的階段，則不允許使用者左右滑動切換轉盤
      const currentSPinActiveIndex =
        rechargeWheelLevelTypeToNumberMapping[activeRechargeActiveTab] - 1;
      swiper.slideTo(currentSPinActiveIndex);
      return;
    }

    // 如果滑到第四個至尊轉盤則跳回鑽石轉盤，至尊轉盤暫時不開放
    if (activeIndex === 3) {
      swiper.slideTo(2);
      setActiveRechargeActiveTab('diamond');
      // showToast(t('deposit_wheel_coming_soon_toast'));
      return;
    }

    // Swiper 跟 active tabs 連動
    const activeTab = rechargeWheelLevelTypeMapping[activeIndex + 1];

    if (activeTab !== 'supreme') {
      setActiveRechargeActiveTab(activeTab);
    }
  }, DEFAULT_DEBOUNCE_DELAY);

  // 當打完旋轉輪盤的 API 返回的資訊更新的時候，轉動輪盤
  useUpdateEffect(() => {
    if (isCurrentWheelSlowSpin === false) {
      handleWheelSpinAnimation({
        ref: rechargeWheelsRefsObj[activeRechargeActiveTab],
        isMoney: spinedRewardIsMoney,
        selectedIdx: spinedRewardIndex,
        rewardAmount: spinedRewardValue,
        callback: () => {
          setIsCurrentWheelSlowSpin(true);
          setIsAnimatingObj(activeRechargeActiveTab, false);
          refreshPostPlayerProgressCount();
          if (spinedRewardIsMoney) refreshUserData();
        },
      });
    }
  }, [spinedAPIDoneCount]);

  return (
    <div
      ref={mainElRef}
      className={cx('-mx-4', 'pb-8', 'flex gap-3', 'w-auto')}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // 初始化 swiperRef
        className={cx('!w-auto')}
        spaceBetween={spaceBetween}
        slidesPerView={'auto'}
        centeredSlides={true}
        slideToClickedSlide={false}
        initialSlide={initialSlideIdx}
        loop={false}
        autoplay={false}
        observer={true}
        observeParents={true}
        onSlideChange={handleSlideChange}
        children={
          <>
            {RECHARGE_TAB_NAMES.map((tab, index) => {
              return (
                <SwiperSlide
                  className={cx('relative', '!w-auto')}
                  key={`${tab} - Wheel Slide`}
                >
                  <SpinWheel
                    remainSpin={wheelRemainSpinNumberObj[tab]}
                    category="recharge"
                    type={tab}
                    ref={rechargeWheelsRefsObj[tab]}
                    isAnimating={isAnimatingObj[tab]}
                    wheelSegments={wheelLevelConfigObj[tab].wheelSegments}
                    className={cx('transition-[all] duration-500', {
                      'opacity-60 scale-[63%]': activeRechargeActiveTab !== tab,
                    })}
                    spinPartClassNameObj={{
                      container: cx({
                        'animate-wheel-prev-spin-infinitely':
                          (isCurrentWheelSlowSpin &&
                            activeRechargeActiveTab === tab) ||
                          activeRechargeActiveTab !== tab,
                      }),
                    }}
                    handleClickTrigger={() => {
                      if (wheelRemainSpinNumberObj[tab] <= 0) {
                        showToast(t('deposit_wheel_without_deposit_toast'));
                        return;
                      }

                      if (
                        wheelRemainSpinNumberObj[activeRechargeActiveTab] > 0 &&
                        isCurrentWheelSlowSpin === true &&
                        activeRechargeActiveTab === tab
                      ) {
                        setIsCurrentWheelSlowSpin(false);
                        setIsAnimatingObj(activeRechargeActiveTab, true);

                        handleRechargeWheelClick({
                          actionName: handleRechargeWheelSpinButtonClick,
                          payload: {
                            type: activeRechargeActiveTab,
                          },
                        });
                      }
                    }}
                  />
                </SwiperSlide>
              );
            })}
          </>
        }
      />
    </div>
  );
};

export default RechargeWheels;
