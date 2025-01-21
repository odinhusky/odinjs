import { EResourceLevel } from '@mode2/utils';
import cx from '@commonUtils/cx';
import {
  BottomNavigationScenarios,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import Icon from '@libs/mode2/components/Icon';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';
import RedDot from '@components/RedDot';
import { forwardRef, memo, Ref } from 'react';
import { handleBottomNavigationButtonClick } from '@mode2/action/components/bottomNavigation/acitonType';
import useBottomNavigationActions from '@mode2/action/components/bottomNavigation/useBottomNavigationAction';

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
          'w-[90vw] bgi-[var(--bg-home-tab-bar)] fixed bottom-2 left-1/2 -translate-x-1/2 rounded-full',
          'bgi-text-[var(--transparent-70)]',
          'flex gap-2 box-border',
          {
            'z-50 p-2 h-12 mobile:px-3 mobile:py-2 mobile:h-14':
              isDisplayBottomNavigation,
            'z-[-1] h-0 p-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                className={cx(
                  'flex gap-2 items-center justify-center cursor-pointer rounded-full ',

                  item.isActive
                    ? 'bgi-[var(--base-2-main)] px-6 py-1'
                    : 'flex-1'
                )}
                key={index}
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
                  className="h-6 w-6 mobile:h-8 mobile:w-8"
                  level={EResourceLevel.V}
                  color={
                    item.isActive
                      ? 'var(--grayscale-20)'
                      : 'var(--transparent-white-70)'
                  }
                  name={item.icon}
                />
                {item.isActive && (
                  <span className="bgi-text-[var(--grayscale-20)] font-bold text-xs mobile:text-sm">
                    {renderI18N(item.labelKey, t)}
                  </span>
                )}

                {item.isShowRedDot ? (
                  <RedDot
                    size="10"
                    className={cx(
                      'absolute animate-none z-[2] translate-x-3.5 -translate-y-3.5',
                      {
                        'translate-x-12 -translate-y-2.5': item.isActive,
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
