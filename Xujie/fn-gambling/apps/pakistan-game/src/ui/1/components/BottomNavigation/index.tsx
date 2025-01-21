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
import Icon from '@libs/mode2/components/Icon';
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

    const isEarnTab = (str: string) => {
      return str === 'leftnav_earn';
    };

    return (
      <div
        ref={ref}
        className={cx(
          'w-full',
          'fixed bottom-0',
          FLEX_ITEMS_CENTER,
          'justify-between rounded-t-[20px] mobile:rounded-t-[24px] ',
          'bgi-[var(--bg-home-tab-bar)]',
          'bg-shadow-[var(--navigation-shadow-up)]',
          {
            'z-[50] h-[60px] mobile:h-16': isDisplayBottomNavigation,
            'z-[-1] h-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'h-full',
                  'flex flex-col items-center justify-end',
                  'flex-1',
                  'text-xs mobile:text-sm',
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
                {item.isDrop ? null : (
                  <Icon
                    name={item.icon}
                    className={cx('w-6 h-6')}
                    color={
                      item.isActive ? 'var(--linear-1)' : 'var(--grayscale-50)'
                    }
                  />
                )}
                {item.isDrop && (
                  <div
                    className={cx(
                      'relative w-[72px] h-[72px] bottom-1.5',
                      FLEX_CENTER
                    )}
                  >
                    <img
                      src={getImgUrl(EResourceLevel.V, 'tab_menu_drop')}
                      className={cx('w-[52px] h-[52px]', 'absolute z-[1]')}
                    />
                    <Icon
                      name={item.icon}
                      className={cx('w-7 h-7 absolute z-[2]')}
                      color="var(--grayscale-00)"
                    />
                  </div>
                )}
                <div
                  className={cx(
                    'relative z-10 mt-2 mb-1 mobile:mt-1 mobile:mb-2',
                    {
                      'bgi-text-[var(--grayscale-50)]': !item.isActive,
                      'bgi-text-[var(--linear-1)]': item.isActive,
                    }
                  )}
                >
                  {renderI18N(item.labelKey, t)}
                </div>
                {item.isShowRedDot ? (
                  <RedDot
                    type={'img'}
                    size={'10'}
                    className={cx(
                      'absolute animate-none z-[2] translate-x-4 -translate-y-11',
                      {
                        'translate-x-4 -translate-y-16': isEarnTab(
                          item.labelKey.i18nKey
                        ),
                      }
                    )}
                  />
                ) : null}

                {item.isActive ? (
                  <div className="absolute top-0 h-[2px] w-9 mobile:w-14 bgi-[var(--linear-1)]"></div>
                ) : null}
              </div>
            ))
          : null}
      </div>
    );
  })
);

export default BottomNavigation;
