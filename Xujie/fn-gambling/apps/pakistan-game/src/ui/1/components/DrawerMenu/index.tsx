import { EResourceLevel, formatMoney } from '@mode2/utils';
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
import { QuitButton } from '@components/QuitButton';
import { FLEX_COL } from '@libs/constant/style';
import { ENGLISH } from '@/constant';
import BaseInput from '@libs/components/Input';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { RecordPageTabs } from '@libs/mode2/zustand/page/recordPageStore';
import { usePlatformInfoStore } from '@libs/mode2/zustand/platform/platformInfoStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  HallPageIdObj,
  useMode2HallPageTabsStore,
} from '@libs/mode2/zustand/page/hallPageStore';

export const DrawerMenu = () => {
  const { isDesktop, isMobile } = useBreakPoint();
  const [inputValue, setInputValue] = useState('');
  const isShowMenu = useShowMenuStore((state) => state.isShowMenu);
  const closeMenu = useShowMenuStore((state) => state.closeMenu);
  const [animOut, setAnimOut] = useState('');
  const [closeCallback, setCloseCallback] = useState<{
    callback?: () => void;
  } | null>(null);
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
  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  const onClose = (callback?: () => void | null) => {
    setAnimOut('animate__animated animate__slideOutLeft animate__faster');
    setCloseCallback({ callback: callback });
  };

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

  useEffect(() => {
    const animatedBox = document.getElementById('animatedBox');

    const handleAnimationEnd = () => {
      setAnimOut('');
      closeMenu();
      closeCallback && closeCallback.callback && closeCallback.callback();
    };

    if (animatedBox) {
      animatedBox.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      if (animatedBox) {
        animatedBox.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [animOut]);

  return !isDesktop ? (
    <Drawer
      id="animatedBox"
      className={cx(
        '!bgi-[var(--bg-sidebar)] w-full shadow-[4px_0px_8px_0px_#00000040]',
        animOut
      )}
      open={isShowMenu}
      onClose={() => {
        onClose();
      }}
      placement="left"
      styles={{
        wrapper: {
          width: isMobile ? '304px' : '360px',
          boxShadow: 'none',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      afterOpenChange={() => {}}
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
          'p-5',
          'top-0',
          '!pt-9 relative'
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="flex w-full justify-end">
            <Icon
              className="w-6 h-6 cursor-pointer"
              name="ic_close"
              color="var(--grayscale-100)"
              onClick={() => {
                onClose();
              }}
            />
          </div>
          {/*  TODO 搜索 */}
          <div
            className="flex gap-2 bgi-[var(--grayscale-10)] py-[10px] px-2 
                border border-[var(--grayscale-00)] rounded-lg items-center"
          >
            <Icon className="w-6 h-6" name={'ic_check_order'} color='var(--grayscale-50)' />
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
                key={item.label+"_"+index}
                className={cx(
                  'relative grid grid-cols-3 justify-center items-center cursor-pointer'
                )}
                onClick={() => {
                  onClose(item.action);
                }}
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
          {/* 选项 */}
          <div className="bgi-[var(--grayscale-10)] border border-[var(--grayscale-15)] rounded-xl overflow-hidden">
            {groups?.map((item) => (
              <div
                className={cx(
                  'flex gap-2 items-center justify-between cursor-pointer',
                  'bgi-[var(--grayscale-10)] py-2 px-3',
                  'text-sm mobile:text-base'
                )}
                key={item.label}
                onClick={() => {
                  onClose(item.action);
                }}
              >
                <Icon name={item.icon} color="var(--grayscale-60)" />
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
                onClick={() => {
                  onClose(item.action);
                }}
              >
                <Icon name={item.icon} color="var(--grayscale-60)" />
                <span className="w-full bgi-text-[var(--grayscale-60)]">
                  {t(item.label)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cx(
            'menu-bottom-group',
            'mt-9',
            FLEX_COL,
            'gap-2',
            'border-t border-[var(--grayscale-30)]'
          )}
        >
          {/* TODO i18n */}
          <p className="mt-3">Join the community</p>
          <div className="flex gap-2">
            {serviceList.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:brightness-110"
                onClick={() => {
                  onClose(item.onActionClick);
                }}
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
            onClick={() => {
              onClose(() => handleMenuRouter(BasePagePathObj.FeedBackPage));
            }}
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
            <QuitButton onClick={() => onClose(handleLogout)} />
          </div>
        </div>
      </div>
    </Drawer>
  ) : null;
};
