import './index.scss';
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
import { QuitButton } from '@components/QuitButton';
import { FLEX_COL } from '@libs/constant/style';
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

  const iconMapping: Record<string, string> = {
    telegram: 'icon_telegram_1',
    instagram: 'icon_instagram_1',
    youtube: 'icon_youtube_1',
    whatsapp: 'icon_whatsapp_1',
    facebook: 'icon_facebook_1',
    tiktok: 'icon_tiktok_1',
    twitter: 'icon_twitter_1',
  };

  const serviceList = useMemo(() => {
    return (
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.DRAWER_MENU
      )?.customerServiceList || []
    ).map((item) => {
      return {
        ...item,
        icon: iconMapping[item.label.toLowerCase()] || item.icon,
      };
    });
  }, [usageScenariosList]);

  const menuUsageScenariosList = useMenuListStore(
    (state) => state.menuUsageScenariosList
  );
  const groups = (
    menuUsageScenariosList.find((item) => {
      return item.scenarios === MenuScenarios.DEFAULT_DRAWER_MENU;
    })?.menuList || []
  ).map((item) => ({
    ...item,
    icon: `${item.icon}_default_1`,
  }));

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
          {groups?.map((item, index) => (
            <div
              key={item.label + '_' + index}
              className={cx(
                'flex items-center justify-between cursor-pointer  py-1 border-b border-[var(--transparent-white-10)] last-of-type:border-none',
                'h-8 mobile:h-10 text-sm mobile:text-base'
              )}
              onClick={item.action}
            >
              <div className="flex items-center gap-2.5">
                <Icon name={item.icon} color="var(--base-2-main)" />
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
              key={index + '-' + item.label}
              className="menu-bottom-group-item"
              onClick={item.onActionClick}
            >
              <div className="left-item">
                <Icon
                  className="menu-icon w-6 h-6 rounded-full bgi-[var(--base-2-main)]"
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

export default DrawerMenu;
