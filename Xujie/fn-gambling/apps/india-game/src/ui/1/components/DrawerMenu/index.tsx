import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import LangueSelect from '@components/LangueSelect';
import { useMenuBase } from '@/hooks/components/useMenuBase';
import { useShowMenuStore } from '@mode2/zustand/menuStore';

import cx from '@commonUtils/cx';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useMemo } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import renderI18N from '@libs/commonUtils/renderI18N';
import { usePlatformInfoStore } from '@mode2/zustand/platform/platformInfoStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import {
  handleMenuAnnouncementsActionClick,
  handleMenuPlatformItemActionClick,
} from '@mode2/action/components/menu/actionType';
import useMenuAction from '@mode2/action/components/menu/menuAction';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { Drawer } from 'antd';
import {
  useMenuListStore,
  MenuScenarios,
} from '@libs/mode2/zustand/components/menuListStore';

export const DrawerMenu = () => {
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useBreakPoint();
  const { handleMenuRouter, handleLogout } = useMenuBase();

  // const [paddingTop, setPaddingTop] = useState(0);
  const isShowMenu = useShowMenuStore((state) => state.isShowMenu);
  const closeMenu = useShowMenuStore((state) => state.closeMenu);
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

  const sidebarPlatformItems = usePlatformInfoStore(
    (state) => state.sidebarPlatformItems
  );
  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );

  const sidebarAnnouncement = useMemo(() => {
    const result = announcementsItems.find((item) => {
      return item.showInSidebar;
    });
    return result;
  }, [announcementsItems]);

  const sidebarAnnouncementBannerUrl = sidebarAnnouncement?.bannerUrl;

  const { handleMenuClick } = useMenuAction();

  const menuUsageScenariosList = useMenuListStore(
    (state) => state.menuUsageScenariosList
  );
  const groups =
    menuUsageScenariosList.find((item) => {
      return item.scenarios === MenuScenarios.IN_MODE1_COMMON_MENU;
    })?.menuList || [];

  const fillPlaceholder = (items: GameListItemResult[], columns: number) => {
    const remainder = items.length % columns;
    const placeholders = remainder > 0 ? columns - remainder : 0;
    return Array.from({ length: placeholders }, (_, index) => (
      <div
        key={`placeholder-${index}`}
        className="bgi-[var(--grayscale-20)] p-2 rounded"
      ></div>
    ));
  };

  return !isDesktop ? (
    <Drawer
      closable={true}
      width={isMobile ? '296' : '360'}
      className="p-0 !bgi-[var(--bg-sidebar)]"
      open={isShowMenu}
      onClose={closeMenu}
      placement="left"
      closeIcon={<Icon className="w-full opacity-70" name="ic_close" />}
      title={<div className="w-1 h-1" />}
      bodyStyle={{
        padding: 0,
      }}
      styles={{
        header: {
          padding: 0,
          paddingLeft: '16px',
          paddingTop: '12px',
        },
      }}
    >
      <div
        className={cx(
          FLEX_COL,
          'justify-between',
          'tablet:block',
          'h-full',
          'shrink-0',
          'overflow-y-auto',
          'box-border',
          'text-sm tablet:text-base',
          'leading-6',
          'py-3 px-4',
          'top-0',
          'relative',
          'bgi-text-[var(--grayscale-100)]'
        )}
      >
        <div className="flex flex-col gap-2">
          {/* 展示側邊欄，遊戲廠商平台項目 */}
          {sidebarPlatformItems ? (
            <div className="grid grid-cols-2 gap-2">
              {sidebarPlatformItems.map((item, index) => {
                return (
                  <div
                    key={item.name + '_' + index}
                    className="flex bgi-[var(--grayscale-20)] h-8 rounded
                        justify-center items-center cursor-pointer"
                    onClick={() => {
                      handleMenuClick({
                        actionName: handleMenuPlatformItemActionClick,
                        payload: {
                          item: item,
                        },
                      });
                    }}
                  >
                    <img className="h-full" src={item.coverImageSrc} />
                  </div>
                );
              })}

              {/* 自動補齊 */}
              {fillPlaceholder(sidebarPlatformItems, 2)}
            </div>
          ) : null}

          {/* 展示側邊欄，平台公告項目 */}
          {sidebarAnnouncement !== undefined ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                handleMenuClick({
                  actionName: handleMenuAnnouncementsActionClick,
                  payload: {
                    item: sidebarAnnouncement,
                  },
                });
              }}
            >
              <img src={sidebarAnnouncementBannerUrl} alt="banner" />
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            {groups?.map((item, index) => (
              <button
                key={item.label + index}
                className="flex gap-2 rounded p-2 items-center"
                onClick={item.action}
              >
                <Icon
                  className="h-6 w-6"
                  name={item.icon}
                  color={item.iconColor ? item.iconColor : ''}
                />

                <span className="text-sm text-left font-medium">
                  {item.param
                    ? renderI18N(
                        {
                          i18nKey: item.label,
                          i18nOption: {
                            value:
                              item.label === 'leftnav_invite_earn' ||
                              item.label === 'leftnav_bonus_monthly'
                                ? formatMoney(Number(item.param) || 0)
                                : item.param,
                          },
                        },
                        t
                      )
                    : renderI18N({ i18nKey: item.label }, t)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 p-2 items-center">
            <Icon className="w-6 h-6" name="ic_language" />
            <LangueSelect
              arrowColor="var(--grayscale-100)"
              labClassName="!bgi-text-[var(--grayscale-100)]"
              langueClassName="px-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {renderI18N({ i18nKey: 'leftnav_join_the_community' }, t)}
            </span>
            <div className="flex gap-2">
              {serviceList.map((item, index) => (
                <button
                  key={index}
                  className="relative group"
                  onClick={item.onActionClick}
                >
                  <Icon
                    className="h-8 w-8 hover:brightness-[1.15] active:brightness-[0.85]"
                    name={`fab_${item.label.toLocaleLowerCase()}_default`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="font-medium">
            <span className="text-sm">
              {renderI18N({ i18nKey: 'leftnav_support' }, t)}
            </span>
            <br />
            <span className="text-xs">
              {renderI18N({ i18nKey: 'leftnav_get_help' }, t)}
            </span>
          </div>
          <button
            className="flex gap-2 p-2 items-center rounded
                  hover:bgi-[var(--grayscale-20)] active:bgi-[var(--grayscale-00)]"
            onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
          >
            <Icon name={'ic_customer_support'} />
            <span>
              {renderI18N({ i18nKey: 'leftnav_customer_support' }, t)}
            </span>
          </button>
          <button
            className="flex gap-2 p-2 items-center rounded
                  hover:bgi-[var(--grayscale-20)] active:bgi-[var(--grayscale-00)]"
            onClick={handleLogout}
          >
            <Icon name={'ic_balance_record'} color="var(--grayscale-50)" />
            <span className="bgi-text-[var(--grayscale-50)]">
              {renderI18N({ i18nKey: 'leftnav_quit' }, t)}
            </span>
          </button>
        </div>
      </div>
    </Drawer>
  ) : null;
};
