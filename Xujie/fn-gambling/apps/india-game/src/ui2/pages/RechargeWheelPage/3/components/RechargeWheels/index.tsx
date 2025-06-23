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
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import rechargeWheelWinFeedBackStore, {
  RechargeWheelSpinLevelType,
} from '@libs/mode2/zustand/components/rechargeWheelWinFeedBackStore';
import { WheelSegmentResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';

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

  const openWinMoney = rechargeWheelWinFeedBackStore(
    (state) => state.openWinMoney
  );

  const openWinSpin = rechargeWheelWinFeedBackStore(
    (state) => state.openWinSpin
  );

  const showToast = useToastStore((state) => state.showToast);

  const swiperRef = useRef<SwiperCore | null>();

  const handleWheelIconMapping = (
    segments: WheelSegmentResult[] | undefined
  ) => {
    if (!segments) return [];
    const cloneSegments = cloneDeep(segments).map((item) => ({
      ...item,
      icon:
        item.category === 'SPIN'
          ? item.icon + 5
          : item.category === 'AMOUNT' && item.icon >= 5
          ? item.icon + 7
          : item.icon,
    }));
    return cloneSegments;
  };

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
        isShowToast: false,
        callback: () => {
          setIsCurrentWheelSlowSpin(true);
          setIsAnimatingObj(activeRechargeActiveTab, false);
          refreshPostPlayerProgressCount();
          if (spinedRewardIsMoney) {
            openWinMoney(spinedRewardValue);
            refreshUserData();
          } else {
            const thisLevelSegments = get(
              wheelLevelConfigObj,
              `${activeRechargeActiveTab}.wheelSegments`,
              []
            );
            const rewardSegment = get(
              thisLevelSegments,
              `${spinedRewardIndex}`,
              { id: 0, icon: 0, wheelLevel: 1, category: 'SPIN', value: 0 }
            );

            const rewardLevel = get(
              rechargeWheelLevelTypeMapping,
              `${rewardSegment.wheelLevel}`,
              'silver'
            );

            const level =
              rewardLevel.toUpperCase() as keyof typeof RechargeWheelSpinLevelType;

            openWinSpin(RechargeWheelSpinLevelType[level], spinedRewardValue);
          }
        },
      });
    }
  }, [spinedAPIDoneCount]);

  return (
    <div
      ref={mainElRef}
      className={cx(
        '-mx-4',
        'flex gap-3',
        'w-auto',
        'bgi-[var(--base-2-variant16)]',
        'pt-2 pb-8'
      )}
      // style={{
      //   paddingBottom: `${(mainElMetrics?.height / 2 || 200) / remToPx}rem`,
      // }}
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
              const wheelSegments = handleWheelIconMapping(
                wheelLevelConfigObj[tab].wheelSegments
              );
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
                    wheelSegments={wheelSegments}
                    className={cx('transition-[all] duration-500', {
                      'opacity-60 scale-[63%]': activeRechargeActiveTab !== tab,
                    })}
                    fixPartClassNameObj={{
                      button: cx('w-[84px] h-[84px]'),
                    }}
                    dynamicRechargeRouletteClass="!max-w-[404px] !max-h-[404px]"
                    spinPartClassNameObj={{
                      container: cx({
                        'animate-wheel-prev-spin-infinitely':
                          (isCurrentWheelSlowSpin &&
                            activeRechargeActiveTab === tab) ||
                          activeRechargeActiveTab !== tab,
                      }),
                      // 調整獎項的文字
                      rewardTitleClass: cx('leading-none'),
                      rechargeNotMoneyRewardClass: cx('top-[6%] left-[16%]'),

                      // 調整得獎圖片
                      rewardImageClass: cx('w-[48px] h-[48px]'),
                      rechargeRewardImagesClass: cx('top-[11%] left-[24%]'),
                    }}
                    customBtnNodeFn={(remainSpin, buttonType) => {
                      const isSupreme = buttonType === 'supreme';
                      const textColorClass = !isSupreme
                        ? 'bgi-text-[var(--base-1-50)]'
                        : 'bgi-text-[var(--grayscale-100)] bgi-text-border-[var(--transparent-gray-30),2px]';
                      const textShadowStyle = !isSupreme
                        ? {
                            textShadow:
                              'var(--recharge-wheel-button-text-shadow)',
                          }
                        : {};

                      return (
                        <>
                          <span
                            className={cx(
                              'block',
                              'text-2xl leading-none',
                              textColorClass,
                              '-mb-1.5'
                            )}
                            style={{
                              ...textShadowStyle,
                            }}
                            data-stroke="Go"
                          >
                            Go
                          </span>

                          {/* // TODO I18N */}
                          <span
                            className={cx('block', 'text-sm', textColorClass)}
                            style={{
                              ...textShadowStyle,
                            }}
                            data-stroke={`Spin x${remainSpin}`}
                          >
                            Spin x{remainSpin}
                          </span>
                        </>
                      );
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
