import { useLocation } from 'react-router';
import { EResourceLevel } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import Icon from '@mode2/components/Icon';
import LangueSelect from '@components/LangueSelect';
import { useMenuBase } from '@/hooks/components/useMenuBase';
import Drawer from '@mode2/components/Drawer';
import { useShowMenuStore } from '@mode2/zustand/menuStore';

import cx from '@commonUtils/cx';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useEffect, useMemo, useState } from 'react';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { useBreakPoint } from '@libs/commonUtils';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { FLEX_COL } from '@libs/constant/style';
import { useIsLoginStore } from '@libs/mode2/zustand/loginStore';
import { TeamClubPageTabType } from '@libs/mode2/@types/teamClubPageTabType';

export const DrawerMenu = () => {
  const location = useLocation();

  const isShowMenu = useShowMenuStore((state) => state.isShowMenu);
  const closeMenu = useShowMenuStore((state) => state.closeMenu);
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const { t } = useTranslation();
  const { handleMenuRouter, handleLogout } = useMenuBase();
  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );
  const serviceList = useMemo(() => {
    return (
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.DRAWER_MENU
      )?.customerServiceList || []
    );
  }, [usageScenariosList]);
  const setActivityPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );
  const pageIdx = useMode2ActivitySwitchPageStore((state) => state.pageIdx);

  const groups = [
    {
      label: 'leftnav_vip',
      icon: 'ic_vip',
      active:
        location.pathname === BasePagePathObj.ActivityPage &&
        pageIdx === ActivityPageTabType.VIP,
      action: () => {
        setActivityPageIdx(ActivityPageTabType.VIP);
        handleMenuRouter(BasePagePathObj.ActivityPage, {
          state: { tab: ActivityPageTabType.VIP },
        });
      },
    },
    {
      label: 'leftnav_account',
      icon: 'ic_user',
      active: location.pathname === BasePagePathObj.MyPage,
      action: () => handleMenuRouter(BasePagePathObj.MyPage),
    },
    {
      label: 'leftnav_earn_money',
      icon: 'ic_earn_money',
      active: location.pathname === BasePagePathObj.TeamClubPage,
      action: () =>
        handleMenuRouter(BasePagePathObj.TeamClubPage, {
          state: { tab: TeamClubPageTabType.MY_REWARDS },
        }),
    },
  ];

  const [paddingTop, setPaddingTop] = useState(0);
  useEffect(() => {
    const headerEl = document.getElementsByTagName('header')[0];
    if (headerEl) {
      const rect = headerEl.getBoundingClientRect();
      setPaddingTop(rect.top + headerEl.clientHeight);
    }
  }, [isShowMenu]);
  const { isDesktop } = useBreakPoint();
  return !isDesktop ? (
    <Drawer
      className={cx('!bgi-[var(--bg-sidebar)] w-full')}
      open={isShowMenu}
      onClose={closeMenu}
      placement="left"
      styles={{
        mask: {
          opacity: 0,
        },
        wrapper: {
          width: '304px',
          marginTop: paddingTop,
        },
      }}
    >
      <div
        className={cx(
          'menu',
          FLEX_COL,
          'justify-between',
          'tablet:block',
          'h-full',
          'shrink-0',
          'bgi-[var(--bg-sidebar)]',
          'overflow-y-auto',
          'box-border',
          'text-sm tablet:text-base',
          'leading-6',
          'px-4 pb-4 pt-14',
          'top-0',
          'relative'
        )}
      >
        <div
          className="absolute w-6 h-6 left-4 top-3 cursor-pointer"
          onClick={closeMenu}
        >
          <Icon className="w-full opacity-70" name="ic_close" />
        </div>
        <div className={cx('flex flex-col gap-3 p-0')}>
          {groups?.map((item, index) => (
            <div
              key={item.label}
              className={cx(
                'flex items-center justify-between cursor-pointer',
                'text-sm mobile:text-base',
                'bgi-[var(--grayscale-20)] rounded-full p-3 border-b-0 h-auto',
                {
                  '!bgi-[var(--base-1-light)] bgi-border-[var(--base-1-dark)] after:border-2 after:rounded-full':
                    item.active,
                }
              )}
              onClick={item.action}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={'w-6 h-6'}
                  level={EResourceLevel.V}
                  name={item.icon}
                  color={
                    item.active ? 'var(--grayscale-100)' : 'var(--base-1-light)'
                  }
                />
                <span
                  className={cx(
                    'bgi-text-[var(--base-1-light)] text-base font-medium',
                    {
                      'bgi-text-[var(--grayscale-100)]': item.active,
                    }
                  )}
                >
                  {t(item.label)}
                </span>
              </div>
              <Icon
                className={cx('w-4 h-4', {
                  'w-5 h-5': item.active,
                })}
                name="ic_arrow_right_1"
                color={
                  item.active ? 'var(--grayscale-100)' : 'var(--base-1-light)'
                }
              />
            </div>
          ))}
        </div>
        <div className={cx('mt-9', FLEX_COL, 'gap-3')}>
          <div className="grid grid-cols-2 gap-3">
            {serviceList.map((item, index) => (
              <button key={item.label} onClick={item.onActionClick}>
                <Icon
                  className="w-full"
                  name={`bg_drawer_menu_${item.type.toLocaleLowerCase()}`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2 py-3 px-2 items-center">
            <div className="shrink-0 w-9 h-9 bgi-[var(--base-3-main)] p-1 rounded-full">
              <Icon className="w-full" name="ic_language" />
            </div>
            <LangueSelect
              arrowColor={'var(--grayscale-100)'}
              labClassName={'!bgi-text-[var(--grayscale-100)]'}
            />
          </div>
          <button
            className={cx(
              'bgi-[var(--base-3-main)] hover:bgi-[var(--base-3-light)] active:bgi-[var(--base-3-dark)]',
              'py-2 px-4 rounded-full'
            )}
            onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
          >
            <div className="text-base bgi-text-[var(--grayscale-100)] font-semibold">
              {t('leftnav_customer_support')}
            </div>
          </button>
          <button
            className={cx(
              'bgi-[var(--grayscale-30)] py-2 px-4 rounded-full hidden',
              {
                block: isLogin,
              }
            )}
            onClick={handleLogout}
          >
            <div className="text-base bgi-text-[var(--grayscale-100)] font-semibold">
              {t('leftnav_quit')}
            </div>
          </button>
        </div>
      </div>
    </Drawer>
  ) : null;
};
