import { useObserverElementMetrics } from '@libs/commonUtils';
import GameItem from '@components/GameItem';
import cx from '@commonUtils/cx';
import useMode2MoreGamePageBase from '@libs/mode2/usecase/page/moreGamePage/useMode2MoreGamePageBase';
import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';
import useMoreGamePageActions from '@mode2/action/moreGameaction/useMoreGamePageActions';
import { FLEX_CENTER, FLEX_COL, remToPx } from '@libs/constant/style';
import MoreGamePageHorizonTab, {
  horizonTabs,
} from '@components/MoreGamePageHorizonTab';
import MoreGamePageVerticalTab from '@components/MoreGamePageVerticalTab';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';
import { useGameListStore } from '@libs/mode2/zustand/gameListStore';
import NoData from '@components/NoData';
import useIntersectionObserver from '@libs/commonUtils/hooks/useIntersectionObserver';
import { UIEvent, useCallback, useEffect, useState } from 'react';
import useMode3MoreGamePageBaseOverride from './useMode3MoreGamePageBaseOverride';
import { normalGameImgAspectClassMode3 } from '@libs/constant/gameItemRatio';
import Icon from '@components/Icon';
import { handleMoreGamePageScrollToTopButtonClick } from '@libs/mode2/action/moreGameaction/acitonType';
import { debounce } from 'lodash';
import { MoreGamePageTabType } from '@libs/mode2/@types/moreGamePageTabType';

const MoreGamePage = () => {
  useMode2MoreGamePageBase();

  useMode3MoreGamePageBaseOverride();

  // = styleClass
  const gridItemClass = 'grid-cols-3';

  // 根據不同裝置定義的col數量平分寬度後,再透過統一的寬高比計算高度維持圖片比例
  const normalGameImgAspectClass = `${normalGameImgAspectClassMode3} object-contain`;

  const activeHorizonTab = useMoreGamePageStoreStore(
    (state) => state.activeHorizonTab
  );

  const moreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.moreGamePageContainerRef
  );

  const moreGameList = useMoreGamePageStoreStore((state) => state.moreGameList);

  // const recentGameList = useMoreGamePageStoreStore(
  //   (state) => state.recentGameList
  // );

  const addScrollIntersectingCount = useMoreGamePageStoreStore(
    (state) => state.addScrollIntersectingCount
  );

  const hotGameList = useGameListStore((state) => state.hotGameList);

  const { handleMoreGamePageAction } = useMoreGamePageActions();

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const activeTabIsAll = activeHorizonTab === horizonTabs[0];

  // 計算何時顯示 scrollToTop
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleContainerScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLElement;
    const containerWidth = container.clientWidth;
    const itemWidth = (containerWidth - 40) / 3;
    const itemHeight = itemWidth / 0.713;
    const targetScrollHeight = itemHeight * 4;

    // console.log(
    //   '!! scroll',
    //   container.scrollTop,
    //   containerWidth,
    //   itemWidth,
    //   itemHeight,
    //   targetScrollHeight
    // );

    if (container?.scrollTop >= targetScrollHeight) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  // 使用 useCallback 確保 debounce 不會每次 render 都創建新的 debounced 函數
  const debouncedScrollHandler = useCallback(
    debounce(handleContainerScroll, 200), // 設置 debounce 的延遲時間，這裡是 200 毫秒
    []
  );

  // 使用 hook 監聽最後一個 item 是否進入視口
  const { targetRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>(
    {
      rootMargin: '0px',
      threshold: 0.1,
      freezeOnceVisible: true,
    }
  );

  // 當滾到最後一個就累加 count，觸發打 API 的行為
  useEffect(() => {
    if (isIntersecting && activeTabIsAll) {
      addScrollIntersectingCount();
    }
  }, [isIntersecting, activeTabIsAll]);

  const { elementRef: horizonTabsRef, elementMetrics: horizonTabMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const showGameListObj = {
    [MoreGamePageTabType.ALL]: moreGameList || [], // All
    [MoreGamePageTabType.HOT]: hotGameList || [], // Hot
    [MoreGamePageTabType.RECENT]: [], // Recent: 後端資料未齊全，先留空
  };

  const showGameList: GameListItemResult[] = showGameListObj[activeHorizonTab];
  const hasData = showGameList && showGameList.length > 0;

  return (
    <div className={cx('pt-5', FLEX_COL, 'gap-5', 'relative')}>
      {/* HorizonTab */}
      <div ref={horizonTabsRef} className={cx('w-full', FLEX_CENTER)}>
        <MoreGamePageHorizonTab
          handleMoreGamePageAction={handleMoreGamePageAction}
        />
      </div>

      <div
        className={cx('flex', 'gap-3', 'relative', {
          '-ml-4': activeTabIsAll,
        })}
        style={{
          height: `calc(100vh - ${
            (headerElMetrics.height + 40 + horizonTabMetrics.height + 30) /
            remToPx
          }rem)`,
        }}
      >
        {/* ScrollToTop Button */}
        {showScrollToTop ? (
          <button
            className={cx('absolute bottom-2 right-0 z-[10]', FLEX_CENTER)}
            onClick={() => {
              handleMoreGamePageAction({
                actionName: handleMoreGamePageScrollToTopButtonClick,
              });
            }}
          >
            <Icon
              name="ic_scroll_to_top"
              className={cx('w-10 h-10', 'block')}
            />
          </button>
        ) : null}

        {/* 遊戲廠商列表 */}
        <MoreGamePageVerticalTab
          isShow={activeTabIsAll}
          handleMoreGamePageAction={handleMoreGamePageAction}
        />

        {/* 顯示的遊戲內容 */}
        <div
          ref={moreGamePageContainerRef}
          className={cx(
            'flex-1',
            'grid gap-4 overflow-y-scroll auto-rows-max',
            'pt-px px-px',
            'pb-11 se:pb-6',
            {
              'px-9': !activeTabIsAll,
            },
            `${hasData ? gridItemClass : `${FLEX_CENTER} w-full`}`
          )}
          onScroll={debouncedScrollHandler}
        >
          {hasData ? (
            showGameList.map((item, index: number) => {
              return (
                <GameItem
                  ref={
                    index === showGameList.length - 1
                      ? targetRef // 用來監聽無限滾動
                      : null
                  }
                  key={item.gameId}
                  item={item}
                  showGameName={true}
                  isShowHoverMask={true}
                  imageClassName={normalGameImgAspectClass}
                />
              );
            })
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  );
};
export default MoreGamePage;
