import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useDispatch, useSelector } from 'react-redux';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { environment } from '../../../../../../environments/environment';
import { MenuDrawerItem } from './MenuDrawerItem';
import { MenuDrawerDonItem } from './MenuDrawerDonItem';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { ActivityBadge } from '../../../../components/Badge/ActivityBadge';
import cx from '../../../../utils/cx';
import { CacheImage } from '../../../../components/image/CacheImage';
import { useGetGlobalConfigQuery } from '../../../../../external';
import { ReactNode, memo, useMemo } from 'react';
import { RootState } from '../../../../../reduxStore';
import { UserMoneyStatusSection } from '../../../../pageTemplate/header/UserMoneyStatusSection';
import { Avatar } from '../../../../components/Avatar';
import { IUserInfo } from 'apps/gambling/src/app/persistant/IUserInfo';
import { AppLocalStorage } from 'apps/gambling/src/app/persistant/localstorage';
import { AppLocalStorageKey } from 'apps/gambling/src/app/persistant/AppLocalStorageKey';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { appSlice } from 'apps/gambling/src/app/reduxStore/appSlice';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';

export type IGameType =
  | 'Slots'
  | 'Fishing'
  | 'Vivo'
  | 'Viver'
  | 'Arcades'
  | 'Tables';

type IMenuDrawer = {
  className?: string;
  onClickToDownload: () => void;
};

