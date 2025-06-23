import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { handleMoreGamePageVerticalSupplierTabClick } from '@mode2/action/actionTypes';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useMoreGamePageStoreStore } from '@libs/mode2/zustand/page/moreGamePage';
import { usePlatformInfoStore } from '@libs/mode2/zustand/platform/platformInfoStore';
import { useEffect, useRef } from 'react';
import { Icon } from '@components/Icon';
import { MoreGamePageVerticalTabProps } from '../MoreGamePageVerticalTabProps';
import SearchGameButton from '@components/SearchGameButton';

export const MoreGamePageVerticalTab = ({
  isShow = true,
  handleMoreGamePageAction,
}: MoreGamePageVerticalTabProps) => {
  const platformItems = usePlatformInfoStore((state) => state.platformItems);
  // const activePlatformId = useMoreGamePageStoreStore(
  //   (state) => state.activePlatformId
  // );

  // const activeManufacturer = useMoreGamePageStoreStore(
  //   (state) => state.activeManufacturer
  // );

  const activePlatform = useMoreGamePageStoreStore(
    (state) => state.activePlatform
  );

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // useEffect(() => {
  //   if (activePlatform && tabRefs.current[activePlatform]) {
  //     tabRefs.current[activePlatform]?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start', // 讓 Tab 顯示在最近的可見區域
  //     });
  //   }
  // }, [activePlatform]);

  useEffect(() => {
    if (activePlatform && tabRefs.current[activePlatform]) {
      const tabEl = tabRefs.current[activePlatform];
      const container = tabEl?.parentElement?.parentElement; // 外层 scroll 容器

      if (tabEl && container) {
        const tabOffsetTop = tabEl.offsetTop;
        const offset = 64; // SearchGameButton 高度 = 4rem = 64px
        container.scrollTo({
          top: Math.max(tabOffsetTop - offset, 0),
          behavior: 'smooth',
        });
      }
    }
  }, [activePlatform]);

  return (
    <div
      className={cx(
        'w-[78px] h-full',
        'overflow-y-auto',
        'pb-[116px]',
        'bgi-[var(--background-middle)]',
        'shadow-[2px_0_4px_rgba(0,0,0,0.5)]',
        // 'shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)]',
        {
          hidden: !isShow,
        }
      )}
    >
      <div>
        <SearchGameButton
          className={cx(
            'w-[4.875rem] h-[4rem] p-1',
            'fixed z-10 bgi-[#1C1C1C]'
          )}
          classNameText="mt-2"
        />
        <div className="w-[4.875rem] h-[4rem] p-1"></div>

        {platformItems.map((item) => {
          const isActive = activePlatform === item.manufacturer;

          return (
            <button
              key={item.platformId}
              ref={(el) => (tabRefs.current[item.manufacturer] = el)} // 設定 ref
              className={cx(
                'w-[78px] h-[96px]',
                'relative',
                FLEX_CENTER,
                'p-1',
                {
                  '': !isActive,
                  'bgi-[var(--base-2-variant5)]': isActive,
                }
              )}
              onClick={() => {
                handleMoreGamePageAction({
                  actionName: handleMoreGamePageVerticalSupplierTabClick,
                  payload: {
                    item,
                  },
                });
              }}
            >
              <div className={cx(FLEX_COL, 'items-center', 'gap-2')}>
                <Icon
                  className={'h-12 w-[62px]'}
                  name={`ic_mfg_${item.manufacturer.toLowerCase()}`}
                  isActive={isActive}
                />
                {/*<img*/}
                {/*  src={item.manufacturerLogoUrl}*/}
                {/*  alt="Manufacture logo image"*/}
                {/*  className={cx('w-[70px] h-12] block')}*/}
                {/*/>*/}

                <span
                  className={cx('block', {
                    'text-base': (item?.manufacturer?.length || 0) <= 6,
                    'text-xs break-all': (item?.manufacturer?.length || 0) >= 7,
                    'bgi-text-[var(--grayscale-100)]': isActive,
                    'bgi-text-[var(--transparent-white-70)]': !isActive,
                  })}
                >
                  {item.manufacturer}
                </span>

                {isActive ? (
                  <img
                    src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
                    alt="Tab Active Bottom background_image"
                    className={cx(
                      'w-full',
                      'object-contain',
                      'absolute bottom-0 left-0'
                    )}
                  />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoreGamePageVerticalTab;
