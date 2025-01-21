import { EResourceLevel, formatMoney } from '@mode2/utils';
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
import { useMemo, useState } from 'react';
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
import dayjs from 'dayjs';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { usePlatformDynamicConfigStore } from '@libs/mode2/zustand/platform/platformDynamicConfig';
import { ENGLISH } from '@/constant';
import renderI18N from '@libs/commonUtils/renderI18N';
import BaseInput from '@libs/mode2/components/Input';
import {
  HallPageIdObj,
  useMode2HallPageTabsStore,
} from '@libs/mode2/zustand/page/hallPageStore';

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
  const [inputValue, setInputValue] = useState('');
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );
  const { handleMenuRouter, handleLogout } = useMenuBase();
  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );
  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );
  const isEnableRankingReward = usePlatformDynamicConfigStore(
    (state) => state.isEnableRankingReward
  );

  const gameConfig = [
    {
      label: 'home_game_zone_lobby',
      color: '--linear-8-main',
      icon: 'ic_lobby',
      action: () => {
        setCurTab(HallPageIdObj.LOBBY);
        handleMenuRouter(BasePagePathObj.HallPage, {
          state: { tab: HallPageIdObj.LOBBY },
        });
      },
    },
    {
      label: 'home_game_zone_hot',
      color: '--state-warn-main',
      icon: 'ic_popular',
      action: () => {
        setCurTab(HallPageIdObj.HOT);
        handleMenuRouter(BasePagePathObj.HallPage, {
          state: { tab: HallPageIdObj.HOT },
        });
      },
    },
  ];
  // TODO i18n
  const groups = [
    {
      label: 'earn_money_earn_header_invite_earn',
      param: { amount: formatMoney(10000) },
      icon: 'ic_earn_money',
      action: () => handleMenuRouter(BasePagePathObj.InvitePage),
    },
    {
      label: 'Up to {{₹99,999}} bonus monthly',
      param: { cashBackRate: formatMoney(99999) },
      icon: 'ic_vip',
      action: () => {
        handleMenuRouter(BasePagePathObj.ActivityPage, {
          state: { tab: ActivityPageTabType.VIP },
        });
      },
    },
    {
      label: 'leftnav_activity',
      param: {},
      icon: 'ic_activity',
      action: () => {
        handleMenuRouter(BasePagePathObj.ActivityPage);
      },
    },
  ];
  // TODO i18n
  const groups2 = [
    {
      label: 'wallet_nav_deposit',
      icon: 'ic_deposit',
      action: () => handleMenuRouter(BasePagePathObj.WalletPage),
    },
    {
      label: 'wallet_nav_withdraw',
      icon: 'ic_withdraw',
      action: () =>
        handleMenuRouter(BasePagePathObj.WalletPage, {
          state: { tab: WalletPageTabType.WITHDRAW },
        }),
    },
    {
      label: 'leftnav_balance_record',
      icon: 'ic_balance_record',
      action: () =>
        handleMenuRouter(BasePagePathObj.RecordPage, {
          state: { tab: RecordPageTabs.RECORD },
        }),
    },
    {
      label: 'leftnav_balance_report',
      icon: 'ic_balance_report',
      action: () =>
        handleMenuRouter(BasePagePathObj.RecordPage, {
          state: { tab: RecordPageTabs.REPORT },
        }),
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
            'side-menu w-[288px] max-h-full h-full',
            'bgi-[var(--bg-sidebar)]',
            'overflow-y-auto',
            'box-border',
            'text-base leading-6',
            'flex flex-col gap-4 shrink-0',
            'p-6',
            'fixed top-0 z-30',
            'overflow-y-scroll',
            'justify-between',
            'shadow-[4px_0px_8px_0px_#00000040]'
          )}
          style={{
            paddingTop: `${headerElMetrics.height + 36}px`,
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {/*  TODO 搜索 */}
              <div
                className="flex gap-2 bgi-[var(--grayscale-10)] py-[10px] px-2
                border border-[var(--grayscale-00)] rounded-lg items-center"
              >
                <Icon
                  className="w-6 h-6"
                  name={'ic_check_order'}
                  color="var(--grayscale-50)"
                />
                <BaseInput
                  value={inputValue}
                  onChange={(newVal) => {
                    setInputValue(newVal);
                  }}
                  styles={{
                    container: 'w-full',
                    containerDiv: '!p-0 !bgi-[#00000000]',
                    input: 'placeholder:!bgi-text-[var(--grayscale-50)] !p-0',
                  }}
                  placeholder={{ i18nKey: 'Search for Game' }} //TODO i18n
                />
              </div>
              {/* 游戏类别 */}
              <div className="grid grid-cols-2 gap-2 justify-center items-center">
                {gameConfig.map((item, index) => (
                  <div
                    key={item.label + '-' + index}
                    className={cx(
                      'relative grid grid-cols-3 justify-center items-center cursor-pointer'
                    )}
                    onClick={item.action}
                  >
                    <div
                      className={cx(
                        `bgi-[var(${item.color})]`,
                        'absolute top-1/2 bottom-0 left-0 right-0 -translate-y-1/2 h-[44px] rounded-lg'
                      )}
                    />
                    <div className="shrink-0 z-[1]">
                      <Icon className="w-auto h-auto" name={item.icon} />
                    </div>
                    <div className="col-span-2 mobile:text-base text-sm bgi-text-[var(--grayscale-00)] font-semibold z-[1]">
                      {t(item.label)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-[var(--grayscale-30)]" />
            {/* 选项 */}
            <div className="flex flex-col gap-2">
              {/* 主页按钮 */}
              <div
                className="flex gap-2 bgi-[var(--grayscale-10)]
                  bgi-border-[var(--base-1-main)] after:border-[1.5px]
                  rounded-lg py-2 px-3 items-center cursor-pointer"
                onClick={() => {
                  setCurTab(HallPageIdObj.LOBBY);
                  handleMenuRouter(BasePagePathObj.HallPage, {
                    state: { tab: HallPageIdObj.LOBBY },
                  });
                }}
              >
                <Icon
                  className="w-auto h-7 shrink-0"
                  name={'ic_home'}
                  color="var(--base-1-main)"
                />
                <span>{renderI18N({ i18nKey: 'leftnav_home' }, t)}</span>
              </div>
              <div className="bgi-[var(--grayscale-10)] border border-[var(--grayscale-15)] rounded-xl overflow-hidden">
                {groups?.map((item) => (
                  <div
                    className={cx(
                      'flex gap-2 items-center justify-between cursor-pointer',
                      'bgi-[var(--grayscale-10)] py-2 px-3',
                      'text-sm mobile:text-base'
                    )}
                    key={item.label}
                    onClick={item.action}
                  >
                    <Icon
                      className="shrink-0 w-auto h-7"
                      name={item.icon}
                      color="var(--grayscale-40)"
                    />
                    <span className="w-full bgi-text-[var(--grayscale-60)]">
                      {renderI18N(
                        { i18nKey: item.label, i18nOption: item.param },
                        t
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bgi-[var(--grayscale-10)] border border-[var(--grayscale-15)] rounded-xl overflow-hidden">
                {groups2?.map((item) => (
                  <div
                    className={cx(
                      'flex gap-2 items-center justify-between cursor-pointer',
                      'bgi-[var(--grayscale-10)] py-2 px-3',
                      'text-sm mobile:text-base'
                    )}
                    key={item.label}
                    onClick={item.action}
                  >
                    <Icon
                      className="shrink-0 w-auto h-7"
                      name={item.icon}
                      color="var(--grayscale-40)"
                    />
                    <span className="w-full bgi-text-[var(--grayscale-60)]">
                      {t(item.label)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <hr className="border-[var(--grayscale-30)]" />
            <div className={cx(FLEX_COL, 'gap-2')}>
              {/* TODO i18n */}
              <p className="text-sm font-normal">Join the community</p>
              <div className="flex gap-2">
                {serviceList.map((item, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:brightness-110"
                    onClick={item.onActionClick}
                  >
                    <Icon
                      className="w-9 h-9"
                      level={EResourceLevel.V}
                      name={`fab_${item.label.toLocaleLowerCase()}_default`}
                    />
                  </div>
                ))}
              </div>
              {/* 邮箱 */}
              <div
                className="flex items-center justify-between gap-2 py-2 cursor-pointer bgi-text-[var(--grayscale-60)]"
                onClick={() => handleMenuRouter(BasePagePathObj.FeedBackPage)}
              >
                <div className="flex gap-2">
                  <Icon
                    className="w-6 h-6"
                    color="var(--grayscale-60)"
                    name={'ic_customer_support'}
                  />
                  <span>{t('leftnav_customer_support')}</span>
                </div>
              </div>
              {/* 语言  退出 */}
              <div className="flex gap-2">
                <LangueSelect
                  arrowColor="var(--grayscale-60)"
                  defaultLangue={ENGLISH}
                  className={cx(
                    'bgi-[var(--grayscale-10)] rounded-lg border border-[var(--grayscale-15)]'
                  )}
                  labClassName="!bgi-text-[var(--grayscale-60)]"
                />
                <QuitButton onClick={handleLogout} />
              </div>
            </div>
          </div>
        </div>
      </Sider>
    )
  );
};
