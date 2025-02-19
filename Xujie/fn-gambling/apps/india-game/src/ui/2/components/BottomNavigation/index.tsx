import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import {
  BottomNavigationScenarios,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import { useTranslation } from 'react-i18next';
import RedDot from '@components/RedDot';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { forwardRef, memo, Ref } from 'react';
import Icon from '@components/Icon';
import useBottomNavigationActions from '@mode2/action/components/bottomNavigation/useBottomNavigationAction';
import { handleBottomNavigationButtonClick } from '@mode2/action/components/bottomNavigation/acitonType';

const BottomNavigation = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation();
    const { handleBottomNavigationClick } = useBottomNavigationActions();
    const isDisplayBottomNavigation = useBottomNavigationStore(
      (state) => state.isDisplayBottomNavigation
    );

    const usageScenariosList = useBottomNavigationStore(
      (state) => state.usageScenariosList
    );
    const bottomNavigationList =
      usageScenariosList.find((item) => {
        return item.scenarios === BottomNavigationScenarios.DEFAULT;
      })?.bottomNavigationList || [];

    return (
      <div
        ref={ref}
        className={cx(
          'tabbar w-full fixed',
          FLEX_ITEMS_CENTER,
          'justify-between',
          'bgi-[var(--bg-home-tab-bar)]',
          {
            'z-[50] h-[60px] -bottom-px': isDisplayBottomNavigation,
            'z-[-1] h-0 -bottom-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'tabbar-item',
                  'h-full',
                  FLEX_CENTER,
                  'flex-col',
                  'flex-1 ',
                  'text-xs',
                  'relative',
                  'cursor-pointer',
                  {
                    'bgi-[var(--linear-1)]': item.isActive && !item.isDrop,
                  }
                )}
                onClick={() => {
                  handleBottomNavigationClick({
                    actionName: handleBottomNavigationButtonClick,
                    payload: {
                      ...item.actionPayload,
                    },
                  });
                }}
              >
                <Icon
                  className={cx('icon-menu', 'relative z-10', {
                    'w-6 h-6': !item.isDrop,
                    '!w-[30px] !h-[30px]': item.isDrop,
                  })}
                  level={EResourceLevel.V}
                  color={'var(--base-2-main)'}
                  name={item.icon}
                />

                {item.isDrop && (
                  <img
                    src={getImgUrl(
                      EResourceLevel.V,
                      item.isActive
                        ? 'tab_menu_drop_active'
                        : 'tab_menu_drop_default'
                    )}
                    className={cx('w-auto h-[72px]', 'absolute z-[1] bottom-0')}
                  />
                )}
                <div
                  className={cx(
                    'tabbar-text',
                    'relative z-10',
                    'bgi-text-[var(--base-2-main)]'
                  )}
                >
                  {renderI18N(item.labelKey, t)}
                </div>
                {item.isShowRedDot ? (
                  <RedDot
                    size="10"
                    className={cx(
                      'absolute animate-none z-[2] translate-x-4 -translate-y-5',
                      {
                        'translate-x-4 -translate-y-6 ':
                          item.labelKey.i18nKey === 'leftnav_earn',
                      }
                    )}
                  />
                ) : null}

                {/* gradient-line 來自 vGlobal 的 scss */}
                {item.isActive ? (
                  <div className="gradient-line z-10"></div>
                ) : null}
              </div>
            ))
          : null}
      </div>
    );
  })
);

export default BottomNavigation;
