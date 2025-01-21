import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import {
  useMode2TeamClubPageActionsStore,
  useMode2TeamClubPageStore,
} from '@mode2/zustand/page/teamClubPageStore';
import RedDot from '@components/RedDot';
import { FLEX_CENTER } from '@libs/constant/style';

export const TeamClubPageTabList = () => {
  const { t } = useTranslation();

  const tabList = useMode2TeamClubPageStore((state) => state.tabList);
  const teamClubTabActionList = useMode2TeamClubPageActionsStore(
    (state) => state.teamClubTabActionList
  );

  return (
    <div
      className={cx(
        'relative z-10',
        'flex justify-stretch',
        'bgi-[var(--grayscale-15)]',
        '-mx-4 tablet:mx-0',
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
              'flex-auto',
              'tablet:rounded',
              'text-center font-semibold',
              'se:text-sm text-xs',
              'p-1.5',
              'relative',
              'cursor-pointer',
              'bgi-[var(--grayscale-15)]',
              item.className,
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
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              teamClubTabActionList[index]();
            }}
          >
            <span
              className={cx({
                'bgi-text-[var(--grayscale-50)]': !item.isActive,
                'bgi-text-[var(--base-2-main)]': item.isActive,
              })}
            >
              {t(item.titleKey)}
            </span>

            {item.isActive ? <div className="gradient-line"></div> : null}

            {item.isShowRedDot ? (
              <RedDot
                type="img"
                className={cx(
                  'absolute block tablet:hidden top-1 right-2 mobile:top-2 mobile:right-4',
                  'w-2 h-2'
                )}
              />
            ) : null}
          </div>
        ) : null
      )}
    </div>
  );
};

export default TeamClubPageTabList;
