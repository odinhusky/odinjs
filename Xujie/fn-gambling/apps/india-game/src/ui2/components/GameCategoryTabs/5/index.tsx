import cx from '@commonUtils/cx';
import {
  HallPageIdObj,
  HallPageTabIDType,
  useHallPageActionsStore,
  useMode2HallPageDownloadBannerStore,
  useMode2HallPageGameListStore,
  useMode2HallPageStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { FLEX_CENTER, FLEX_COL } from '@constant/style';
import Icon from '@components/Icon';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { Link, scrollSpy } from 'react-scroll';

export const GameCategoryTabs = () => {
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);
  const hallPageTabActionList = useHallPageActionsStore(
    (state) => state.hallPageTabActionList
  );

  const isHallPageAffixed = useMode2HallPageStore(
    (state) => state.isHallPageAffixed
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const currentPxTimes = useTemplateLayoutStore(
    (state) => state.currentPxTimes
  );

  const { isMobile, isTablet } = useBreakPoint();

  const hallGameItemElMetrics = useMode2HallPageGameListStore(
    (state) => state.hallGameItemElMetrics
  );

  const shouldShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.shouldShowDownloadBanner
  );

  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  // 在 GameCategoryTabs 裡新增一個 ref 指向容器
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 計算應該要 padding-bottom 多少
  const [categoryHeight, setCategoryHeight] = useState(1000);

  // offset 倍率
  const [offsetTimes, setOffsetTimes] = useState<number>(0.8);

  useDeepEffect(() => {
    setCategoryHeight(
      headerElMetrics.height +
        bottomNavigationElMetrics.height +
        +(60 * currentPxTimes) // SearchBtn + margin-bottom
    );
  }, [
    headerElMetrics,
    bottomNavigationElMetrics,
    shouldShowDownloadBanner,
    currentPxTimes,
  ]);

  const refs: Record<HallPageTabIDType, RefObject<HTMLDivElement>> = {
    [HallPageIdObj.HOT]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.CASINO]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.FAVORITE]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.GAME]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.FISHING]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.SLOTS]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.SPORTS]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.LOBBY]: useRef<HTMLDivElement>(null),
    [HallPageIdObj.ORIGINAL]: useRef<HTMLDivElement>(null),
  };

  // 點擊滾到到最上方的時候
  const handleScrollToTabList = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑滚动
    });
  };

  const scrollToTabsCount = useHallPageActionsStore(
    (state) => state.scrollToTabsCount
  );

  useEffect(() => {
    if (scrollToTabsCount > 0) handleScrollToTabList();
  }, [scrollToTabsCount]);

  // V6 版本初始化為 Hot 改到父層用 hook 包裝

  // 當在元素內滾動的時候，更新 react-scroll 的狀態
  useEffect(() => {
    const handleScroll = () => {
      scrollSpy.update();
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 決定 offset 倍率
  useDeepEffect(() => {
    const w = headerElMetrics.width;
    if (w <= 480) {
      setOffsetTimes(0.8);
    } else if (w >= 520 && w < 640) {
      setOffsetTimes(0.65);
    } else if (w >= 640 && w < 670) {
      setOffsetTimes(0.6);
    } else if (w >= 670 && w < 700) {
      setOffsetTimes(0.55);
    } else if (w >= 700) {
      setOffsetTimes(0.45);
    }
  }, [headerElMetrics]);

  return (
    <div
      ref={scrollContainerRef}
      className={cx(
        'bgi-[var(--bg-sidebar)]',
        'overflow-y-auto',
        'min-w-[4.5rem]'
      )}
      style={{
        height: `calc(100vh - ${categoryHeight}px)`,
      }}
    >
      <div className={cx(FLEX_COL, 'gap-2')}>
        {tabList.map((item, index) => {
          if (item.isNeedLogin && (!item?.isLogin || !item.collectListLength)) {
            return null;
          }

          return (
            <Link
              className="!opacity-100"
              key={item.id}
              to={`${item.id}`}
              offset={-(hallGameItemElMetrics.height * offsetTimes)}
              spy={true}
              smooth={true}
              duration={10}
              onSetActive={(to) => {
                // console.log('!! spy', to);
                // 避免從沒有 affix 的狀態下點過來會造成 tab reset
                if (!isHallPageAffixed) return;

                setCurTab(item.id);

                const targetRef = refs[item.id];
                if (targetRef?.current && scrollContainerRef.current) {
                  // 確保 scroll 發生在側邊欄容器內部
                  targetRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
            >
              <div
                key={item.id}
                ref={refs[item.id]}
                onClick={() => {
                  hallPageTabActionList[index]();
                }}
                className={cx(
                  FLEX_CENTER,
                  'flex-col',
                  'cursor-pointer relative',
                  'bgi-[var(--base-2-variant14)]',
                  'w-[4.5rem] h-[4.5rem]',
                  'rounded-lg'
                )}
              >
                <div className={cx('w-full h-full')}>
                  <Icon
                    className={cx(
                      'w-full h-full',
                      'rounded-lg border',
                      'bgi-border-[var(--transparent-white-20)]',
                      {
                        'bgi-border-[var(--base-1-variant5)]': item.isActive,
                      }
                    )}
                    imgClassName={cx('rounded-lg')}
                    name={`${item.iconName}`}
                    isActive={item.isActive}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GameCategoryTabs;
