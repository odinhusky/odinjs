import React, { useEffect, useRef } from 'react';
import cx from '@commonUtils/cx';
import {
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { FLEX_ITEMS_CENTER } from '@constant/style';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import GameCategoryTab from './GameCategoryTab';
import { handleScrollToElementTop } from '@libs/commonUtils';

export const GameCategoryTabs = () => {
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);

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
        'h-16 tablet:h-[80px]',
        'mb-4 mobile:mb-5',
        '-mx-1',
        FLEX_ITEMS_CENTER,
        'gap-3',
        'overflow-x-auto',
        'px-1'
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
