import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER } from '@libs/constant/style';
import {
  useMode2FeedBackPageActionsStore,
  useMode2FeedBackPageTabStore,
} from '@mode2/zustand/page/feedbackPageStore';
import { useTranslation } from 'react-i18next';

export const FeedBackTabList = () => {
  const { t } = useTranslation();
  const isShowRedDot = useMode2FeedBackPageTabStore(
    (state) => state.isShowRedDot
  );
  const activeTabId = useMode2FeedBackPageTabStore(
    (state) => state.activeTabId
  );
  const tabList = useMode2FeedBackPageTabStore((state) => state.tabList);

  const feedbackTabActionList = useMode2FeedBackPageActionsStore(
    (state) => state.feedbackTabActionList
  );

  return (
    <div
      className={cx(
        'flex overflow-hidden',
        'mb-3 mobile:mb-5 tablet:mb-0',
        'tablet:rounded-t-lg',
        'shadow-[0px_2px_4px_0px_#33333329]',
        'bgi-[var(--grayscale-15)]'
      )}
    >
      {tabList.map((item, index) => (
        <div
          key={item.id}
          className={cx(
            FLEX_CENTER,
            'flex-1',
            'h-12',
            'py-1 px-1',
            'text-center font-semibold',
            'text-sm mobile:text-base',
            'cursor-pointer',
            'relative',
            activeTabId === item.id
              ? 'bgi-[var(--linear-1)]'
              : 'bgi-[var(--grayscale-15)]'
          )}
          onClick={() => {
            feedbackTabActionList[index]();
          }}
        >
          <span
            className={cx('p-1',
              activeTabId === item.id
                ? 'bgi-text-[var(--grayscale-00)]'
                : 'bgi-text-[var(--grayscale-50)]'
            )}
          >
            {renderI18N(item.tabNameI18N, t)}
          </span>

          {activeTabId === item.id ? (
            <div
              className={cx(
                'w-full h-[3px]',
                'absolute left-0 bottom-0',
                'bgi-[var(--linear-3)]'
              )}
            ></div>
          ) : null}

          {isShowRedDot && item.id === 1 ? (
            <div
              className={cx(
                'w-2.5 h-2.5',
                'absolute right-2.5 top-1',
                'rounded-[100%]',
                'bgi-[red]'
              )}
            ></div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default FeedBackTabList;
