import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
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
import { useBreakPoint } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { QuitButton } from '@components/QuitButton';
import {
  MenuScenarios,
  useMenuListStore,
} from '@libs/mode2/zustand/components/menuListStore';

export const DrawerMenu = () => {
  const isShowMenu = useShowMenuStore((state) => state.isShowMenu);
  const closeMenu = useShowMenuStore((state) => state.closeMenu);
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

  const activity = [
    {
      icon: 'side_bar_deposit_wheel',
      action: () => handleMenuRouter(BasePagePathObj.RechargeWheelPage),
    },
    {
      icon: 'side_bar_invite_wheel',
      action: () => handleMenuRouter(BasePagePathObj.InviteWheelPage),
    },
  ];

  const menuUsageScenariosList = useMenuListStore(
    (state) => state.menuUsageScenariosList
  );
  const groups =
    menuUsageScenariosList.find((item) => {
      return item.scenarios === MenuScenarios.TEAM_CLUB_DRAWER_MENU;
    })?.menuList || [];

  // TODO Ronan 關注 useObserverElementMetrics
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

        <div>
          <div className={cx('flex flex-col gap-2 p-0 mb-4 mobile:mb-5')}>
            {activity.map((item, index) => {
              return (
                <img
                  key={index}
                  src={getImgUrl(EResourceLevel.V, item.icon)}
                  className="h-[60px] tablet:h-[72px] object-contain cursor-pointer"
                  alt=""
                  onClick={item.action}
                />
              );
            })}
          </div>

          <div className={cx('flex flex-col gap-2 p-0')}>
            {groups?.map((item, index) => (
              <div
                key={item.label}
                className={cx(
                  'flex items-center justify-between cursor-pointer',
                  'text-sm mobile:text-base',
                  'bgi-[var(--transparent-gray-20)] rounded-full py-2 px-4 mobile:py-3 border-b-0 h-auto',
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
                      item.active
                        ? 'var(--grayscale-100)'
                        : 'var(--base-1-light)'
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
        </div>
        <div className={cx('mt-9', FLEX_COL, 'gap-4')}>
          <div className="grid grid-cols-2 gap-2">
            {serviceList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'flex flex-col gap-2 items-center rounded-lg',
                  'bgi-[var(--transparent-gray-20)] py-3 mobile:py-4 box-border',
                  'cursor-pointer'
                )}
                onClick={item.onActionClick}
              >
                <img
                  className="w-8 h-8 mobile:w-9 mobile:h-9"
                  src={getImgUrl(
                    EResourceLevel.V,
                    `fab_${item.label.toLocaleLowerCase()}_default`
                  )}
                  alt=""
                />
                <span className="bgi-text-[var(--grayscale-100)] text-sm mobile:text-base font-medium drop-shadow-[0px_0px_4px_0px_#00000080]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/*<div className="grid grid-cols-2 gap-3">*/}
          {/*  {serviceList.map((item, index) => (*/}
          {/*    <button key={item.label} onClick={item.onActionClick}>*/}
          {/*      <Icon*/}
          {/*        className="w-full"*/}
          {/*        name={`bg_drawer_menu_${item.type.toLocaleLowerCase()}`}*/}
          {/*      />*/}
          {/*    </button>*/}
          {/*  ))}*/}
          {/*</div>*/}
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
          <QuitButton
            className={cx(
              'flex justify-center text-sm mobile:text-base mobile:py-3 !bgi-[var(--grayscale-10)] rounded'
            )}
            iconClassName={cx('w-6 h-6')}
            onClick={handleLogout}
          />
        </div>
      </div>
    </Drawer>
  ) : null;
};
