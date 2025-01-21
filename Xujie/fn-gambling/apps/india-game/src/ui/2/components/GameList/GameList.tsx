import { useRef, useState } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import {
  HallPageIdObj,
  Mode2GameListConfig,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import GameItem from '@components/GameItem';
import GameSupplierItem from '@components/GameSupplierItem';
import GameItemLandscape from '@components/GameItemLandscape';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import cx from '@commonUtils/cx';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import GameSectionHeader from '@components/GameSectionHeader';
import { get } from 'lodash';
import { LoadMoreButton } from '@components/LoadMoreButton';

/**
 * 獲取需要顯示的遊戲列表資料
 * 在大廳時某些遊戲只需要顯示部分資料,剩餘資料需點擊“顯示更多”才會展開
 * 在遊戲類別分頁時是全部展開
 */
const getGameList = (props: Mode2GameListConfig, count: number) => {
  let data = [];
  const number = count || props?.displayCount || 0;
  if (props?.displayCount) {
    data = props!.list.slice(0, number);
  } else {
    data = props!.list;
  }

  return data;
};

export const GameList = (props: Mode2GameListConfig) => {
  const { isTablet, isDesktop, isMobile } = useBreakPoint();

  const swiperRef = useRef<SwiperCore | null>(null);
  const [count, setCount] = useState(props?.displayCount || 0);

  const curTab = useMode2HallPageTabsStore((state) => state.curTab);

  const isLobbyTab = curTab === HallPageIdObj.LOBBY;
  const data = isLobbyTab ? getGameList(props, count) : props.list;

  const width = isDesktop ? 6 : isTablet ? 4 : 3.3;
  const widthException = isDesktop ? 3 : isTablet ? 2 : 1;
  const gridCol = isDesktop
    ? 'grid-cols-6'
    : isTablet
    ? 'grid-cols-4'
    : 'grid-cols-3';
  const gridColException = isDesktop
    ? 'grid-cols-3'
    : isTablet
    ? 'grid-cols-2'
    : 'grid-cols-1';
  const casinoSlidesPerView = isDesktop ? 3 : isTablet ? 2 : 1;

  const casinoGameImgAspectClass = 'aspect-[2.2483]'; // 344x153
  const normalGameImgAspectClass = 'aspect-[0.713]'; // 106.66x149.52

  const gridContainerClass = props.isException ? gridColException : gridCol;
  const gameItemAspectClass = props.isException
    ? casinoGameImgAspectClass
    : normalGameImgAspectClass;
  const gameItemSlideWidth = props.isException
    ? `calc((100% / ${widthException}))`
    : `calc(100% / ${width})`;

  const listLength = props.list.length;
  const isSupplierGameList = get(props, 'isSupplierGameList', false);
  const isCasinoGameList = get(props, 'isException', false);
  const shouldShowLoadMoreBtn =
    props?.isShowLoadmore &&
    count !== props!.list.length &&
    count < props!.list.length;

  /**
   * 根據當前遊戲列表渲染不同的遊戲項目元件
   *
   * @param item 遊戲項目資料
   * @param props 遊戲列表設定
   * @returns
   * - 遊戲供應商item -> GameSupplierItem
   * - 一般直向Game Item -> GameItem
   * - 橫向Game Item -> GameItemLandscape
   */
  const renderGameItemComponent = (
    item: GameListItemResult,
    props: Mode2GameListConfig,
    index: number
  ) => {
    const Component = props.isSupplierGameList
      ? GameSupplierItem
      : props.isException
      ? GameItemLandscape
      : GameItem;

    return (
      <Component
        key={index}
        item={item}
        showGameName={!!props.showGameName}
        isShowHoverMask={props.isShowHoverMask}
        imageClassName={gameItemAspectClass}
      />
    );
  };

  /** 直接展開的遊戲列表 */
  const renderGrid = (): JSX.Element => {
    return (
      <div className={cx('grid gap-4', gridContainerClass)}>
        {data.map((item: GameListItemResult, index: number) =>
          renderGameItemComponent(item, props, index)
        )}
      </div>
    );
  };

  /** 可左右滑動的遊戲列表 */
  const renderSlides = (): JSX.Element => {
    const spaceBetween = isMobile && !isCasinoGameList ? 12 : 16;
    return (
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={isCasinoGameList ? casinoSlidesPerView : 'auto'}
        spaceBetween={spaceBetween}
        className="game-swiper"
      >
        {data.map((item: GameListItemResult, index: number) => {
          return (
            <SwiperSlide
              key={index}
              className={cx('relative cursor-pointer', {
                'py-2 px-4 rounded-lg box-border bgi-[var(--grayscale-20)]':
                  isSupplierGameList,
              })}
              style={{
                width: gameItemSlideWidth,
              }}
            >
              {renderGameItemComponent(item, props, index)}
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  };

  /** 在首頁大廳的特定遊戲類別才能夠左右滑動,切到分頁後除了供應商之外都是直接展開分類中所有遊戲*/
  const renderGameList = (): JSX.Element => {
    if ((isLobbyTab || isSupplierGameList) && props.isScroll) {
      return renderSlides();
    } else {
      return renderGrid();
    }
  };

  return (
    <div className="mb-4 mobile:mb-5">
      <GameSectionHeader
        title={props.tabName}
        iconSrc={props.iconName}
        amount={listLength}
        isShowAmount={isLobbyTab && !isSupplierGameList}
        isShowSlideBtn={isSupplierGameList}
        onAmountClick={props.actionClickAll}
        swiperRef={swiperRef}
      />

      {renderGameList()}

      {shouldShowLoadMoreBtn && (
        <LoadMoreButton
          onClick={() =>
            setCount((prev: number) => prev + (props?.displayCount || 0))
          }
        />
      )}
    </div>
  );
};

export default GameList;
