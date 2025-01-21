import cx from '@commonUtils/cx';
import {
  useHallPageActionsStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { FLEX_CENTER } from '@constant/style';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@mode2/components/Icon';
import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';
import { useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { useEffect, useState } from 'react';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const GameCategoryTabs = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakPoint();
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
  const footerElementRef = useTemplateLayoutStore(
    (state) => state.footerElementRef
  );

  const mainElementRef = useTemplateLayoutStore(
    (state) => state.mainElementRef
  );

  const [paddingTop, setPaddingTop] = useState(0);
  const [categoryHeight, setCategoryHeight] = useState(1000);

  // 在 Header 量測置頂，不在變化位置
  useDeepEffect(() => {
    setPaddingTop(headerElMetrics.bottom);
  }, [headerElMetrics]);

  useDeepEffect(() => {
    setCategoryHeight(
      headerElMetrics.bottom + bottomNavigationElMetrics.height
    );
  }, [headerElMetrics, bottomNavigationElMetrics]);

  useEffect(() => {
    if (mainElementRef && mainElementRef?.current) {
      mainElementRef.current.style.paddingLeft = isMobile ? '3.5rem' : '0rem'; // 56px == 3.5rem，使用 rem 才能auto size
    }
    setTimeout(() => {
      if (footerElementRef && footerElementRef?.current) {
        footerElementRef.current.style.paddingLeft = isMobile
          ? '3.5rem'
          : '0rem';
        footerElementRef.current.style.marginLeft = isMobile
          ? '-3.5rem'
          : '0rem';
      }
    }, 100);
    return () => {
      if (mainElementRef && mainElementRef?.current) {
        mainElementRef.current.style.paddingLeft = '0rem';
      }
      if (footerElementRef && footerElementRef?.current) {
        footerElementRef.current.style.paddingLeft = '0rem';
        footerElementRef.current.style.marginLeft = '0rem';
      }
    };
  }, [mainElementRef, footerElementRef, isMobile]);

  // 滾動到最上方
  const scrollToTabsCount = useHallPageActionsStore(
    (state) => state.scrollToTabsCount
  );

  const handleScrollToTabList = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑滚动
    });
  };

  useEffect(() => {
    if (scrollToTabsCount > 0) handleScrollToTabList();
  }, [scrollToTabsCount]);

  return (
    <div
      className={cx(
        'bgi-[var(--bg-sidebar)] rounded-b-lg mobile:rounded-lg',
        'flex',
        'overflow-y-auto',
        {
          'fixed left-0 top-21 flex-col w-14 py-1 z-10': isMobile,
        }
      )}
      style={{
        top: isMobile ? paddingTop + 'px' : '',
        maxHeight: isMobile ? `calc(100% - ${categoryHeight}px)` : 'auto',
      }}
    >
      {tabList.map((item, index) => {
        if (item.isNeedLogin && (!item?.isLogin || !item.collectListLength)) {
          return null;
        }

        return (
          <div
            key={item.id}
            onClick={() => {
              hallPageTabActionList[index]();
            }}
            className={cx(FLEX_CENTER, 'flex-col', 'cursor-pointer relative', {
              'mb-1': isMobile,
              'mr-3 py-1 items-center w-16': !isMobile,
            })}
          >
            <BasePrimaryOutlineBtn
              className={cx('w-10 h-10 rounded-full', {
                'bgi-[var(--grayscale-00)]': !item.isActive,
              })}
              classNameBg={cx('bgi-[var(--grayscale-00)] rounded-full')}
            >
              <Icon className="w-7 h-7" name={item.iconName} />
            </BasePrimaryOutlineBtn>

            <div
              className={cx(
                'bgi-text-[--linear-2]',
                'tab-name',
                'text-xxs mobile:text-sm',
                'font-medium',
                'mt-1',
                {
                  'bgi-text-[var(--grayscale-100)] ': item.isActive,
                  'bgi-text-[var(--grayscale-50)] ': !item.isActive,
                }
              )}
            >
              {renderI18N(item.btnTextKey, t)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameCategoryTabs;
