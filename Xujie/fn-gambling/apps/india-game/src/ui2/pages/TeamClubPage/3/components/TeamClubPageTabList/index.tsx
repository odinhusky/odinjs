import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import {
  TeamClubPageTabConfig,
  useMode2TeamClubPageStore,
} from '@mode2/zustand/page/teamClubPageStore';
import RedDot from '@components/RedDot';
import { FLEX_JUSTIFY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { TeamClubPageTabType } from '@libs/mode2/@types/teamClubPageTabType';
import { handleTeamClubPageTabClick } from '@mode2/action/actionTypes';
import useTeamClubPageActions from '@libs/mode2/action/teamClubPageAction/useTeamClubPageActions';

const tabList: TeamClubPageTabConfig[] = [
  {
    id: TeamClubPageTabType.MY_REWARDS,
    titleKey: 'earn_tab_1',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
  {
    id: TeamClubPageTabType.INVITE_REWARDS,
    titleKey: 'earn_tab_2',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
  {
    id: TeamClubPageTabType.RULES,
    titleKey: 'earn_tab_3',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
];

export const TeamClubPageTabList = () => {
  const { t } = useTranslation();
  const curTab = useMode2TeamClubPageStore((state) => state.curTab);
  const { handleTeamClubPageClick } = useTeamClubPageActions();

  return (
    <div className={cx('relative z-10', 'flex gap-3', 'w-full h-full')}>
      {tabList.map((item, index) => {
        const isActive = item.id === curTab;
        return item.isShow ? (
          <div
            key={item.id}
            className={cx(
              'tab-item',
              FLEX_JUSTIFY_CENTER,
              'items-end',
              'flex-1 h-full',
              'text-center text-base font-medium',
              'py-4 px-px',
              'relative',
              'cursor-pointer',
              item.className
            )}
            onClick={() => {
              // item.action();
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              handleTeamClubPageClick({
                actionName: handleTeamClubPageTabClick,
                payload: { tabId: item.id },
              });
            }}
          >
            <span
              className={cx({
                'bgi-text-[var(--transparent-white-40)]': !isActive,
                'bgi-text-[var(--base-1-main)]': isActive,
              })}
            >
              {t(item.titleKey)}
            </span>

            {isActive ? (
              <img
                src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
                alt="Tab Active Bottom background "
                className={cx(
                  'w-full h-full',
                  'object-contain',
                  'absolute bottom-0 left-0'
                )}
              />
            ) : null}

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
        ) : null;
      })}
    </div>
  );
};

export default TeamClubPageTabList;
