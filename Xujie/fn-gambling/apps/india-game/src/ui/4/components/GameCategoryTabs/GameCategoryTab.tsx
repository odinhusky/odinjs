import { cx, handleScrollToElementLeft } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';
import {
  HallPageTab,
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@libs/mode2/zustand/page/hallPageStore';
import { RefObject, forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface GameCategoryTabProps {
  item: HallPageTab;
  index: number;
}

export const GameCategoryTab = forwardRef<HTMLDivElement, GameCategoryTabProps>(
  ({ item, index }, ref) => {
    const { t } = useTranslation();
    const curTab = useMode2HallPageTabsStore((state) => state.curTab);
    const hallPageTabActionList = useHallPageActionsStore(
      (state) => state.hallPageTabActionList
    );

    const scrollToTabsCount = useHallPageActionsStore(
      (state) => state.scrollToTabsCount
    );

    const itemRef = useRef<HTMLDivElement>(null);

    const handleScrollLeftVisible = () => {
      if (curTab === item.id) {
        const container = ref as RefObject<HTMLDivElement>;
        handleScrollToElementLeft(container?.current, itemRef.current);
      }
    };

    useEffect(() => {
      handleScrollLeftVisible();
    }, [scrollToTabsCount]);

    return (
      <div
        ref={itemRef}
        key={item.id}
        onClick={() => {
          hallPageTabActionList[index]();
        }}
        className={cx(
          'min-w-16 mobile:min-w-20 tablet:min-w-[92px]',
          'h-14 tablet:h-[72px]',
          FLEX_CENTER,
          'flex-col',
          'rounded-lg',
          'cursor-pointer relative',
          'bg-shadow-[var(--shadow-game)]',
          item.isActive
            ? 'bgi-[var(--base-1-main)]'
            : 'bgi-[var(--grayscale-10)]'
        )}
      >
        <Icon
          className="w-5 h-5 tablet:w-7 tablet:h-7"
          name={item.iconName}
          color={item.isActive ? 'var(--grayscale-100)' : 'var(--base-1-light)'}
        />

        <div
          className={cx(
            'bgi-text-[--linear-2]',
            'tab-name',
            'text-xs tablet:text-base',
            'font-medium',
            'c-base-2-main',
            item.isActive
              ? 'bgi-text-[var(--grayscale-100)]'
              : 'bgi-text-[var(--base-1-light)]'
          )}
        >
          {renderI18N(item.btnTextKey, t)}
        </div>
      </div>
    );
  }
);

export default GameCategoryTab;
