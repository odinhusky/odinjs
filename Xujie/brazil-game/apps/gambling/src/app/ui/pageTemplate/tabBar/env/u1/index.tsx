import {PageOrModalPathEnum} from "../../../../PageOrModalPathEnum";
import cx from "classnames";
import {useLocation} from "react-router";
import {usePageNavigate} from "../../../../router/hooks/usePageNavigate";
import {ITabBar} from "../../type";
import {ActivityBadge} from "../../../../components/Badge/ActivityBadge";
import {useInviteInCompatible} from "../../../../hooks/useInviteInCompatible";
import {environment} from "../../../../../../environments/environment";


export const TabBar = (props: ITabBar) => {
    const location = useLocation();
    const showHome = props.isShowHome === undefined ? true : props.isShowHome;
    const showSlot = props.isShowSlot === undefined ? true : props.isShowSlot;
    const showActivity = props.isShowActivity === undefined ? true : props.isShowActivity;
    // const showInvite = props.isShowInvite === undefined ? true : props.isShowInvite;
    const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
    const showProfile = props.isShowProfile === undefined ? true : props.isShowProfile;
    const size = props.size == undefined ? "small" : props.size;

    // const iconSize = size === "big" ? "w-[40px] h-[40px]" : "w-[27px] h-[27px]";
    // const iconSize = size === "big" ? "w-[34px] h-[34px]" : "w-[27px] h-[27px]";
    const iconSize = "w-[24px] h-[24px]";

    const {
        onClickToIndex,
        onClickToSlot,
        onClickToInvite,
        onClickToVipGrade,
        onClickToProfile,
        onClickToActivity,
        onClickToBoxInvite
    } = usePageNavigate();


    // 邀請寶箱互斥
    const {isShowBoxInvite} = useInviteInCompatible();

    const homeIcon = `assets/${environment.uVersion}/icon=tab-home.png`;
    const inviteIcon = `assets/${environment.uVersion}/icon=tab-convidar.png`;
    const activityIcon = `assets/${environment.uVersion}/icon_tab_activity.png`;
    const vipIcon = `assets/${environment.uVersion}/icon=tab-vip.png`;
    const accountIcon = `assets/${environment.uVersion}/icon=tab-account.png`;


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
                        "font-bold": location.pathname === PageOrModalPathEnum.IndexPage ||
                            location.pathname === PageOrModalPathEnum.GameSearchPage
                    })}
                    onClick={() => {
                        onClickToIndex();
                    }}
                >
                    {(
                        location.pathname === PageOrModalPathEnum.IndexPage ||
                        location.pathname === PageOrModalPathEnum.GameSearchPage
                    ) ? (
                        <img className={cx(iconSize)} src={homeIcon}/>
                    ) : (
                        <img className={cx(iconSize, "opacity-50")} src={homeIcon}/>
                    )}
                    <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                        "text-[var(--tab-text-color-active)]": location.pathname === PageOrModalPathEnum.IndexPage,
                    })}>Jogos</span>
                </section>
            )}

            {showSlot && (
                <section
                    className={cx("flex-1 flex flex-col items-center justify-center", {
                        "font-bold": location.pathname === PageOrModalPathEnum.IndexSlotPage
                    })}
                    onClick={() => {
                        onClickToSlot();
                    }}
                >
                    {location.pathname === PageOrModalPathEnum.IndexSlotPage ? (
                        <img className={iconSize} src={homeIcon}/>
                    ) : (
                        <img className={cx(iconSize, "opacity-50")} src={homeIcon}/>
                    )}
                    <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                        "text-[var(--tab-text-color-active)]": location.pathname === PageOrModalPathEnum.IndexSlotPage,
                    })}>Casino</span>
                </section>
            )}

            <section
                className={cx("flex-1 flex flex-col items-center justify-center", {
                    "font-bold": (
                        isShowBoxInvite
                            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
                            : location.pathname === PageOrModalPathEnum.InvitePage
                    )
                })}
                onClick={() => {
                    isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
                }}
            >
                {(
                    isShowBoxInvite
                        ? location.pathname === PageOrModalPathEnum.BoxInvitePage
                        : location.pathname === PageOrModalPathEnum.InvitePage
                ) ? (
                    <img className={iconSize} src={inviteIcon}/>
                ) : (
                    <img className={cx(iconSize, "opacity-50")} src={inviteIcon}/>
                )}
                <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                    "text-[var(--tab-text-color-active)]": (
                        isShowBoxInvite
                            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
                            : location.pathname === PageOrModalPathEnum.InvitePage
                    ),
                })}>Convidar</span>
            </section>

            {showActivity && (
                <section
                    className={cx("flex-1 flex flex-col items-center justify-center", {
                        "font-bold": location.pathname === PageOrModalPathEnum.ActivityHallPage
                    })}
                    onClick={() => {
                        onClickToActivity();
                    }}
                >

                    <div className={'relative'}>
                        {location.pathname === PageOrModalPathEnum.ActivityHallPage ? (
                            <img className={iconSize} src={activityIcon}/>
                        ) : (
                            <img className={cx(iconSize, "opacity-50")} src={activityIcon}/>
                        )}
                        <ActivityBadge className={'absolute top-0 right-0 -m-1.5'}/>
                    </div>

                    <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                        "text-[var(--tab-text-color-active)]": location.pathname === PageOrModalPathEnum.ActivityHallPage,
                    })}>Eventos</span>
                </section>
            )}

            {showVIP && (
                <section
                    className={cx("flex-1 flex flex-col items-center justify-center", {
                        "font-bold": location.pathname === PageOrModalPathEnum.VIPGradePage
                    })}
                    onClick={() => {
                        onClickToVipGrade();
                    }}
                >
                    {location.pathname === PageOrModalPathEnum.VIPGradePage ? (
                        <img className={iconSize} src={vipIcon}/>
                    ) : (
                        <img className={cx(iconSize, "opacity-50")} src={vipIcon}/>
                    )}
                    <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                        "text-[var(--tab-text-color-active)]": location.pathname === PageOrModalPathEnum.VIPGradePage,
                    })}>VIP</span>
                </section>
            )}


            {showProfile && (
                <section
                    className={cx("flex-1 flex flex-col items-center justify-center", {
                        "font-bold": location.pathname === PageOrModalPathEnum.MyPage
                    })}
                    onClick={() => {
                        onClickToProfile();
                    }}
                >
                    {location.pathname === PageOrModalPathEnum.MyPage ? (
                        <img className={iconSize} src={accountIcon}/>
                    ) : (
                        <img className={cx(iconSize, "opacity-50")} src={accountIcon}/>
                    )}
                    <span className={cx("text-sm text-[var(--tab-text-color-normal)]", {
                        "text-[var(--tab-text-color-active)]": location.pathname === PageOrModalPathEnum.MyPage,
                    })}>Minha</span>
                </section>
            )}

        </footer>
    )

}
