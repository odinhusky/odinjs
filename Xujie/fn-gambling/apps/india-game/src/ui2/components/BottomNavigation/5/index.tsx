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
import { handleBottomNavigationButtonClick } from '@mode2/action/actionTypes';
import useBottomNavigationActions from '@libs/mode2/action/components/bottomNavigation/useBottomNavigationAction';

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
        return item.scenarios === BottomNavigationScenarios.INVITE_WHEEL;
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
            'z-50 h-16 -bottom-px': isDisplayBottomNavigation,
            'z-[-1] h-0 -bottom-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'flex items-center justify-end',
                  'flex-col',
                  'flex-1',
                  'text-xs',
                  'text-nowrap',
                  'relative',
                  'cursor-pointer m-1',
                  'h-[calc(100%_-_8px)]',
                  {
                    'group is-active bgi-[var(--base-1-50)] bgi-border-[var(--base-1-main)] rounded-lg':
                      item.isActive && !item.isDrop,
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
                {item.isDrop ? (
                  <Icon
                    className={cx('w-auto h-10', 'absolute z-[1] bottom-7')}
                    name={'ic_tab_menu_drop'}
                  />
                ) : (
                  // <img
                  //   src={getImgUrl(EResourceLevel.V, 'ic_tab_menu_drop', '.gif')}
                  //   className={cx('w-auto h-10', 'absolute z-[1] bottom-7')}
                  //   alt=""
                  // />
                  <Icon
                    className={'w-5 h-5 relative z-10'}
                    color={
                      item.isActive
                        ? 'var(--grayscale-100)'
                        : 'var(--base-2-main)'
                    }
                    name={item.icon}
                  />
                )}
                <div
                  className={cx(
                    'relative z-10',
                    'mt-1  mb-2 text-xs mobile:text-sm font-medium',
                    'group-[.is-active]:bgi-text-[var(--grayscale-100)] bgi-text-[var(--base-2-main)]'
                  )}
                >
                  {renderI18N(item.labelKey, t)}
                </div>
                {item.isShowRedDot ? (
                  <RedDot
                    type="img"
                    size="10"
                    className={cx(
                      'absolute animate-none z-[2] translate-x-5 top-1'
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
