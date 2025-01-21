import React, { useEffect, useRef } from 'react';
import cx from '@commonUtils/cx';
import {
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import GameCategoryTab from './GameCategoryTab';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { handleScrollToElementTop } from '@libs/commonUtils';

export const GameCategoryTabs = () => {
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);

  // 滾動到最上方
  const scrollToTabsCount = useHallPageActionsStore(
    (state) => state.scrollToTabsCount
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const hallPageTabContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToTabsCount > 0) {
      const offset = (headerElMetrics.height || 0) * -1;
      handleScrollToElementTop(hallPageTabContainerRef?.current, offset);
    }
  }, [scrollToTabsCount]);

  return (
    <div
      ref={hallPageTabContainerRef}
      className={cx(
        'tab-list',
        'bgi-[var(--linear-1)]',
        'h-12 tablet:h-[60px]',
        'mb-4 mobile:mb-5',
        'flex',
        'overflow-x-auto',
        '-mx-4 mobile:-mx-5 tablet:mx-0'
      )}
    >
      {tabList.map((item, index) => {
        if (item.isNeedLogin && (!item?.isLogin || !item.collectListLength)) {
          return null;
        }

        return (
          <GameCategoryTab
            key={item.id}
            ref={hallPageTabContainerRef}
            item={item}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default GameCategoryTabs;
