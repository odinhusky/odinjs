import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import Icon from '@mode2/components/Icon';
import LangueSelect from '@components/LangueSelect';
import { useMenuBase } from '@/hooks/components/useMenuBase';
import { Layout } from 'antd';
import cx from '@commonUtils/cx';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import { useMemo } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { useMode2InviteTabStore } from '@libs/mode2/zustand/page/invitePageStore';
import { useBreakPoint } from '@libs/commonUtils';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import { usePlatformInfoStore } from '@libs/mode2/zustand/platform/platformInfoStore';
import { usePlatformNotifyStore } from '@libs/mode2/zustand/platform/platformNotifyStore';
import useMenuAction from '@libs/mode2/action/components/menu/menuAction';
import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';
import {
  handleMenuAnnouncementsActionClick,
  handleMenuPlatformItemActionClick,
} from '@libs/mode2/action/components/menu/actionType';

const { Sider } = Layout;

export const SideMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );
  const { handleMenuRouter, handleLogout } = useMenuBase();
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );
  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );

  const groups = useMemo(() => {
    return [
      {
        label: 'wallet_nav_deposit',
        param: '',
        icon: 'ic_wallet',
        iconColor: '',
        action: () => {
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          handleMenuRouter(BasePagePathObj.WalletPage);
        },
      },
      {
        label: 'wallet_nav_withdraw',
        param: '',
        icon: 'ic_withdraw',
        iconColor: '',
        action: () => {
          setCurSwitchContentTabId(WalletPageTabType.WITHDRAW);
          handleMenuRouter(BasePagePathObj.WalletPage);
        },
      },
      {
        label: 'leftnav_invite_earn',
        param: '10000',
        icon: 'ic_earn_money',
        iconColor: 'var(--base-1-main)',
        action: () => {
          setInviteCurTab(InvitePageTabType.EARN);
          handleMenuRouter(BasePagePathObj.InvitePage);
        },
      },
      {
        label: 'leftnav_recharge_bonus',
        param: '5',
        icon: 'ic_deposit',
        iconColor: 'var(--base-1-main)',
        action: () => {
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          handleMenuRouter(BasePagePathObj.WalletPage);
        },
      },
      {
        label: 'leftnav_bonus_monthly',
        param: '99999',
        icon: 'ic_vip',
        iconColor: 'var(--base-1-main)',
        action: () => {
          setActivityPageIdx(ActivityPageTabType.VIP);
          handleMenuRouter(BasePagePathObj.ActivityPage, {
            state: { tab: ActivityPageTabType.VIP },
          });
        },
      },
      {
        label: 'leftnav_loss_in_cash_back',
        param: '2',
        icon: 'ic_activity',
        iconColor: '',
        action: () => {
          setActivityPageIdx(ActivityPageTabType.ACTIVITY);
          handleMenuRouter(BasePagePathObj.ActivityPage, {
            state: { tab: ActivityPageTabType.ACTIVITY },
          });
        },
      },
      {
        label: 'leftnav_activity',
        param: '',
        icon: 'ic_activity',
        iconColor: '',
        action: () => {
          setActivityPageIdx(ActivityPageTabType.ACTIVITY);
          handleMenuRouter(BasePagePathObj.ActivityPage, {
            state: { tab: ActivityPageTabType.ACTIVITY },
          });
        },
      },
      {
        label: 'leftnav_balance_record',
        param: '',
        icon: 'ic_balance_record',
        iconColor: '',
        action: () => {
          handleMenuRouter(BasePagePathObj.RecordPage, {
            state: { tab: RecordPageTabs.RECORD },
          });
        },
      },
      {
        label: 'leftnav_balance_report',
        param: '',
        icon: 'ic_balance_report',
        iconColor: '',
        action: () => {
          handleMenuRouter(BasePagePathObj.RecordPage, {
            state: { tab: RecordPageTabs.REPORT },
          });
        },
      },
    ];
  }, []);
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

  const isNotInGamePage =
    location.pathname !== BasePagePathObj.GamePage &&
    location.pathname !== BasePagePathObj.GameLobbyPage;
  const { isDesktop } = useBreakPoint();
  return (
    isNotInGamePage &&
    isDesktop && (
      <Sider width={320}>
        <div
          className={cx(
            'side-menu',
            'w-[320px] h-full',
            'bgi-[var(--bg-sidebar)]',
            'overflow-y-auto',
            'box-border',
            'text-base leading-6',
            'flex flex-col justify-between shrink-0',
            'p-4',
            'fixed top-0 z-30',
            'overflow-y-scroll',
            'bgi-text-[var(--grayscale-100)]'
          )}
          style={{
            paddingTop: `${headerElMetrics.height + 16}px`,
          }}
        >
          <div className="flex flex-col gap-2">
            {/* 展示側邊欄，遊戲廠商平台項目 */}
            {sidebarPlatformItems ? (
              <div className="grid grid-cols-2 gap-2">
                {sidebarPlatformItems.map((item, index) => {
                  return (
                    <div
                      key={index + item.type}
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
                <img
                  className="rounded-lg"
                  src={sidebarAnnouncementBannerUrl}
                  alt="banner"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              {groups?.map((item, index) => (
                <button
                  key={item.label + '_' + index}
                  className="flex gap-2 rounded p-2 items-center"
                  onClick={item.action}
                >
                  <Icon
                    className="h-6 w-6"
                    name={item.icon}
                    color={item.iconColor ? item.iconColor : ''}
                  />
                  <span className="text-base text-left font-medium">
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
              <div className="flex gap-2 p-2 items-center">
                <Icon className="w-6 h-6" name="ic_language" />
                <LangueSelect
                  arrowColor="var(--grayscale-100)"
                  labClassName="!bgi-text-[var(--grayscale-100)]"
                  langueClassName="px-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium">
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
                      className="w-8 h-8 hover:brightness-[1.15] active:brightness-[0.85]"
                      name={`fab_${item.label.toLocaleLowerCase()}_default`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="font-medium">
              <span className="text-base">
                {renderI18N({ i18nKey: 'leftnav_support' }, t)}
              </span>
              <br />
              <span className="text-sm">
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
      </Sider>
    )
  );
};
