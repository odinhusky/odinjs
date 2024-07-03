import {PageOrModalPathEnum} from "../../../../PageOrModalPathEnum";
import cx from "classnames";
import {useLocation} from "react-router";
import {usePageNavigate} from "../../../../router/hooks/usePageNavigate";
import {ITabBar} from "../../type";
import { environment } from "../../../../../../environments/environment";
import {ActivityBadge} from "../../../../components/Badge/ActivityBadge";
import {useInviteInCompatible} from "../../../../hooks/useInviteInCompatible";


export const TabBar = (props: ITabBar) => {
  const location = useLocation();
  const showHome = props.isShowHome === undefined ? true : props.isShowHome;
  const showSlot = props.isShowSlot === undefined ? true : props.isShowSlot;
  const showActivity = props.isShowActivity === undefined ? true : props.isShowActivity;
  const showInvite = props.isShowInvite === undefined ? true : props.isShowInvite;
  const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
  const showProfile = props.isShowProfile === undefined ? true : props.isShowProfile;
  const size = props.size == undefined ? "small" : props.size;

  // const iconSize = size === "big" ? "w-[40px] h-[40px]" : "w-[27px] h-[27px]";
  // const iconSize = size === "big" ? "w-[34px] h-[34px]" : "w-[27px] h-[27px]";
  const iconSize = "w-[24px] h-[24px]";
  const {isShowBoxInvite} = useInviteInCompatible();

  const isHomeBarFocus = location.pathname === PageOrModalPathEnum.IndexPage;
  const isInviteBarFocus = isShowBoxInvite
          ? location.pathname === PageOrModalPathEnum.BoxInvitePage
          : location.pathname === PageOrModalPathEnum.InvitePage;
  const isActivityBarFocus = location.pathname === PageOrModalPathEnum.ActivityHallPage;
  const isVipBarFocus = location.pathname === PageOrModalPathEnum.VIPGradePage;
  const isProfileBarFocus = location.pathname === PageOrModalPathEnum.MyPage;
  const isSlotBarFocus = location.pathname === PageOrModalPathEnum.IndexSlotPage;

  const {
    onClickToIndex,
    onClickToSlot,
    onClickToInvite,
    onClickToVipGrade,
    onClickToProfile,
    onClickToActivity,
    onClickToBoxInvite
  } = usePageNavigate();

  return (
    <footer
      className={cx(
        "fixed bottom-0 flex flex-row justify-between h-[60px] z-10 w-full",
        "bg-gradient-to-t from-[var(--background-nav-tab-from)] to-[var(--background-nav-tab-to)]",
        // "border-t-[1px] border-[var(--tab-border-top)]",
        {
          "p-2": size === "small",
        })}
    >
      {showHome && (
        <section
          className={cx("flex-1 flex flex-col items-center justify-center", {
            "font-bold": isHomeBarFocus
          })}
          onClick={() => {
            onClickToIndex();
          }}
        >
          <img className={iconSize} src={ isHomeBarFocus
              ? `assets/${environment.uVersion}/icon=tab-home-active.png`
              :`assets/${environment.uVersion}/icon=tab-home.png`
          }/>
          <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
            "text-[var(--tab-text-color-active)]": isHomeBarFocus,
          })}>Jogos</span>
        </section>
      )}

      {showSlot && (
        <section
          className={cx("flex-1 flex flex-col items-center justify-center", {
            "font-bold": isSlotBarFocus
          })}
          onClick={() => {
             onClickToSlot();
          }}
        >
          <img className={iconSize} src={`assets/${environment.uVersion}/icon=tab-home.png`}/>
          <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
            "text-[var(--tab-text-color-active)]": isSlotBarFocus,
          })}>Casino</span>
        </section>
      )}


      {showInvite && (
        <section
          className={cx("flex-1 flex flex-col items-center justify-center", {
            "font-bold": isInviteBarFocus
          })}
          onClick={() => {
            isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
          }}
        >
          <img className={iconSize} src={isInviteBarFocus
              ? `assets/${environment.uVersion}/icon=tab-convidar-active.png`
              : `assets/${environment.uVersion}/icon=tab-convidar.png`
          }/>
          <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
            "text-[var(--tab-text-color-active)]": isInviteBarFocus,
          })}>Convidar</span>
        </section>
      )}

      {showActivity && (
          <section
              className={cx("flex-1 flex flex-col items-center justify-center", {
                "font-bold": isActivityBarFocus
              })}
              onClick={() => {
                onClickToActivity();
              }}
          >
            <div className={'relative'}>
              <img className={iconSize} src={isActivityBarFocus
                  ? `assets/${environment.uVersion}/icon_tab_activity_active.png`
                  : `assets/${environment.uVersion}/icon_tab_activity.png`
              }/>
              <ActivityBadge  className={'absolute top-0 right-0 -m-1.5'}/>
            </div>

            <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
              "text-[var(--tab-text-color-active)]": isActivityBarFocus
            })}>Eventos</span>
          </section>
      )}

      {showVIP && (
        <section
          className={cx("flex-1 flex flex-col items-center justify-center", {
            "font-bold": isVipBarFocus
          })}
          onClick={() => {
            onClickToVipGrade();
          }}
        >
          <img className={iconSize} src={ isVipBarFocus
              ? `assets/${environment.uVersion}/icon=tab-vip-active.png`
              : `assets/${environment.uVersion}/icon=tab-vip.png`}/>
          <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
            "text-[var(--tab-text-color-active)]": isVipBarFocus,
          })}>VIP</span>
        </section>
      )}


      {showProfile && (
        <section
          className={cx("flex-1 flex flex-col items-center justify-center", {
            "font-bold": isProfileBarFocus
          })}
          onClick={() => {
            onClickToProfile();
           }}
        >
          <img className={iconSize} src={isProfileBarFocus
              ? `assets/${environment.uVersion}/icon=tab-account-active.png`
              : `assets/${environment.uVersion}/icon=tab-account.png`
          }/>
          <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
            "text-[var(--tab-text-color-active)]": isProfileBarFocus,
          })}>Minha</span>
        </section>
      )}

    </footer>
  )

}
