import cx from '@commonUtils/cx';
import {
  HallPageIdObj,
  HallPageTabIDType,
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { FLEX_CENTER, FLEX_COL, remToPx } from '@constant/style';
import Icon from '@components/Icon';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { Link, scrollSpy } from 'react-scroll';

export const GameCategoryTabs = () => {
  const { isDesktop } = useBreakPoint();
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);
  const hallPageTabActionList = useHallPageActionsStore(
    (state) => state.hallPageTabActionList
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const curTab = useMode2HallPageTabsStore((state) => state.curTab);

  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  const [categoryHeight, setCategoryHeight] = useState(1000);

  useDeepEffect(() => {
    setCategoryHeight(
      headerElMetrics.bottom + bottomNavigationElMetrics.height
    );
  }, [headerElMetrics, bottomNavigationElMetrics]);

  // 滾動到最上方
  const scrollToTabsCount = useHallPageActionsStore(
    (state) => state.scrollToTabsCount
  );

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

  const handleScrollToTabList = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑滚动
    });
  };

  useEffect(() => {
    if (scrollToTabsCount > 0) handleScrollToTabList();
  }, [scrollToTabsCount]);

  // V6 版本初始化為 Hot，並取消大廳的Tab
  useEffect(() => {
    setCurTab(HallPageIdObj.HOT);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollSpy.update();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDesktop]);

  // 如果有滾動到被遮住的 Tab，就讓它顯示在畫面上
  useEffect(() => {
    if (!isDesktop) {
      refs[curTab]?.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [curTab, isDesktop]);

  return (
    <div
      className={cx(
        'bgi-[var(--bg-sidebar)]',
        'overflow-y-auto',
        'min-w-[4.5rem]'
      )}
      style={{
        height: `calc(100vh - ${categoryHeight / remToPx}rem)`,
      }}
    >
      <div className={cx(FLEX_COL, 'gap-2')}>
        {tabList.map((item, index) => {
          if (item.isNeedLogin && (!item?.isLogin || !item.collectListLength)) {
            return null;
          }

          return (
            <Link
              key={item.id}
              to={`${item.id}`}
              offset={-90}
              spy={true}
              // hashSpy={true}
              smooth={true}
              duration={10}
              onSetActive={(to) => {
                console.log('!! spy', to);
                setCurTab(item.id);
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
                <div className={cx('w-full h-full rounded-full')}>
                  <Icon
                    className="w-full h-full"
                    imgClassName="rounded-lg"
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