type MinorActivityItem = {
  name: string;
  des: string;
  isFocus: boolean;
  icon: string;
  isShowBadge: boolean;
  onClick?: () => void;
};
const Wrapper = memo(({ children }: { children: ReactNode }) => {
  //解决问题：Menu重渲染导致滚动条置顶
  return (
    <div
      id="TabBarRoot"
      className={cx(
        'w-60 h-screen',
        'py-4 relative overflow-auto',
        'bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-between pb-5 gap-3 items-start ',
        'bg-tab-bar text-[var(--grayscale-100)]'
      )}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      {children}
    </div>
  );
});
export const MenuDrawer = (props: IMenuDrawer) => {
  const {
    onClickToFirstDeposit,
    onClickToInvite,
    onClickToVipGrade,
    onClickToCheckInDaily,
    onClickToActivity,
    onClickToTelegram,
    onClickToCompanyProfile,
    onClickToLicense,
    onClickToWallet,
    onClickToGameRecord,
    onClickToGameHall,
    onClickToSetting,
    onClickToIndex,
    onClickToBoxInvite,
  } = usePageNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const { data: configData } = useGetGlobalConfigQuery(null);
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const vip_level = useSelector((state: RootState) => state.app.vip_level);
  const inNativeApp = useSelector(
    (rootState: RootState) => rootState.app.inNativeApp
  );
  const close = () => {
    const canClose = isMobile || isTablet;
    canClose && dispatch(uiSlice.actions.setOpenMenuDrawer(false));
  };
  const { isShowBoxInvite } = useInviteInCompatible();

  // 账户相关
  const user: IUserInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
  );
  const currentUserVipLevel = vip_level || user.vip_level;

  const DownloadBtnWrapper = styled.div`
    width: 100%;
    // padding-bottom: 56px;
    // padding-left: 16px;
    // padding-right: 16px;

    // PC 之前斷點
    @media (max-width: 1439.99px) {
      // margin-bottom: 15px;
      // padding-bottom: 72px;
    }
  `;

  // 次要活動 Menu 資料
  const minorActivityItem: MinorActivityItem[] = useMemo(() => {
    return [
      {
        name: 'Cassino',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_cassino.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.GameHallPage,
        onClick: () => {
          onClickToGameHall();
        },
      },
      {
        name: 'Conta Carteira',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_conta.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.WalletPage,
        onClick: () => {
          onClickToWallet();
        },
      },
      {
        name: 'Convidar',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_convidar.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.InvitePage,
        onClick: () => {
          if (isShowBoxInvite) {
            onClickToBoxInvite();
          } else {
            onClickToInvite();
          }
        },
      },
      {
        name: 'VIP',
        des: isLogin ? '(Meu nível:VIP' + currentUserVipLevel + ')' : '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_vip.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.VIPGradePage,
        onClick: () => {
          onClickToVipGrade();
        },
      },
      {
        name: 'Check-in Diário',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_check-in.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.DailySignInPage,
        onClick: () => {
          onClickToCheckInDaily();
        },
      },
      {
        name: 'Recarga Cashback',
        des: `${
          configData
            ? configData.data
              ? '+' + configData.data.recharge_first_cashback_rate
              : ''
            : ''
        }`,
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_recarge.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.InitialChargePage,
        onClick: () => {
          onClickToFirstDeposit();
        },
      },
      {
        name: 'Junte-se a nós',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_junte-se.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.TelegramPage,
        onClick: () => {
          onClickToTelegram();
        },
      },
      {
        name: 'Sobre Nós',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_sobre.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.CompanyProfilePage,
        onClick: () => {
          onClickToCompanyProfile();
        },
      },
      {
        name: 'Gaming Curaçao',
        des: '',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_tab_gaming.png`,
        isShowBadge: false,
        isFocus: location.pathname === PageOrModalPathEnum.LicensePage,
        onClick: () => {
          onClickToLicense();
        },
      },
    ];
  }, [isLogin, location.pathname, configData]);

  return (
    <div
      className={cx(
        (isMobile || isTablet) &&
          'fixed left-0 top-0 right-0 bottom-0 w-full h-full',
        props.className
      )}
      onMouseDown={() => {
        console.log('===> close');
        close();
      }}
      onClick={() => {
        /**关闭用户信息弹窗 */
        dispatch(uiSlice.actions.closeUserInfoStatusPopover());
      }}
    >
      <Wrapper>
        <div className="flex flex-col gap-6 justify-center items-center">
          {/* logo */}
          <div className="px-4">
            <CacheImage
              className={'w-auto cursor-pointer'}
              alt={'logo'}
              src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
              onClick={onClickToIndex}
            />
            <hr className="w-auto mt-3 border-0 border-[var(--grayscale-25)] border-b-[1px]" />
          </div>
          <div
            className={cx(' flex-col gap-3 w-full', {
              flex: isLogin,
              hidden: isDesktop && !isLogin,
            })}
          >
            {/* 关闭按钮 */}
            <div className="tablet:hidden flex justify-end pr-[31px]">
              <CacheImage
                className=" w-3 h-3 cursor-pointer"
                alt={'closed'}
                src={`assets/${environment.uVersion}/icon_close.png`}
                onClick={() => {
                  dispatch(uiSlice.actions.setOpenMenuDrawer(false));
                }}
              />
            </div>
            {/* 账号 */}
            {isLogin && (
              <>
                <div className="flex flex-col gap-5 px-4">
                  <div className="flex gap-3 items-center">
                    <div
                      className={cx(
                        'border-popup-button flex-shrink-0 w-14 h-14 p-[2px]',
                        FLEX_CENTER
                      )}
                    >
                      <Avatar className="w-auto h-auto" />
                    </div>
                    <div className="flex">
                      <div className="flex flex-col tablet:text-base text-xs gap-2 font-medium w-4/5">
                        <div>
                          <div className="w-[125px] truncate">
                            {user.nickname}
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[var(--grayscale-70)]">
                              {user.user_id}
                            </span>
                            <CopyIcon
                              btnClassName={
                                'active:opacity-100 sm:hover:opacity-100'
                              }
                              copyText={user.user_id}
                              icon={
                                <div className="w-full h-full group">
                                  <img
                                    alt="cooy"
                                    className="w-4 h-4 ml-1 block group-active:hidden"
                                    src={`assets/${environment.uVersion}/icon_copy.png`}
                                  />
                                  <img
                                    alt="cooy"
                                    className="w-4 h-4 ml-1 hidden group-active:block"
                                    src={`assets/${environment.uVersion}/icon_copy4.png`}
                                  />
                                </div>
                              }
                            />
                          </div>
                        </div>
                        <div
                          className="bg-linear-7-main text-sm w-[84px] h-[22px] py-1 px-[6px]
                  rounded-full text-center font-bold leading-[13px]"
                        >
                          <span className="text-linear3-main">
                            VIP {currentUserVipLevel}
                          </span>
                        </div>
                      </div>
                      {/* 箭头 只在table分辨率显示  */}
                      {/* by odin: 不需要箭頭了, 测试说需要(RX) */}
                      <div
                        className={cx(
                          'relative flex w-1/5 justify-center items-center tablet:hidden cursor-pointer'
                        )}
                        onClick={() => {
                          onClickToSetting();
                        }}
                      >
                        <CacheImage
                          className={'my-auto w-[6.38px] h-[10.15px]'}
                          alt={'arrow'}
                          src={`assets/${environment.uVersion}/icon_arrow_right.png`}
                        />
                      </div>
                    </div>
                  </div>
                  <UserMoneyStatusSection
                    className="gap-1 flex mobile:min-w-[208px] min-w-[188px] h-10 rounded-full 
                        bg-[linear-gradient(91.12deg,#291650_2.13%,#533188_96.22%)]
                        shadow-[0px_0px_4px_0px_#A974FF99_inset] m-0 p-0 px-2"
                    textClassName="truncate text-base"
                  />
                  <div>
                    <button
                      className="linear-4-button border-popup-button tablet:flex hidden gap-1 text-sm w-full h-9
                        rounded-full justify-center items-center font-bold"
                      onClick={() => {
                        // 编辑用户信息
                        onClickToSetting();
                      }}
                    >
                      <CacheImage
                        className="h-1/2"
                        alt={'user'}
                        src={`assets/${environment.uVersion}/icon_vivo.png`}
                      />
                      Editar Perfil
                    </button>
                    <button
                      className="linear-4-button border-popup-button flex gap-1 text-sm w-full h-9 mt-3 
                        rounded-full justify-center items-center font-bold"
                      onClick={() => {
                        onClickToGameRecord();
                      }}
                    >
                      <CacheImage
                        className="h-1/2"
                        alt={'record'}
                        src={`assets/${environment.uVersion}/icon_record.png`}
                      />
                      Recorde de apostas
                    </button>
                  </div>
                </div>
                <hr className="w-auto mt-3 border-0 border-[var(--grayscale-25)] border-b-[1px] tablet:block hidden" />
              </>
            )}
          </div>
          {/* 礼包 */}
          <button
            className="linear-3-button relative flex w-52 h-12 justify-between items-center
            rounded-lg shadow-[0px_0px_8px_0px_#FFFFFF_inset,0px_4px_4px_0px_#00000040]"
            onClick={() => {
              onClickToActivity();
            }}
          >
            <span className="text-xl ml-6 font-bold drop-shadow-[0px_4px_4px_#00000040]">
              Eventos
            </span>
            <img
              className="w-[67px] h-[54px] mr-2"
              src={`assets/${environment.uVersion}/icon_group.png`}
              alt="group"
            />
            <ActivityBadge
              className={cx(
                'absolute -right-1 -top-1',
                'bg-[var(--state-error-main)] ',
                'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                'w-4 h-4'
              )}
            />
          </button>
          {/* item选项 */}
          <div className={'flex flex-col w-full font-medium'}>
            {minorActivityItem.map((item, index) => {
              return (
                <MenuDrawerItem
                  key={index}
                  className=""
                  item={item.name}
                  des={item.des}
                  isFocus={item.isFocus}
                  icon={item.icon}
                  onClick={() => {
                    item.onClick && item.onClick();
                    close();
                  }}
                  badge={
                    item.isShowBadge && (
                      <ActivityBadge
                        className={cx(
                          'bg-[var(--state-error-main)] ',
                          'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                          '-mr-1 -mt-1 w-4 h-4'
                        )}
                      />
                    )
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full px-4">
          <DownloadBtnWrapper>
            {!inNativeApp && (
              <MenuDrawerDonItem
                item={'Baixar APP'}
                id={'DownloadSimple'}
                className={
                  'linear-4-button border-popup-button flex flex-row justify-center gap-1 text-sm w-full px-4 rounded-full font-bold'
                }
                icon={`assets/${environment.uVersion}/icon_download.png`}
                defIcon={`assets/${environment.uVersion}/icon_favoritos.png`}
                onClick={() => {
                  props.onClickToDownload();
                }}
              />
            )}
          </DownloadBtnWrapper>
          {isLogin && (
            <button
              className="border-popup-button flex flex-row gap-1 text-sm w-full h-9 px-4 rounded-full 
                  hover:bg-[var(--transparent-white-10)] active:bg-[var(--transparent-white-20)]
                  justify-center items-center font-bold"
              onClick={(e) => {
                e.preventDefault();
                dispatch(appSlice.actions.showMobileLogoutModal(true));
              }}
            >
              <img
                alt="signOut"
                className="ml-2 w-5 h-5"
                src={`assets/${environment.uVersion}/icon_sign-out.png`}
              />
              Sair
            </button>
          )}
        </div>
      </Wrapper>
    </div>
  );
};
