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
          'min-w-16 mobile:min-w-20 tablet:min-w-[88px]',
          FLEX_CENTER,
          'flex-col',
          'cursor-pointer relative',
          item.isActive
            ? 'bgi-[var(--linear-8-light)] bgi-border-b-[var(--linear-3)]'
            : ''
        )}
      >
        <Icon
          className="w-5 h-5 tablet:w-7 tablet:h-7"
          name={item.iconName}
          color="var(--base-2-main)"
        />

        <div
          className={cx(
            'bgi-text-[--linear-2]',
            'tab-name',
            'text-xs tablet:text-base',
            'font-medium',
            'c-base-2-main'
          )}
        >
          {renderI18N(item.btnTextKey, t)}
        </div>
        {item.isActive ? <div className="gradient-line"></div> : null}
      </div>
    );
  }
);

export default GameCategoryTab;
