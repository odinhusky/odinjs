import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import {
  BottomNavigationScenarios,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import { useTranslation } from 'react-i18next';
import RedDot from '@components/RedDot';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
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
          'w-full fixed',
          FLEX_ITEMS_CENTER,
          'justify-between',
          'bgi-[var(--bg-home-tab-bar)]',
          {
            'z-[50] h-[60px] mobile:h-16 -bottom-px': isDisplayBottomNavigation,
            'z-[-1] h-0 -bottom-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'h-full',
                  'flex items-center justify-end',
                  'flex-col',
                  'flex-1 ',
                  'text-xs',
                  'relative',
                  'cursor-pointer'
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
                {item.isDrop ? (
                  <img
                    src={getImgUrl(EResourceLevel.V, 'tab_menu_drop')}
                    className={cx('w-auto h-[60px]', 'absolute z-[1] bottom-7')}
                  />
                ) : (
                  <Icon
                    className={'w-6 h-6 relative z-10'}
                    level={EResourceLevel.V}
                    color={
                      item.isActive
                        ? 'var(--base-1-main)'
                        : 'var(--grayscale-60)'
                    }
                    name={item.icon}
                  />
                )}
                <div
                  className={cx(
                    'relative z-10',
                    'mt-2 mb-[6px] text-xs mobile:text-sm font-medium',
                    item.isActive
                      ? 'bgi-text-[var(--base-1-main)]'
                      : 'bgi-text-[var(--grayscale-60)]'
                  )}
                >
                  {renderI18N(item.labelKey, t)}
                </div>
                {item.isShowRedDot ? (
                  <RedDot
                    type="css"
                    size="10"
                    className={cx(
                      'absolute animate-none z-[2] translate-x-5 top-1',
                      {
                        'translate-x-5 -translate-y-5':
                          item.labelKey.i18nKey === 'leftnav_earn',
                      }
                    )}
                  />
                ) : null}
              </div>
            ))
          : null}
      </div>
    );
  })
);

export default BottomNavigation;
