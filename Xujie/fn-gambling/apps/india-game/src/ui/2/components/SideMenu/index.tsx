import { EResourceLevel } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import Icon from '@components/Icon';
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
import { useBreakPoint } from '@libs/commonUtils';
import { QuitButton } from '@components/QuitButton';
import RedDot from '@components/RedDot';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  MenuScenarios,
  useMenuListStore,
} from '@libs/mode2/zustand/components/menuListStore';

const { Sider } = Layout;

export const SideMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );
  const { handleMenuRouter, handleLogout } = useMenuBase();

  const menuUsageScenariosList = useMenuListStore(
    (state) => state.menuUsageScenariosList
  );
  const groups =
    menuUsageScenariosList.find((item) => {
      return item.scenarios === MenuScenarios.DEFAULT_SIDE_MENU;
    })?.menuList || [];

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
                    {item.isShowRedDot === true ? (
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
                          onClick={(e) => {
                            e.stopPropagation();
                            child.action && child.action();
                          }}
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
                <div
                  className={cx(
                    'menu-no-child-item',
                    'flex gap-2',
                    'rounded-lg',
                    'bgi-[var(--grayscale-10)]'
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
                  <div className="w-6 h-6 rounded-full bgi-[var(--base-2-main)]">
                    <Icon
                      className="w-full"
                      level={EResourceLevel.SHARED}
                      color="var(--grayscale-10)"
                      name={item.icon}
                    />
                  </div>
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
              <LangueSelect />
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
