import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { ITabBar } from '../../type';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import { RootState } from '../../../../../reduxStore';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { environment } from '../../../../../../environments/environment';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';

export const TabBar = (props: ITabBar) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const showHome = props.isShowHome === undefined ? true : props.isShowHome;
  const showInvite =
    props.isShowInvite === undefined ? true : props.isShowInvite;
  const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
  const showProfile =
    props.isShowProfile === undefined ? true : props.isShowProfile;
  const size = props.size == undefined ? 'small' : props.size;

  // const iconSize = size === "big" ? "w-[40px] h-[40px]" : "w-[27px] h-[27px]";
  // const iconSize = size === "big" ? "w-[34px] h-[34px]" : "w-[27px] h-[27px]";
  const iconSize = 'w-[28px] h-[28px]';
  const { isShowBoxInvite } = useInviteInCompatible();

  const {
    onClickToIndex,
    onClickToInvite,
    onClickToVipGrade,
    onClickToProfile,
    onClickToBoxInvite,
  } = usePageNavigate();

  const isActive = (active: boolean) => (active ? '#9c6aef' : '#b3b3b3');
  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  );
  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );

  const { isMobile } = useBreakpoint();

  return (
    <footer
      className={twMerge(
        'h-[72px] w-full',
        'bg-[var(--grayscale-20)]',
        'z-10 fixed bottom-0',
        'flex flex-row justify-between',
        props.className
      )}
    >
      <section
        className={cx('flex-1 flex flex-col items-center justify-center')}
        onClick={() => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(true));
        }}
      >
        <img
          className={cx(iconSize)}
          src={
            openMenuDrawer
              ? `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_menu_m_hold.png`
              : `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_menu_m.png`
          }
        />
        {/*<MenuSVGIcon size={isMobile ? 28: undefined}/>*/}
        <div
          className={twMerge(
            'text-sm font-medium leading-5',
            openMenuDrawer
              ? 'text-[var(--primary-hover)]'
              : 'text-[var(--grayscale-70)]'
          )}
        >
          Menu
        </div>
      </section>

      {showInvite && (
        <section
          className={cx('flex-1 flex flex-col items-center justify-center')}
          onClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
          }}
        >
          <img
            className={cx(iconSize)}
            src={
              !openMenuDrawer &&
              (isShowBoxInvite
                ? location.pathname === PageOrModalPathEnum.BoxInvitePage
                : location.pathname === PageOrModalPathEnum.InvitePage)
                ? `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m_hold.png`
                : `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m.png`
            }
          />
          <div
            className={twMerge(
              'text-sm font-medium leading-5',
              !openMenuDrawer &&
                (isShowBoxInvite
                  ? location.pathname === PageOrModalPathEnum.BoxInvitePage
                  : location.pathname === PageOrModalPathEnum.InvitePage)
                ? 'text-[var(--primary-hover)]'
                : 'text-[var(--grayscale-70)]'
            )}
          >
            Convidar
          </div>
        </section>
      )}

      {showHome && (
        <section
          className={cx('flex-1 flex flex-col items-center justify-center')}
          onClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            onClickToIndex();
          }}
        >
          <div className={'w-[28px] h-[28px]'} />

          <div className="absolute top-[-35px] bg-[var(--grayscale-20)] flex flex-row items-start pt-1 px-1 rounded-[100px]">
            <div
              className={cx(
                'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-row justify-center mb-1 pt-4 w-16 h-16 items-start rounded-[100px]',
                'bg-[linear-gradient(145deg,_var(--liner-main-from)_-7%,_var(--liner-main-to)_109%)]'
              )}
            >
              {/*<GameControllerSVGIcon size={isMobile ? 28 : undefined}/>*/}
              <img
                className={cx(iconSize)}
                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_tab_home_m.png`}
              />
            </div>
          </div>

          <div
            className={twMerge(
              'text-sm font-medium leading-5',
              !openMenuDrawer &&
                (location.pathname === PageOrModalPathEnum.IndexPage ||
                  location.pathname === PageOrModalPathEnum.GameSearchPage)
                ? 'text-[var(--primary-hover)]'
                : 'text-[var(--grayscale-70)]'
            )}
          >
            Casino
          </div>
        </section>
      )}

      {showVIP && (
        <section
          className={cx('flex-1 flex flex-col items-center justify-center')}
          onClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            onClickToVipGrade();
          }}
        >
          <img
            className={cx(iconSize)}
            src={
              !openMenuDrawer &&
              location.pathname === PageOrModalPathEnum.VIPGradePage
                ? `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m_hold.png`
                : `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m.png`
            }
          />
          {/*<CrownSVGIcon color={isActive(location.pathname === PageOrModalPathEnum.VIPGradePage)}*/}
          {/*              size={isMobile ? 28 : undefined}/>*/}

          <div
            className={twMerge(
              'text-sm font-medium leading-5',
              !openMenuDrawer &&
                location.pathname === PageOrModalPathEnum.VIPGradePage
                ? 'text-[var(--primary-hover)]'
                : 'text-[var(--grayscale-70)]'
            )}
          >
            VIP
          </div>
        </section>
      )}

      {showProfile && (
        <section
          className={cx('flex-1 flex flex-col items-center justify-center')}
          onClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            onClickToProfile();
          }}
        >
          <div className="relative">
            <img
              className={cx(iconSize)}
              src={
                !openMenuDrawer &&
                location.pathname === PageOrModalPathEnum.MyPage
                  ? `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m_hold.png`
                  : `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m.png`
              }
            />

            {/*<UserSVGIcon color={isActive(location.pathname === PageOrModalPathEnum.MyPage)}*/}
            {/*             size={isMobile ? 28 : undefined}/>*/}
            {messageCount > 0 && (
              <div className="absolute top-[-10px] right-[-10px] text-xs leading-[16px] text-white bg-[var(--state-error-main)] flex flex-row mb-4 w-5 h-5 justify-center items-center rounded-[100px]">
                {messageCount}
              </div>
            )}
          </div>

          <div
            className={twMerge(
              'text-sm font-medium leading-5',
              !openMenuDrawer &&
                location.pathname === PageOrModalPathEnum.MyPage
                ? 'text-[var(--primary-hover)]'
                : 'text-[var(--grayscale-70)]'
            )}
          >
            Minha
          </div>
        </section>
      )}
    </footer>
  );
};
