import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { handleMoreGamePageVerticalSupplierTabClick } from '@libs/mode2/action/moreGameaction/acitonType';
import {
  ActionClickPayloadMap,
  HandleMoreGamePageClickProps,
} from '@libs/mode2/action/moreGameaction/useMoreGamePageActions';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useMoreGamePageStoreStore } from '@libs/mode2/zustand/page/moreGamePage';
import { usePlatformInfoStore } from '@libs/mode2/zustand/platform/platformInfoStore';
import { useEffect, useRef } from 'react';

interface MoreGamePageVerticalTabProps {
  isShow?: boolean;
  handleMoreGamePageAction: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMoreGamePageClickProps<T>) => void;
}

export const MoreGamePageVerticalTab = ({
  isShow = true,
  handleMoreGamePageAction,
}: MoreGamePageVerticalTabProps) => {
  const platformItems = usePlatformInfoStore((state) => state.platformItems);
  const activePlatformId = useMoreGamePageStoreStore(
    (state) => state.activePlatformId
  );

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (activePlatformId && tabRefs.current[activePlatformId]) {
      tabRefs.current[activePlatformId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // 讓 Tab 顯示在最近的可見區域
      });
    }
  }, [activePlatformId]);

  return (
    <div
      className={cx('w-[78px] h-full', 'overflow-y-auto', 'pb-5', {
        hidden: !isShow,
      })}
    >
      <div>
        {platformItems.map((item) => {
          const isActive = activePlatformId === item.platformId;

          return (
            <button
              key={item.platformId}
              ref={(el) => (tabRefs.current[item.platformId] = el)} // 設定 ref
              className={cx(
                'w-[78px] h-[96px]',
                'relative',
                FLEX_CENTER,
                'p-1',
                {
                  'bgi-[var(--background-middle)]': !isActive,
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
                <img
                  src={item.manufacturerLogoUrl}
                  alt="Manufacture logo image"
                  className={cx('w-[70px] h-12] block')}
                />

                <span
                  className={cx('block', {
                    'text-base': (item?.name?.length || 0) <= 6,
                    'text-xs break-all': (item?.name?.length || 0) >= 7,
                    'bgi-text-[var(--grayscale-100)]': isActive,
                    'bgi-text-[var(--transparent-white-70)]': !isActive,
                  })}
                >
                  {item.name}
                </span>

                {isActive ? (
                  <img
                    src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
                    alt="Tab Active Bottom background image"
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
