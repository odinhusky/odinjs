import './index.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import {
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { useTranslation } from 'react-i18next';
import { handleScrollToElementTop, useBreakPoint } from '@libs/commonUtils';
import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import useImgUrlByBreakPoint from '@libs/commonUtils/hooks/useImgUrlByBreakPoint';
import { EResourceLevel } from '@mode2/utils';
import { useEffect, useRef } from 'react';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

const FixedCardItem = (props: {
  id: string;
  index: number;
  src: string;
  text: string;
  onItemBtnClick: () => void;
}) => {
  const { id, index, src, text, onItemBtnClick } = props;
  return (
    <div
      key={id + '-' + index}
      className="relative flex shrink-0 items-center cursor-pointer"
      onClick={onItemBtnClick}
    >
      <img className="w-full" src={src} alt={id} />
      <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[4vw]">
        {text}
      </div>
    </div>
  );
};

const CardItem = (props: {
  isMobile: boolean;
  id: string;
  src: string;
  text: string;
  onItemBtnClick: () => void;
}) => {
  const { isMobile, id, src, text, onItemBtnClick } = props;
  return (
    <div
      className={cx(
        'relative flex shrink-0 tablet:w-36 mobile:w-[120px] w-full mobile:max-w-none max-w-[80.5px]',
        'mobile:text-sm text-xs tablet:font-semibold font-medium',
        'items-center cursor-pointer'
      )}
      onClick={onItemBtnClick}
    >
      <img className="w-full" src={src} alt={id} />
      <div
        className={cx('absolute', {
          'top-1/2 -translate-y-1/2 tablet:left-[15px] mobile:left-3':
            !isMobile,
          'left-1/2 -translate-x-1/2  bottom-[10%]': isMobile,
        })}
      >
        {text}
      </div>
    </div>
  );
};

export const GameCategoryTabs = () => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();
  const { isTablet, isMobile } = useBreakPoint();
  const curTab = useMode2HallPageTabsStore((state) => state.curTab);
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);
  const hallPageTabActionList = useHallPageActionsStore(
    (state) => state.hallPageTabActionList
  );

  // 滾動到最上方
  const scrollToTabsCount = useHallPageActionsStore(
    (state) => state.scrollToTabsCount
  );

  const swiperRef = useRef<SwiperRef | null>(null);
  const hallPageTabContainerRef = useRef<HTMLDivElement>(null);

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  useEffect(() => {
    if (scrollToTabsCount > 0) {
      const offset = (headerElMetrics.height || 0) * -1;
      handleScrollToElementTop(hallPageTabContainerRef?.current, offset);
    }
  }, [scrollToTabsCount]);

  useEffect(() => {
    if (swiperRef.current && curTab) {
      const activeTabIndex = tabList.findIndex((tab) => tab.id === curTab);
      if (activeTabIndex !== -1) {
        swiperRef.current.swiper.slideTo(activeTabIndex);
      }
    }
  }, [curTab, tabList]);

  return isMobile ? (
    <div
      ref={hallPageTabContainerRef}
      className="flex flex-col gap-2 text-[var(--grayscale-100)] my-4"
    >
      <div className="grid grid-cols-2 gap-2">
        {tabList.map((item, index) => {
          return item.id === 'lobby' || item.id === 'hot' ? (
            <FixedCardItem
              key={`${item.id}_${index}`}
              id={item.id}
              index={index}
              src={getImgUrlByBreakPoint(
                `game_zone_${item.id}`,
                EResourceLevel.V,
                isTablet,
                isMobile
              )}
              text={renderI18N(item.btnTextKey, t)}
              onItemBtnClick={() => {
                hallPageTabActionList[index]();
              }}
            />
          ) : null;
        })}
      </div>
      <Swiper
        ref={swiperRef}
        className="w-full"
        slidesPerView={'auto'}
        spaceBetween={'2%'}
        modules={[Pagination]}
        pagination={{
          el: '.custom-pagination',
          clickable: true,
        }}
      >
        {tabList.map((item, index) => {
          return item.id !== 'lobby' && item.id !== 'hot' ? (
            <SwiperSlide key={item.id + '-' + index} className="!w-auto">
              <CardItem
                isMobile={isMobile}
                id={item.id}
                src={getImgUrlByBreakPoint(
                  `game_zone_${item.id}`,
                  EResourceLevel.V,
                  isTablet,
                  isMobile
                )}
                text={renderI18N(item.btnTextKey, t)}
                onItemBtnClick={() => {
                  hallPageTabActionList[index]();
                }}
              />
            </SwiperSlide>
          ) : null;
        })}
        <div className="custom-pagination" />
      </Swiper>
    </div>
  ) : (
    <Swiper
      className="bgi-[var(--grayscale-15)] text-[var(--grayscale-100)] my-5"
      slidesPerView={'auto'}
      spaceBetween={12}
    >
      {tabList.map((item, index) => {
        if (item.isNeedLogin && (!item?.isLogin || !item.collectListLength)) {
          return null;
        }
        return (
          <SwiperSlide key={item.id + '-' + index} className="!w-auto">
            <CardItem
              isMobile={isMobile}
              id={item.id}
              src={getImgUrlByBreakPoint(
                `game_zone_${item.id}`,
                EResourceLevel.V,
                isTablet,
                isMobile
              )}
              text={renderI18N(item.btnTextKey, t)}
              onItemBtnClick={() => {
                hallPageTabActionList[index]();
              }}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default GameCategoryTabs;
