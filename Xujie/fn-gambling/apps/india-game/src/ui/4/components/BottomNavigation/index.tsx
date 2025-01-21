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
import { useLocation } from 'react-router';
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
        return item.scenarios === BottomNavigationScenarios.TEAM_CLUB;
      })?.bottomNavigationList || [];

    return (
      <div
        ref={ref}
        className={cx(
          'w-full bgi-[var(--bg-home-tab-bar)] fixed left-1/2 -translate-x-1/2 rounded-t-lg',
          'bgi-text-[var(--transparent-70)]',
          'flex gap-1',
          {
            'z-50 box-border p-1 -bottom-px': isDisplayBottomNavigation,
            'z-[-1] p-0 h-0 -bottom-0': !isDisplayBottomNavigation,
          }
        )}
      >
        {isDisplayBottomNavigation
          ? bottomNavigationList.map((item, index) => (
              <div
                key={index}
                className={cx(
                  'flex-1',
                  item.isActive
                    ? 'group is-active bgi-[var(--base-1-main)] p-[1px] rounded-lg'
                    : ''
                )}
              >
                <div className="bgi-[var(--bg-home-tab-bar)] rounded-lg overflow-hidden">
                  <div
                    className={cx(
                      'flex flex-col gap-1 items-center justify-center cursor-pointer  p-1.5 ',
                      'group-[.is-active]:bgi-[var(--base-1-50)]'
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
                      className="w-6 h-6 mobile:w-8 mobile:h-8"
                      level={EResourceLevel.V}
                      color={
                        item.isActive
                          ? 'var(--grayscale-100)'
                          : 'var(--base-2-main)'
                      }
                      name={item.icon}
                    />
                    <span
                      className={cx(
                        'text-xs mobile:text-sm',
                        'group-[.is-active]:bgi-text-[var(--grayscale-100)] bgi-text-[var(--base-2-main)]'
                      )}
                    >
                      {renderI18N(item.labelKey, t)}
                    </span>

                    {item.isShowRedDot ? (
                      <RedDot
                        size="8"
                        className={cx(
                          'absolute animate-none z-[2] translate-x-5 -translate-y-4'
                        )}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    );

    // return isDisplayBottomNavigation ? (
    //   <div
    //     className={cx(
    //       'w-full bgi-[var(--bg-home-tab-bar)] fixed -bottom-px left-1/2 -translate-x-1/2 rounded-t-lg',
    //       'bgi-text-[var(--transparent-70)]',
    //       'flex gap-1 z-50 box-border p-1'
    //     )}
    //   >
    //     {bottomNavigationItems.map((item, index) => (
    //       <div
    //         key={index}
    //         className={cx(
    //           'flex-1',
    //           item.isActive
    //             ? 'group is-active bgi-[var(--base-1-main)] p-[1px] rounded-lg'
    //             : ''
    //         )}
    //       >
    //         <div className="bgi-[var(--bg-home-tab-bar)] rounded-lg overflow-hidden">
    //           <div
    //             className={cx(
    //               'flex flex-col gap-1 items-center justify-center cursor-pointer  p-1.5 ',
    //               'group-[.is-active]:bgi-[var(--base-1-50)]'
    //             )}
    //             onClick={() => item.onClickAction()}
    //           >
    //             <Icon
    //               className="w-6 h-6 mobile:w-8 mobile:h-8"
    //               level={EResourceLevel.V}
    //               color={
    //                 item.isActive ? 'var(--grayscale-100)' : 'var(--base-2-main)'
    //               }
    //               name={item.icon}
    //             />
    //             <span
    //               className={cx(
    //                 'text-xs mobile:text-sm',
    //                 'group-[.is-active]:bgi-text-[var(--grayscale-100)] bgi-text-[var(--base-2-main)]'
    //               )}
    //             >
    //               {renderI18N(item.labelKey, t)}
    //             </span>
    //
    //             {item.isShowRedDot ? (
    //               <RedDot
    //                 size="8"
    //                 className={cx(
    //                   'absolute animate-none z-[2] translate-x-5 -translate-y-4'
    //                 )}
    //               />
    //             ) : null}
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // ) : null;
  })
);

export default BottomNavigation;
