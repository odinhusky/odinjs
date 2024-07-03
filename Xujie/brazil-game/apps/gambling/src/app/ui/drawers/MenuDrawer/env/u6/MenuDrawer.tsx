import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import styled from 'styled-components';
import { gameSlice } from '../../../../../reduxStore/gameSlice';
import { useLocation } from 'react-router';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useDispatch, useSelector } from 'react-redux';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { useScrollToPartPageTemplate } from '../../../../pageTemplate/hooks/useScrollToPartPageTemplate';
import { environment } from '../../../../../../environments/environment';
import { MenuDrawerItem } from './MenuDrawerItem';
import { MenuDrawerDonItem } from './MenuDrawerDonItem';
import { MenuDrawerGenieItem } from './MenuDrawerGenieItem';
import { MenuDrawerCellTitle } from './MenuDrawerCellTitle';
import { MenuDrawerGameItem } from './MenuDrawerGameItem';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { ActivityBadge } from '../../../../components/Badge/ActivityBadge';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';
import cx from '../../../../utils/cx';
import { CacheImage } from '../../../../components/image/CacheImage';
import { useGetGlobalConfigQuery } from '../../../../../external';
import { useMemo } from 'react';
import { RootState } from '../../../../../reduxStore';

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
type MajorActivityItem = {
  title: string;
  subTitle: string;
  className: string;
  icon: string;
  defIcon: string;
  isFocus: boolean;
  onClick?: () => void;
};

type MinorActivityItem = {
  name: string;
  className: string;
  icon: string;
  isShowBadge: boolean;
  onClick?: () => void;
};

