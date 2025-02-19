import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import {
  BottomNavigationScenarios,
  useBottomNavigationStore,
} from '@mode2/zustand/components/bottomNavigationStore';
import { useTranslation } from 'react-i18next';
import RedDot from '@components/RedDot';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { forwardRef, memo, Ref } from 'react';
import Icon from '@components/Icon';
import { handleMobileExclusiveNavButtonClick } from '@libs/mode2/action/components/bottomNavigation/acitonType';
import useBottomNavigationActions from '@libs/mode2/action/components/bottomNavigation/useBottomNavigationAction';
import useMobileExclusiveNavOverride from '@/ui/4/components/BottomNavigation/useMobileExclusiveNavOverride';

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
        return item.scenarios === BottomNavigationScenarios.INVITE_WHEEL;
      })?.bottomNavigationList || [];

    return (
      <div ref={ref} className={cx('fixed bottom-0 w-full z-40')}>
        {isMobileExclusiveDisplay ? (
          <img
            className={cx(
              'absolute bottom-0 w-full',
              MOBILE_BREAK_POINT_MAX_WIDTH,
              'right-1/2 translate-x-1/2',
              'max-h-[100px] object-fill'
            )}
            alt={'navigation_bar'}
            src={getImgUrl(EResourceLevel.V, 'navigation_bar')}
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
                    handleBottomNavigationClick({
                      actionName: handleMobileExclusiveNavButtonClick,
                      payload: {
                        ...item.actionPayload,
                      },
                    });
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
                    {/*{}*/}
                  </div>
                  {item.isShowRedDot ? (
                    <RedDot
                      type="img"
                      size="10"
                      className={cx(
                        'absolute animate-none z-[2] translate-x-5 bottom-[64%]'
                      )}
                    />
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
