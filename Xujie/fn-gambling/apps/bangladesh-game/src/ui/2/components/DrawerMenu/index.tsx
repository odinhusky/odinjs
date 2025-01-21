import './index.scss';
import { EResourceLevel } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import LangueSelect from '@components/LangueSelect';
import { useMenuBase } from '@/hooks/components/useMenuBase';
import Drawer from '@mode2/components/Drawer';
import { useShowMenuStore } from '@mode2/zustand/menuStore';
import Icon from '@mode2/components/Icon';
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
import { QuitButton } from '@components/QuitButton';
import { FLEX_COL } from '@libs/constant/style';

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
  const setActivityPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );

  const groups = [
    {
      label: 'leftnav_vip',
      icon: 'ic_vip',
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
      action: () => handleMenuRouter(BasePagePathObj.MyPage),
    },
    {
      label: 'leftnav_earn_money',
      icon: 'ic_earn_money',
      action: () => handleMenuRouter(BasePagePathObj.InvitePage),
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
          'p-4',
          'top-0',
          '!pt-10 relative'
        )}
      >
        <div
          className="absolute w-5 h-5 left-3 top-3 cursor-pointer"
          onClick={closeMenu}
        >
          <Icon className="w-full" name="ic_close" />
        </div>
        <div className="bgi-[var(--grayscale-10)] py-1 px-3 rounded-md">
          {groups?.map((item) => (
            <div
              className={cx(
                'flex items-center justify-between cursor-pointer  py-1 border-b border-[var(--transparent-white-10)] last-of-type:border-none',
                'h-8 mobile:h-10 text-sm mobile:text-base'
              )}
              key={item.label}
              onClick={item.action}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  level={EResourceLevel.V}
                  name={item.icon}
                  color="var(--base-2-main)"
                />
                <span className="bgi-text-[var(--base-2-main)]">
                  {t(item.label)}
                </span>
              </div>
              <Icon
                className="w-4 h-4"
                name="ic_arrow_right_1"
                color="var(--base-2-main)"
              />
            </div>
          ))}
        </div>

        <div className={cx('menu-bottom-group', 'mt-9', FLEX_COL, 'gap-2')}>
          {serviceList.map((item, index) => (
            <div
              key={index}
              className="menu-bottom-group-item"
              onClick={item.onActionClick}
            >
              <div className="left-item">
                <Icon
                  className="menu-icon"
                  level={EResourceLevel.SHARED}
                  color="var(--base-2-main)"
                  name={item.icon}
                />
                <span>{item.label}</span>
              </div>
            </div>
          ))}
          <div className="menu-bottom-group-item">
            <Icon
              className="menu-icon"
              color="var(--base-2-main)"
              name="ic_language"
            />
            <LangueSelect />
          </div>
          <div
            className="menu-bottom-group-item"
            onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
          >
            <div className="left-item">
              <Icon
                className="menu-icon"
                color="var(--base-2-main)"
                name={'ic_customer_support'}
              />
              <span>{t('leftnav_customer_support')}</span>
            </div>
            <Icon
              className={cx('w-4 h-4')}
              name="ic_arrow_right_1"
              color="var(--base-2-main)"
            />
          </div>
          <QuitButton onClick={handleLogout} />
        </div>
      </div>
    </Drawer>
  ) : null;
};
