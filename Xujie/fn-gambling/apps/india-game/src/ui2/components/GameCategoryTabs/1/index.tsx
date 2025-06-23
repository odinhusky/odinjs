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
      className={cx(
        'tab-list',
        'bgi-[var(--transparent-gray-60)]',
        'h-16 tablet:h-[76px]',
        'mb-4 mobile:mb-5',
        '-mx-4 mobile:-mx-5 tablet:mx-0',
        'px-4 mobile:px-6 tablet:px-2 py-2',
        'rounded-lg'
      )}
    >
      <div
        ref={hallPageTabContainerRef}
        className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-2', 'overflow-x-auto')}
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
    </div>
  );
};

export default GameCategoryTabs;
