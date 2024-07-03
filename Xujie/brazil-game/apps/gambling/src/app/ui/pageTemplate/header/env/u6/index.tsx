import cx from 'classnames';
import { UserMoneyStatusSection } from '../../UserMoneyStatusSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { NotificationAnimationIcon } from '../../../../components-bs/Icons/animation/NotificationAnimationIcon';
import { IHeader } from '../../types/IHeader';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { CacheImage } from '../../../../components/image/CacheImage';
import { environment } from '../../../../../../environments/environment';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { Avatar } from '../../../../components/Avatar';

export const Header = (props: IHeader) => {
  const user: IUserInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
  );
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );
  const vip_level = useSelector((state: RootState) => state.app.vip_level);

  const currentUserVipLevel = vip_level || user.vip_level;
  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );
  const { onClickToIndex, onClickToProfile } = usePageNavigate();
  const dispatch = useDispatch();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <header
      className={cx(
        'z-[1001] sticky top-[0]',
        'flex flex-row justify-between items-center relative',
        'px-4 h-[64px]',
        'mobile:px-9 mobile:h-[72px]',
        'tablet:px-12 tablet:h-[56px]',
        'bg-header'
      )}
    >
      <div
        className={'cursor-pointer flex flex-none justify-center items-center'}
        onClick={() => onClickToIndex()}
      >
        <CacheImage
          className={cx(
            'h-10 w-10 ',
            'active:brightness-75 hover:brightness-125'
          )}
          alt={'logo'}
          src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
        />

        <div
          className={cx(
            'font-bold text-[var(--grayscale-100)]',
            'ml-4 hidden',
            'mobile:text-xl mobile:block',
            'tablet:text-2xl tablet:block'
          )}
        >
          {environment.platformName}
        </div>
      </div>

      {!isLogin && (
        <div
          className={cx(
            'flex-1 flex justify-end',
            'font-bold text-[var(--grayscale-100)]',
            'gap-x-2 h-8',
            'mobile:gap-x-3 mobile:h-9',
            'tablet:gap-x-4 tablet:h-9'
          )}
        >
          <button
            className={cx(
              'rounded-lg linear-1-button',
              'w-[100px] mobile:w-[120px]'
            )}
            onClick={() => {
              dispatch(appSlice.actions.showLoginDrawerOrModal(true));
              dispatch(appSlice.actions.setLoginUIStatusType('login'));
            }}
          >
            {'Entrar'}
          </button>

          <button
            className={cx(
              'rounded-lg linear-2-button',
              'w-[100px] mobile:w-[120px]'
            )}
            onClick={() => {
              dispatch(appSlice.actions.showLoginDrawerOrModal(true));
              dispatch(appSlice.actions.setLoginUIStatusType('register'));
            }}
          >
            {'Registro'}
          </button>
        </div>
      )}

      {isLogin && (
        <div className={'flex-1 flex justify-end  items-center gap-2'}>
          <UserMoneyStatusSection
            className={cx(
              'rounded-lg border-[1.5px] bg-[var(--grayscale-30)] border-[var(--grayscale-50)] shadow-[inset_0px_4px_2px_0px_rgba(0,_0,_0,_0.3)]',
              'mr-0 mobile:mr-2 tablet:mr-4'
            )}
          />

          <div
            className={cx(
              'flex flex-none gap-2 items-center cursor-pointer block',
              { hidden: isMobile }
            )}
            onClick={() => {
              isDesktop
                ? dispatch(
                    uiSlice.actions.setUserInfoStatusPopover(
                      !openUserInfoStatusPopover
                    )
                  )
                : onClickToProfile();
            }}
          >
            <Avatar
              className={cx(
                'rounded-full hover:opacity-70',
                'ring ring-2 ring-[var(--grayscale-70)]',
                'ring-offset-2 ring-offset-[var(--grayscale-15)]',
                'w-10 h-10 min-w-10 min-h-10'
              )}
            />

            <div
              className={cx('block font-medium text-[var(--grayscale-100)]', {
                hidden: isTablet || isMobile,
              })}
            >
              <div className="text-base">ID:{user.user_id}</div>
              <div className="text-sm">LV:{currentUserVipLevel}</div>
            </div>

            <CacheImage
              className={cx(
                'mx-auto my-auto h-5 w-5 hover:opacity-70',
                openUserInfoStatusPopover ? 'rotate-180' : 'rotate-0'
              )}
              alt={'down_arrow'}
              src={`assets/${environment.uVersion}/ic_down_arrow.png`}
            />
          </div>

          <button
            className={cx(
              'header-button',
              'flex flex-none w-8 h-8 object-cover justify-center items-center block',
              { hidden: isDesktop || isTablet }
            )}
            onClick={() => {
              dispatch(appSlice.actions.setShowGameSearchModal(true));
            }}
          >
            <CacheImage
              className={cx('hover:opacity-70 object-cover')}
              alt={'search'}
              src={`assets/${environment.uVersion}/${environment.mVersion}/ic_search_btn.png`}
            />
          </button>

          <div
            className={cx(
              'header-button relative flex flex-none justify-center',
              'h-8 w-8',
              'mobile:h-10 mobile:w-10'
            )}
            onClick={() => {
              props.onClickToOpenNotificationDrawer();
            }}
          >
            <NotificationAnimationIcon
              className={cx('object-cover')}
              messageCount={messageCount}
            />
          </div>
        </div>
      )}
    </header>
  );
};
