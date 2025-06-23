import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import {
  BottomNavigationScenarios,
  BottomNavigationUnit,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { forwardRef, memo, Ref, useCallback } from 'react';
import Icon from '@components/Icon';
import { handleMobileExclusiveNavButtonClick } from '@mode2/action/actionTypes';
import useBottomNavigationActions from '@libs/mode2/action/components/bottomNavigation/useBottomNavigationAction';
import useMobileExclusiveNavOverride from './useMobileExclusiveNavOverride';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import RedDot from '@components/RedDot';

const BottomNavigation = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    useMobileExclusiveNavOverride();
    const { t } = useTranslation();
    const { handleBottomNavigationClick } = useBottomNavigationActions();
    const isMobileExclusiveDisplay = useBottomNavigationStore(
      (state) => state.isMobileExclusiveDisplay
    );

    const usageScenariosList = useBottomNavigationStore(
      (state) => state.usageScenariosList
    );
    const bottomNavigationList =
      usageScenariosList.find((item) => {
        return item.scenarios === BottomNavigationScenarios.V6_DEFAULT;
      })?.bottomNavigationList || [];

    const userRole = useUserProfileStore((state) => state.userRole);

    // Evan 避免 UserRole 改變
    const handleNavClick = useCallback(
      (item: BottomNavigationUnit) => {
        handleBottomNavigationClick({
          actionName: handleMobileExclusiveNavButtonClick,
          payload: {
            ...item.actionPayload,
          },
        });
      },
      [userRole]
    );

    return (
      <div ref={ref} className={cx('fixed bottom-0 w-full z-40')}>
        {isMobileExclusiveDisplay ? (
          <BaseCacheImg
            className={cx(
              'absolute bottom-0 w-full',
              MOBILE_BREAK_POINT_MAX_WIDTH,
              'right-1/2 translate-x-1/2',
              'max-h-[100px] object-fill'
            )}
            alt={'navigation_bar'}
            src={getImgUrl(EResourceLevel.V, 'navigation_bar')}
            imgName="navigation_bar"
          />
        ) : null}
        <div
          ref={ref}
          className={cx(
            'w-full',
            FLEX_ITEMS_CENTER,
            MOBILE_BREAK_POINT_MAX_WIDTH,
            'justify-between gap-0',
            // 'justify-around gap-4',
            'z-50 -bottom-px px-4',
            {
              'z-50 h-[100px] -bottom-px': isMobileExclusiveDisplay,
              'z-[-1] h-0 -bottom-0': !isMobileExclusiveDisplay,
            }
          )}
          // style={{
          //   backgroundImage: `url(${getImgUrl(
          //     EResourceLevel.V,
          //     'navigation_bar'
          //   )})`,
          //   backgroundSize: '100% 100px',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundPosition: 'bottom',
          //
          //   // backgroundAttachment: 'fixed',
          // }}
        >
          {isMobileExclusiveDisplay
            ? bottomNavigationList.map((item, index) => (
                <div
                  key={index}
                  className={cx(
                    'relative h-full w-full',
                    'flex flex-col items-center justify-end',
                    'flex-1',
                    'text-xs',
                    'text-nowrap',
                    'pb-6 mobile:pb-5',
                    'cursor-pointer'
                  )}
                  onClick={() => {
                    handleNavClick(item);
                    // handleBottomNavigationClick({
                    //   actionName: handleMobileExclusiveNavButtonClick,
                    //   payload: {
                    //     ...item.actionPayload,
                    //   },
                    // });
                  }}
                >
                  {item.isDrop ? (
                    <Icon
                      className={'w-[100px] h-[76px] top-1 relative z-10'}
                      // isActive={item.isActive}
                      name={'nav_bar_invitation_wheel'}
                    />
                  ) : (
                    <Icon
                      className={'w-6 h-6 relative z-10'}
                      isActive={item.isActive}
                      name={item.icon}
                    />
                  )}
                  <div
                    className={cx(
                      'relative z-10 mt-1.5',
                      'text-xs font-medium',
                      {
                        'bgi-text-[var(--base-1-variant3)]': item.isActive,
                        'bgi-text-[var(--grayscale-100)]': !item.isActive,
                      }
                    )}
                  >
                    {item.isDrop ? '' : renderI18N(item.labelKey, t)}
                  </div>

                  {item.isShowRedDot ? (
                    <RedDot
                      className={cx(
                        'w-4 h-4 flex items-center justify-center',
                        'absolute animate-none z-[2] translate-x-3 -translate-y-[38px] z-10'
                      )}
                    >
                      <span className="text-xxs bgi-text-[var(--grayscale-100)]">
                        {item.unReadCount}
                      </span>
                    </RedDot>
                  ) : null}
                </div>
              ))
            : null}
        </div>
      </div>
    );
  })
);

export default BottomNavigation;
