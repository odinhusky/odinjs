import { EResourceLevel, getImgUrl } from '@mode2/utils';
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
import { useEffect, useMemo } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useBreakPoint } from '@libs/commonUtils';
import { KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { QuitButton } from '@components/QuitButton';
import RedDot from '@components/RedDot';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { TeamClubPageTabType } from '@libs/mode2/@types/teamClubPageTabType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';
import { today } from '@libs/constant/date';

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
  // const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
  //   (state) => state.setCurSwitchContentTabId
  // );
  // const setInviteCurTab = useMode2InviteTabStore(
  //   (state) => state.setInviteCurTab
  // );
  // const isEnableRankingReward = usePlatformDynamicConfigStore(
  //   (state) => state.isEnableRankingReward
  // );

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
            handleMenuRouter(BasePagePathObj.WalletPage, {
              state: { tab: WalletPageTabType.DEPOSIT },
            });
          },
        },
        {
          label: 'wallet_nav_withdraw',
          action: () => {
            handleMenuRouter(BasePagePathObj.WalletPage, {
              state: { tab: WalletPageTabType.WITHDRAW },
            });
          },
        },
      ],
    },
    {
      label: 'leftnav_earn',
      icon: 'ic_earn_money',
      isShowRedDot: inviteTimeRedDot,
      action: () => {
        handleMenuRouter(BasePagePathObj.TeamClubPage, {
          state: { tab: TeamClubPageTabType.MY_REWARDS },
        });
      },
      children: [
        {
          label: 'earn_tab_1',
          action: () => {
            userLocalForage.setItem(
              UserLocalforageStoreKeys.INVITE_TIME,
              today
            );
            setInviteTimeRedDot(false);
            handleMenuRouter(BasePagePathObj.TeamClubPage, {
              state: { tab: TeamClubPageTabType.SHARE_FOR_BONUS },
            });
          },
        },
        {
          label: 'earn_tab_2',
          action: () => {
            handleMenuRouter(BasePagePathObj.TeamClubPage, {
              state: { tab: TeamClubPageTabType.MY_REWARDS },
            });
          },
        },
        {
          label: 'earn_tab_3',
          action: () => {
            handleMenuRouter(BasePagePathObj.TeamClubPage, {
              state: { tab: TeamClubPageTabType.INVITE_REWARDS },
            });
          },
        },
        {
          label: 'earn_tab_4',
          action: () => {
            handleMenuRouter(BasePagePathObj.TeamClubPage, {
              state: { tab: TeamClubPageTabType.RULES },
            });
          },
          // isHide: !isEnableRankingReward,
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
            handleMenuRouter(BasePagePathObj.ActivityPage, {
              state: { tab: ActivityPageTabType.ACTIVITY },
            });
          },
        },
        {
          label: 'leftnav_vip',
          action: () => {
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

  useEffect(() => {
    userLocalForage
      .getItem(UserLocalforageStoreKeys.INVITE_TIME)
      .then((inviteTime) => {
        setInviteTimeRedDot(inviteTime !== today);
      });
  }, [inviteTimeRedDot]);

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
  // const setActivityPageIdx = useMode2ActivitySwitchPageStore(
  //   (state) => state.setPageIdx
  // );

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
            'flex flex-col gap-4 justify-between shrink-0',
            'p-4',
            'fixed top-0 z-30',
            'overflow-y-scroll',
            'shadow-[4px_0px_8px_0px_#00000040]'
          )}
          style={{
            paddingTop: `${headerElMetrics.height + 16}px`,
          }}
        >
          <div className="flex flex-col gap-3 text-lg font-medium bgi-[var(--transparent-gray-40)] py-4 px-3 rounded-lg">
            {groups?.map((item) => (
              <div
                className={cx('menu-item-group', FLEX_COL, 'gap-2', {
                  'cursor-pointer': item.action !== undefined,
                })}
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
                        'px-4 py-2'
                      )}
                    >
                      <Icon
                        className="w-6 h-6 p-0.5"
                        name={item.icon}
                        color="var(--base-1-main)"
                      />
                      <span className="bgi-text-[var(--base-1-main)] font-medium">
                        {t(item.label)}
                      </span>
                      {item.isShowRedDot === true ? (
                        <RedDot
                          type="img"
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
                              'px-3 py-2',
                              'border-b-[0.5px] border-solid',
                              'border-b-[var(--transparent-white-20)]'
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              child.action && child.action();
                            }}
                          >
                            <span className="bgi-text-[var(--base-1-main)]">
                              {t(child.label)}
                            </span>

                            <Icon
                              className="w-5 h-5"
                              name="ic_arrow_right_1"
                              color="var(--base-1-main)"
                            />
                          </div>
                          {child.isShowRedDot === true ? (
                            <RedDot
                              size="8"
                              className={cx(
                                'absolute top-1 right-2',
                                'mobile:top-2 mobile:right-4',
                                'hidden tablet:block'
                              )}
                            />
                          ) : null}
                        </div>
                      ) : null
                    )}
                  </>
                ) : (
                  <div>
                    <div
                      className={cx(
                        'menu-no-child-item',
                        'flex gap-2 py-2 px-4'
                      )}
                    >
                      <Icon
                        className="w-6 h-6"
                        name={item.icon}
                        color="var(--base-1-main)"
                      />

                      <span className={cx('bgi-text-[var(--base-1-main)]')}>
                        {t(item.label)}
                      </span>
                    </div>
                    <div className="w-full h-[0.5px] bgi-[var(--transparent-white-20)] mt-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={cx(FLEX_COL, 'gap-4')}>
            <div className="grid grid-cols-2 gap-3">
              {serviceList.map((item, index) => (
                <div
                  key={index}
                  className={cx(
                    'flex flex-col gap-2 items-center rounded-lg',
                    'bgi-[var(--transparent-gray-20)] py-4',
                    'cursor-pointer'
                  )}
                  onClick={item.onActionClick}
                >
                  <img
                    className="w-9 h-9"
                    src={getImgUrl(
                      EResourceLevel.V,
                      `fab_${item.label.toLocaleLowerCase()}_default`
                    )}
                  />
                  <span className="bgi-text-[var(--grayscale-100)] text-base font-medium drop-shadow-[0px_0px_4px_0px_#00000080]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <div className={cx('flex gap-2 px-3 py-3')}>
                <div className="bgi-[var(--base-3-main)] rounded-full p-1">
                  <Icon
                    className="w-6 h-6"
                    color="var(--grayscale-100)"
                    name="ic_language"
                  />
                </div>
                <LangueSelect
                  arrowColor="var(--grayscale-100)"
                  langueClassName="!p-0 !rounded-lg"
                  labClassName="!bgi-text-[var(--grayscale-100)]"
                />
              </div>
              {/* <div
                className={cx(
                  FLEX_ITEMS_CENTER,
                  'gap-2 my-2',
                  'bgi-text-[var(--base-2-main)]'
                )}
                onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
              >

              </div> */}
              <BasePrimaryBtn
                className="!py-3 !px-4 h-auto leading-6
                    bgi-[var(--base-3-main)] hover:bgi-[var(--base-3-light)] active:bgi-[var(--base-3-dark)]
                    shadow-[0px_4px_4px_0px_#CCCCCC40_inset,0px_-4px_4px_0px_#33333340_inset]"
                children={<span>{t('leftnav_customer_support')}</span>}
                onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
              />
              <QuitButton
                className="!bgi-[var(--grayscale-10)] rounded p-3 justify-center items-center"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </Sider>
    )
  );
};
