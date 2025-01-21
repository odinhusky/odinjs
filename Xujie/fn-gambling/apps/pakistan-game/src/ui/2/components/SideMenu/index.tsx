import { EResourceLevel } from '@mode2/utils';
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
import { KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { QuitButton } from '@components/QuitButton';
import RedDot from '@components/RedDot';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { usePlatformDynamicConfigStore } from '@libs/mode2/zustand/platform/platformDynamicConfig';
import { ENGLISH } from '@/constant';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { today } from '@libs/constant/date';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';

const { Sider } = Layout;

interface SubMenuItem {
  label: string;
  action: () => void;
  isShowRedDot?: boolean;
  isHide?: boolean;
}

interface MenuGroup {
  label: string;
  icon: string;
  action?: () => void;
  children?: SubMenuItem[];
  isShowRedDot?: boolean;
  isHide?: boolean;
}

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
  const isEnableRankingReward = usePlatformDynamicConfigStore(
    (state) => state.isEnableRankingReward
  );

  const inviteTimeRedDot = useRedDotStore((state) => state.inviteTimeRedDot);
  const setInviteTimeRedDot = useRedDotStore(
    (state) => state.setInviteTimeRedDot
  );

  const groups: MenuGroup[] = [
    {
      label: 'leftnav_home',
      icon: 'ic_home',
      action: () => handleMenuRouter(BasePagePathObj.HallPage),
    },
    {
      label: 'leftnav_wallet',
      icon: 'ic_wallet',
      action: () => {
        handleMenuRouter(BasePagePathObj.WalletPage);
      },
      children: [
        {
          label: 'wallet_nav_deposit',
          action: () => {
            setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
            handleMenuRouter(BasePagePathObj.WalletPage);
          },
        },
        {
          label: 'wallet_nav_withdraw',
          action: () => {
            setCurSwitchContentTabId(WalletPageTabType.WITHDRAW);
            handleMenuRouter(BasePagePathObj.WalletPage);
          },
        },
      ],
    },
    {
      label: 'leftnav_earn_money',
      icon: 'ic_earn_money',
      isShowRedDot: inviteTimeRedDot,
      action: () => {
        handleMenuRouter(BasePagePathObj.InvitePage);
      },
      children: [
        {
          label: 'leftnav_earn',
          action: () => {
            userLocalForage.setItem(
              UserLocalforageStoreKeys.INVITE_TIME,
              today
            );
            setInviteTimeRedDot(false);

            setInviteCurTab(InvitePageTabType.EARN);
            handleMenuRouter(BasePagePathObj.InvitePage);
          },
        },
        {
          label: 'leftnav_statistics',
          action: () => {
            setInviteCurTab(InvitePageTabType.STATISTICS);
            handleMenuRouter(BasePagePathObj.InvitePage);
          },
        },
        {
          label: 'leftnav_team_data',
          action: () => {
            setInviteCurTab(InvitePageTabType.TEAM_DATA);
            handleMenuRouter(BasePagePathObj.InvitePage);
          },
        },
        {
          label: 'leftnav_ranking_list',
          action: () => {
            setInviteCurTab(InvitePageTabType.RANKING_LIST);
            handleMenuRouter(BasePagePathObj.InvitePage);
          },
          isHide: !isEnableRankingReward,
        },
      ],
    },
    {
      label: 'leftnav_activity',
      icon: 'ic_activity',
      action: () => {
        handleMenuRouter(BasePagePathObj.ActivityPage, {
          state: { tab: ActivityPageTabType.ACTIVITY },
        });
      },
      children: [
        {
          label: 'leftnav_activity',
          action: () => {
            setActivityPageIdx(ActivityPageTabType.ACTIVITY);
            handleMenuRouter(BasePagePathObj.ActivityPage, {
              state: { tab: ActivityPageTabType.ACTIVITY },
            });
          },
        },
        {
          label: 'leftnav_vip',
          action: () => {
            setActivityPageIdx(ActivityPageTabType.VIP);
            handleMenuRouter(BasePagePathObj.ActivityPage, {
              state: { tab: ActivityPageTabType.VIP },
            });
          },
        },
      ],
    },
    {
      label: 'leftnav_account',
      icon: 'ic_user',
      children: [
        {
          label: 'leftnav_personal_information',
          action: () =>
            handleMenuRouter(BasePagePathObj.BindKYCPage, {
              state: { tab: KYC_PERSONAL_STATE },
            }),
        },
        {
          label: 'leftnav_balance_record',
          action: () => {
            handleMenuRouter(BasePagePathObj.RecordPage, {
              state: { tab: RecordPageTabs.RECORD },
            });
          },
        },
        {
          label: 'leftnav_balance_report',
          action: () => {
            handleMenuRouter(BasePagePathObj.RecordPage, {
              state: { tab: RecordPageTabs.REPORT },
            });
          },
        },
      ],
    },
  ];

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

  const isNotInGamePage =
    location.pathname !== BasePagePathObj.GamePage &&
    location.pathname !== BasePagePathObj.GameLobbyPage;
  const { isDesktop } = useBreakPoint();

  return (
    isNotInGamePage &&
    isDesktop && (
      <Sider width={288}>
        <div
          className={cx(
            'side-menu',
            'w-[288px] h-full',
            'bgi-[var(--bg-sidebar)]',
            'overflow-y-auto',
            'box-border',
            'text-base leading-6',
            'flex flex-col justify-between shrink-0',
            'p-4',
            'fixed top-0 z-30',
            'overflow-y-scroll'
          )}
          style={{
            paddingTop: `${headerElMetrics.height + 16}px`,
          }}
        >
          {groups?.map((item) => (
            <div
              className={cx(
                'menu-item-group',
                FLEX_COL,
                'gap-2',
                'mb-2',
                'px-3 py-2',
                'rounded-lg',
                'bgi-[var(--grayscale-10)]',
                { 'cursor-pointer': item.action !== undefined }
              )}
              key={item.label}
              onClick={item.action}
            >
              {item.children ? (
                <>
                  <div
                    className={cx(
                      'menu-item-group-title',
                      'relative',
                      FLEX_ITEMS_CENTER,
                      'gap-2',
                      'px-3 py-2',
                      'border-b border-solid',
                      'border-b-[var(--transparent-white-10)]'
                    )}
                  >
                    <Icon
                      className="w-6 h-6 p-0.5"
                      name={item.icon}
                      color="var(--base-2-main)"
                    />
                    <span className="bgi-text-[var(--base-2-main)] font-medium">
                      {t(item.label)}
                    </span>
                    {item.isShowRedDot ? (
                      <RedDot
                        size="8"
                        className={
                          'absolute hidden tablet:block top-1 right-1 w-2 h-2'
                        }
                      />
                    ) : null}
                  </div>
                  {item.children?.map((child) =>
                    !child.isHide ? (
                      <div
                        className={cx('menu-item-group-list', 'relative')}
                        key={child.label}
                      >
                        <div
                          className={cx(
                            'menu-item',
                            FLEX_ITEMS_CENTER,
                            'justify-between',
                            'cursor-pointer',
                            'px-3 py-2'
                          )}
                          onClick={child.action}
                        >
                          <span className="bgi-text-[var(--base-2-main)]">
                            {t(child.label)}
                          </span>

                          <Icon
                            className="w-4 h-4"
                            name="ic_arrow_right_1"
                            color="var(--base-2-main)"
                          />
                        </div>
                        {child.isShowRedDot ? (
                          <RedDot
                            size="8"
                            className={cx(
                              'absolute top-1 right-2',
                              'mobile:top-2 mobile:right-4',
                              'hidden tablet:block w-2 h-2'
                            )}
                          />
                        ) : null}
                      </div>
                    ) : null
                  )}
                </>
              ) : (
                <div
                  className={cx(
                    'menu-no-child-item',
                    'flex gap-2',
                    'rounded-lg'
                  )}
                >
                  <Icon
                    className="w-6 h-6"
                    name={item.icon}
                    color="var(--base-2-main)"
                  />

                  <span className={cx('bgi-text-[var(--base-2-main)]')}>
                    {t(item.label)}
                  </span>
                </div>
              )}
            </div>
          ))}

          <div className={cx(FLEX_COL, 'gap-2 mt-9')}>
            {serviceList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  FLEX_ITEMS_CENTER,
                  'justify-between gap-2',
                  'cursor-pointer',
                  'px-3 py-2',
                  'bgi-text-[var(--base-2-main)]'
                )}
                onClick={item.onActionClick}
              >
                <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
                  <Icon
                    className="w-6 h-6 p-0.5 rounded-full bgi-[var(--base-2-main)]"
                    level={EResourceLevel.SHARED}
                    color="var(--grayscale-10)"
                    name={item.icon}
                  />
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
            <div className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'px-3')}>
              <Icon
                className="w-6 h-6"
                color="var(--base-2-main)"
                name="ic_language"
              />
              <LangueSelect defaultLangue={ENGLISH} />
            </div>
            <div
              className={cx(
                FLEX_ITEMS_CENTER,
                'gap-2 my-2',
                'bgi-text-[var(--base-2-main)]'
              )}
              onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
            >
              <div className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'px-3')}>
                <Icon
                  className="w-6 h-6"
                  color="var(--base-2-main)"
                  name={'ic_customer_support'}
                />
                <span>{t('leftnav_customer_support')}</span>
              </div>
            </div>
            <QuitButton onClick={handleLogout} />
          </div>
        </div>
      </Sider>
    )
  );
};
