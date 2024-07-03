import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { ITabBar } from '../../type';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';
import { useMemo } from 'react';
import { environment } from '../../../../../../environments/environment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { useScrollToPartPageTemplate } from '../../../hooks/useScrollToPartPageTemplate';
import { ActivityBadge } from '../../../../components/Badge/ActivityBadge';
import useBreakpoint from '../../../hooks/useBreakpoint';

export const TabBar = (props: ITabBar) => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const location = useLocation();
  const showActivity =
    props.isShowActivity === undefined ? true : props.isShowActivity;
  const showInvite =
    props.isShowInvite === undefined ? true : props.isShowInvite;
  const showHome = props.isShowHome === undefined ? true : props.isShowHome;
  const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
  const showProfile =
    props.isShowProfile === undefined ? true : props.isShowProfile;

  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  );
  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );
  const excludeJudge = !openMenuDrawer && !openUserInfoStatusPopover;

  const dispatch = useDispatch();
  const { isMobile } = useBreakpoint();

  const {
    onClickToIndex,
    onClickToInvite,
    onClickToVipGrade,
    onClickToProfile,
    onClickToBoxInvite,
    onClickToActivity,
  } = usePageNavigate();

  // 邀請寶箱互斥
  const { isShowBoxInvite } = useInviteInCompatible();
  const { scrollToWindowTop } = useScrollToPartPageTemplate();

  // & handled data
  const closeRelatedModal = () => {
    dispatch(uiSlice.actions.setOpenMenuDrawer(false));
    dispatch(uiSlice.actions.setUserInfoStatusPopover(false));
  };

  const tabsData = useMemo(
    () => [
      {
        id: 'activity',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_gifts_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_gifts_m_hold.png`,
        },
        isShow: showActivity,
        isShowBadge: true,
        isActive:
          excludeJudge && (
            location.pathname === PageOrModalPathEnum.ActivityHallPage
            || location.pathname === PageOrModalPathEnum.InitialChargePage
            || location.pathname === PageOrModalPathEnum.RechargeActivityPage
            || location.pathname === PageOrModalPathEnum.DailySignInPage
          ),
        action: () => {
          closeRelatedModal();

          onClickToActivity();
        },
      },
      {
        id: 'invite',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m_hold.png`,
        },
        isShow: !isShowBoxInvite,
        isShowBadge: false,
        isActive:
          excludeJudge &&
          (isShowBoxInvite
            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
            : location.pathname === PageOrModalPathEnum.InvitePage|| location.pathname === PageOrModalPathEnum.InviteSettlementRecordPage),
        action: () => {
          closeRelatedModal();

          isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
        },
      },
      {
        id: 'box',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_box_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_box_m_hold.png`,
        },
        isShow: isShowBoxInvite,
        isShowBadge: false,
        isActive:
          excludeJudge &&
          (isShowBoxInvite
            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
            : location.pathname === PageOrModalPathEnum.InvitePage),
        action: () => {
          closeRelatedModal();

          isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
        },
      },
      {
        id: 'home',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_home_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_home_m_hold.png`,
        },
        isShow: showHome,
        isShowBadge: false,
        isActive:
          excludeJudge &&
          (location.pathname === PageOrModalPathEnum.IndexPage ||
            location.pathname === PageOrModalPathEnum.GameSearchPage),
        action: () => {
          closeRelatedModal();

          onClickToIndex();
          scrollToWindowTop();
        },
      },
      {
        id: 'vip',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m_hold.png`,
        },
        isShow: showVIP,
        isShowBadge: false,
        isActive:
          excludeJudge &&
          location.pathname === PageOrModalPathEnum.VIPGradePage,
        action: () => {
          closeRelatedModal();

          onClickToVipGrade();
        },
      },
      {
        id: 'account',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m_hold.png`,
        },
        isShow: showProfile,
        isShowBadge: false,
        isActive: isMobile
          ? location.pathname === PageOrModalPathEnum.MyPage
          : !openMenuDrawer && openUserInfoStatusPopover,
        action: () => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(false));

          if (isMobile) {
            onClickToProfile();
          } else {
            dispatch(
              uiSlice.actions.setUserInfoStatusPopover(
                !openUserInfoStatusPopover
              )
            );
          }
        },
      },
    ],
    [
      openMenuDrawer,
      showActivity,
      showInvite,
      isShowBoxInvite,
      showHome,
      showVIP,
      showProfile,
      location.pathname,
      isLogin,
      isMobile,
      excludeJudge,
      openUserInfoStatusPopover,
    ]
  );

  return (
    <footer className="fixed bottom-0 z-[1004] mb-3 w-full mobile:w-auto mobile:left-1/2 mobile:-translate-x-1/2">
      <div
        className="bg-tabbar flex mobile:w-[480px] w-11/12 mobile:h-[88px] h-[72px] justify-around gap-x-1
          rounded-lg py-1 mobile:px-8 px-3 my-0 mx-auto 
          mobile:shadow-[0px_0px_20px_#FFFFFF80_inset] shadow-[0px_0px_12px_#FFFFFF80_inset]"
      >
        {tabsData.map((item: any, index: number) =>
          item.isShow ? (
            <div
              key={index}
              className="relative flex flex-col justify-center items-center w-full cursor-pointer"
              onClick={() => {
                item.action();
              }}
            >
              {item.isActive && (
                <div className="bg-tabber-focus absolute w-full h-full border-t-2 border-solid border-[var(--grayscale-100)]" />
              )}
              <img
                className="max-h-[38%]"
                alt={item.id}
                src={item.isActive ? item.img.active : item.img.src}
              />
              {item.isShowBadge && (
                <ActivityBadge
                  className={cx(
                    'absolute mobile:ml-[-46%] mobile:mt-[-46%] ml-[-30%] mt-[-25%]',
                    'bg-[var(--state-warn-main)] ',
                    'shadow-[0px_0px_4px_#FFFFFF40]',
                    'w-3 h-3'
                  )}
                />
              )}
            </div>
          ) : (
            ''
          )
        )}
      </div>
    </footer>
  );
};
