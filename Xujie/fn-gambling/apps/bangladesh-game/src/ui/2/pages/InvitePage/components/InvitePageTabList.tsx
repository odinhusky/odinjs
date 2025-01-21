import cx from '@commonUtils/cx';
import {
  useMode2InvitePageActionsStore,
  useMode2InviteTabStore,
} from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import RedDot from '@components/RedDot';
import { FLEX_CENTER } from '@libs/constant/style';

export const InvitePageTabList = () => {
  const { t } = useTranslation();
  const tabList = useMode2InviteTabStore((state) => state.tabList);
  const inviteTabActionList = useMode2InvitePageActionsStore(
    (state) => state.inviteTabActionList
  );

  const isShowRedDot = useMode2InviteTabStore((state) => state.isShowRedDot);

  return (
    <div
      className={cx(
        'flex',
        'bgi-[var(--grayscale-15)]',
        '-mx-4 mb-5 tablet:mx-0',
        'rounded-none tablet:rounded-lg',
        'shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
      )}
    >
      {tabList.map((item, index) =>
        item.isShow ? (
          <div
            key={item.id}
            className={cx(
              'tab-item',
              FLEX_CENTER,
              'flex-1',
              'tablet:rounded',
              'text-center font-semibold',
              'text-sm mobile:text-base',
              'p-1.5 mobile:p-3',
              'relative',
              'cursor-pointer',
              'bgi-[var(--grayscale-15)]',
              {
                'bgi-[var(--linear-1)]': item.isActive,
                'bgi-[var(--grayscale-15)]': !item.isActive,
                'rounded-r-none tablet:rounded-l-lg':
                  item.isActive && index === 0,
                'rounded-r-none tablet:rounded-r-lg':
                  item.isActive && index + 1 === tabList.length,
              }
            )}
            onClick={() => {
              // item.action();
              inviteTabActionList[index]();
            }}
          >
            <span
              className={cx({
                'bgi-text-[var(--grayscale-50)]': !item.isActive,
                'bgi-text-[var(--base-2-main)]': item.isActive,
              })}
            >
              {t(item.title)}
            </span>

            {item.isActive ? <div className="gradient-line"></div> : null}
            {isShowRedDot && item.id === InvitePageTabType.EARN && (
              <div
                className={cx(
                  'w-2.5 h-2.5',
                  'absolute right-2.5 top-1',
                  'rounded-[100%]'
                )}
              ></div>
            )}

            {item.isShowRedDot ? (
              <RedDot
                size="8"
                className={
                  'absolute block tablet:hidden top-1 right-2 mobile:top-2 mobile:right-4'
                }
              />
            ) : null}
          </div>
        ) : null
      )}
    </div>
  );
};

export default InvitePageTabList;