export const MenuDrawer = (props: IMenuDrawer) => {
  const {
    onClickToFirstDeposit,
    onClickToDepositCashback,
    onClickToInvite,
    onClickToVipGrade,
    onClickToCheckInDaily,
    onClickToActivity,
    onClickToTelegram,
    onClickToCompanyProfile,
    onClickToLicense,
    onClickToIndex,
    onClickToBoxInvite,
  } = usePageNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const { isShowBoxInvite } = useInviteInCompatible();
  const { data: configData } = useGetGlobalConfigQuery(null);
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const inNativeApp = useSelector(
    (rootState: RootState) => rootState.app.inNativeApp
  );
  const { scrollToCarousel } = useScrollToPartPageTemplate();
  const close = () => {
    const canClose = isMobile || isTablet;
    canClose && dispatch(uiSlice.actions.setOpenMenuDrawer(false));
  };
  const label = useSelector((state: any) => state.gameList.label);

  const Wraaper = styled.div`
    //height: calc(${document.body.clientHeight}px - 56px);
    height: calc(${document.body.clientHeight}px);
    overflow-y: auto;
    width: 240px;
    scrollbar-width: none;

    // PC 之前斷點
    @media (max-width: 1439.99px) {
      // height: calc(${document.body.clientHeight}px - 72px);
    }
  `;

  const DownloadBtnWrapper = styled.div`
    width: 100%;
    padding-bottom: 56px;
    padding-left: 16px;
    padding-right: 16px;

    // PC 之前斷點
    @media (max-width: 1439.99px) {
      margin-bottom: 15px;
      padding-bottom: 72px;
    }
  `;

  // 主要活動 Menu 資料
  const majorActivityItem: MajorActivityItem[] = useMemo(() => {
    return [
      {
        title: 'Primeira recarga',
        subTitle: `+${configData?.data?.recharge_first_cashback_rate}`,
        className: cx(''),
        icon: `assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_recarga.png`,
        defIcon: `assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_recarga.png`,
        isFocus: location.pathname === PageOrModalPathEnum.InitialChargePage,
        onClick: () => {
          onClickToFirstDeposit();
        },
      },
      {
        title: 'Recarregar',
        subTitle: `Cashback+${configData?.data?.recharge_cashback_rate}`,
        className: cx(''),
        icon: `assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`,
        defIcon: `assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`,
        isFocus: location.pathname === PageOrModalPathEnum.RechargeActivityPage,
        onClick: () => {
          onClickToDepositCashback();
        },
      },
    ];
  }, [isLogin, location.pathname, configData]);

  // 次要活動 Menu 資料
  const minorActivityItem: MinorActivityItem[] = useMemo(() => {
    return [
      {
        name: 'Recomendar',
        className: 'bg-linear-1-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_recomendar.png`,
        isShowBadge: false,
        onClick: () => {
          if (isShowBoxInvite) {
            onClickToBoxInvite();
            dispatch(uiSlice.actions.setIsBackToBoxPage(true));
          } else {
            onClickToInvite();
          }
        },
      },
      {
        name: 'Eventos',
        className: 'bg-linear-3-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_eventos.png`,
        isShowBadge: true,
        onClick: () => {
          onClickToActivity();
        },
      },
      {
        name: 'Regras VIP',
        className: 'bg-linear-2-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_vip.png`,
        isShowBadge: false,
        onClick: () => {
          onClickToVipGrade();
        },
      },
      {
        name: 'Check-In',
        className: 'bg-linear-5-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_calendarcheck.png`,
        isShowBadge: false,
        onClick: () => {
          onClickToCheckInDaily();
        },
      },
      {
        name: 'Sobre Nós',
        className: 'bg-linear-4-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_about_us.png`,
        isShowBadge: false,
        onClick: () => {
          onClickToCompanyProfile();
        },
      },
      {
        name: 'Gaming Curaçao',
        className: 'bg-linear-6-main',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_curacao.png`,
        isShowBadge: false,
        onClick: () => {
          onClickToLicense();
        },
      },
      {
        name: 'Adicionar Telegrama',
        className: 'linear-1-button col-span-2',
        icon: `assets/${environment.uVersion}/${environment.mVersion}/item_menu_telegram.png`,
        isShowBadge: false,
        onClick: () => {
          onClickToTelegram();
        },
      },
    ];
  }, [isLogin, isShowBoxInvite]);

  // 遊戲類型 Menu 資料
  const gameItems = useMemo(() => {
    return [...label, 'Favoritos'];
  }, [label]);

  return (
    <div
      className={cx(
        (isMobile || isTablet) &&
          'bg-[var(--transparente-gray-60)] fixed left-0 top-0 right-0 bottom-0 w-full h-full',
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
      <Wraaper
        id="TabBarRoot"
        className={cx(
          'py-4 relative overflow-auto',
          'bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-between pb-5 gap-3 items-start ',
          'bg-gradient-to-r from-[var(--grayscale-25)] to-[var(--grayscale-25)]'
        )}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <CacheImage
          className={cx(
            'absolute right-4 top-4 w-8 h-8 cursor-pointer hover:opacity-70',
            isDesktop ? 'hidden' : 'visible'
          )}
          alt={'closed'}
          src={`assets/${environment.uVersion}/ic_closed.png`}
          onClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(false));
          }}
        />

        <div
          className={cx(
            'w-full flex flex-col items-start gap-2',
            isTablet || isMobile ? 'mt-4' : ''
          )}
        >
          {/* 主要活動 Menu */}
          <div className={'w-full grid grid-cols-1 gap-2 px-4'}>
            <MenuDrawerCellTitle className={'my-2'} title={'Desconto'} />

            {majorActivityItem.map((item) => {
              return (
                <MenuDrawerGenieItem
                  title={item.title}
                  subTitle={item.subTitle}
                  className={item.className}
                  icon={item.icon}
                  defIcon={item.defIcon}
                  isActivePage={item.isFocus}
                  onClick={() => {
                    item.onClick && item.onClick();
                    close();
                  }}
                />
              );
            })}
          </div>

          {/* 次要活動 Menu title*/}
          <MenuDrawerCellTitle
            className={'col-span-2 mt-2 px-4'}
            title={'Atividade'}
          />
        </div>

        <div className={'relative overflow-auto w-full h-full'}>
          {/* 次要活動 Menu */}
          <div className={'w-full grid grid-cols-2 gap-2 py-2 px-4'}>
            {minorActivityItem.map((item) => {
              return (
                <MenuDrawerItem
                  item={item.name}
                  className={item.className}
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

          {/* 遊戲類型展示 */}
          <div className={'w-full grid grid-cols-2 gap-2 px-4'}>
            <MenuDrawerCellTitle
              className={'col-span-2 my-2'}
              title={'Jogos'}
            />

            {gameItems.map((item: IGameType) => {
              return (
                <MenuDrawerGameItem
                  item={item}
                  className={cx('flex justify-center items-center')}
                  icon={`assets/${environment.uVersion}/${
                    environment.mVersion
                  }/icon_${item.toLowerCase()}.png`}
                  defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
                  onClick={() => {
                    onClickToIndex();
                    dispatch(
                      gameSlice.actions.setIndexPagecurrentSelectLabel(item)
                    );
                    scrollToCarousel();
                    close();
                  }}
                />
              );
            })}
          </div>
        </div>

        <DownloadBtnWrapper>
          {!inNativeApp && (
            <MenuDrawerDonItem
              item={'Download'}
              id={'DownloadSimple'}
              className={'flex flex-row justify-center gap-3 w-full px-4'}
              icon={`assets/${environment.uVersion}/icon_download.png`}
              defIcon={`assets/${environment.uVersion}/icon_favoritos.png`}
              onClick={() => {
                props.onClickToDownload();
              }}
            />
          )}
        </DownloadBtnWrapper>
      </Wraaper>
    </div>
  );
};
