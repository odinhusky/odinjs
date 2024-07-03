import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import styled from 'styled-components';
import { gameSlice } from '../../../../../reduxStore/gameSlice';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { twMerge } from 'tailwind-merge';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useDispatch, useSelector } from 'react-redux';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { CloseICON } from '../../../../components-bs/env/u1/CloseICON';
import { RootState } from '../../../../../reduxStore';
import { useScrollToPartPageTemplate } from '../../../../pageTemplate/hooks/useScrollToPartPageTemplate';
import { environment } from '../../../../../../environments/environment';
import { MenuDrawerItem } from './MenuDrawerItem';
import { MenuDrawerDonItem } from './MenuDrawerDonItem';
import { MenuDrawerGenieItem } from './MenuDrawerGenieItem';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { ActivityBadge } from '../../../../components/Badge/ActivityBadge';
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
export const MenuDrawer = (props: IMenuDrawer) => {
  const {
    onClickToFirstDeposit,
    onClickToDepositCashback,
    onClickToInvite,
    onClickToVipGrade,
    onClickToCheckInDaily,
    onClickToTelegram,
    onClickToCompanyProfile,
    onClickToLicense,
    onClickToIndex,
    onClickToActivity,
    onClickToBoxInvite,
  } = usePageNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isMobile, isDesktop, isTablet } = useBreakpoint();

  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );
  const label = useSelector((state: any) => state.gameList.label);

  const close = () => {
    const canClose = isMobile || isTablet;
    canClose && dispatch(uiSlice.actions.setOpenMenuDrawer(false));
  };

  const Wraaper = styled.div`
    height: calc(${document.body.clientHeight}px - 72px);
    overflow-y: auto;
    width: 248px;
  `;
  const { scrollToWindowTop } = useScrollToPartPageTemplate();
  const { isShowBoxInvite } = useInviteInCompatible();
  return (
    <div
      className={twMerge(
        (isMobile || isTablet) &&
          'bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 w-full h-full',
        props.className
      )}
      // NOTE: onclick 改用，避免拖拉文字到modal外層會直接關閉
      onMouseDown={() => {
        // NOTE: 手機版用戶會誤點
        close();
      }}
    >
      <Wraaper
        id="TabBarRoot"
        // NOTICE: cx->twMerge 下面 bg 會失效 (refactor me)
        className={cx(
          'w-[248px]',
          // (isMobile) && `h-[calc(100dvh-72px)]`,
          // (isTablet) && "h-[calc(100dvh-72px)]",
          // (isDesktop) && "h-[calc(100dvh-72px)]",
          // (isTablet||isDesktop) && "h-full",
          // "bg-[linear-gradient(90deg,_#262626_50%,#333333_100%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-between pb-5 gap-3 items-start overflow-auto",
          'bg-[linear-gradient(90deg,var(--background-tabbar-from),var(--background-tabbar-to))] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-between pb-5 gap-3 items-start overflow-auto',
          'relative'
        )}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {!isDesktop && (
          <div
            className={'absolute right-3 top-3'}
            onClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            }}
          >
            <CloseICON />
          </div>
        )}

        {/*NOTICE: refactor me*/}
        <div
          className={twMerge(
            'w-full flex flex-col items-start gap-3',
            isDesktop && 'pt-7',
            isTablet && 'pt-[72px]',
            isMobile && 'pt-[64px]'
          )}
        >
          <MenuDrawerGenieItem
            title={'Primeira recarga'}
            subTitle={`+${recharge_first_cashback_rate}`}
            className={`border-solid shadow-[0px_2px_4px_-1px_rgba(0,_0,_0,_0.06),_0px_4px_6px_-1px_rgba(0,_0,_0,_0.1)] overflow-hidden bg-[var(--background-tabbar-to)] flex flex-row justify-between pl-3 gap-2 items-start border rounded-lg hover:bg-[var(--grayscale-30)]
            ${
              location.pathname === PageOrModalPathEnum.InitialChargePage
                ? 'border-[var(--primary-main)] border-[2px] bg-[var(--grayscale-30)]'
                : 'border-[var(--grayscale-20)]'
            }`}
            icon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_recarga.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_recarga.png`}
            onClick={() => {
              onClickToFirstDeposit();
              close();
            }}
          />

          <MenuDrawerGenieItem
            title={'Recarregar'}
            subTitle={`Cashback+${recharge_cashback_rate}`}
            className={`border-solid shadow-[0px_2px_4px_-1px_rgba(0,_0,_0,_0.06),_0px_4px_6px_-1px_rgba(0,_0,_0,_0.1)] overflow-hidden bg-[var(--background-tabbar-to)] flex flex-row justify-between pl-3 gap-2 items-start border rounded-lg hover:bg-[var(--grayscale-30)]
            ${
              location.pathname === PageOrModalPathEnum.RechargeActivityPage
                ? 'border-[var(--primary-main)] border-[2px] bg-[var(--grayscale-30)]'
                : 'border-[var(--grayscale-20)]'
            }`}
            icon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`}
            onClick={() => {
              onClickToDepositCashback();
              close();
            }}
          />

          {/*<div className={"w-full flex flex-col px-5"}>*/}
          {/*  <button*/}
          {/*    className="border-solid border-[var(--grayscale-30)] shadow-[0px_2px_4px_-1px_rgba(0,_0,_0,_0.06),_0px_4px_6px_-1px_rgba(0,_0,_0,_0.1)] overflow-hidden bg-[#333333] flex flex-row justify-between pl-3 gap-0 items-start border rounded-lg"*/}
          {/*    onClick={() => {*/}
          {/*      onClickToDepositCashback();*/}
          {/*      close();*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <div className="flex flex-col mt-px items-start">*/}
          {/*      <div className="text-sm font-medium leading-[20px] text-white">*/}
          {/*        Bônus de suporte*/}
          {/*      </div>*/}
          {/*      <div className="font-medium leading-[24px] text-white">*/}
          {/*        diário de perdaa*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <img*/}
          {/*      src={tabThree}*/}
          {/*      className="w-20 mt-0 mb-[-38px]"*/}
          {/*    />*/}
          {/*  </button>*/}
          {/*</div>*/}

          <div className={'w-full flex flex-col px-5'}>
            <div className="opacity-50 bg-gradient-to-r from-transparent via-white to-transparent h-px"></div>
          </div>

          <MenuDrawerItem
            item={'Recomendar'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_thumbsup.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Regras VIP'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_crownsimple.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToVipGrade();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Check-In'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_calendarcheck.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToCheckInDaily();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Eventos'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_activity.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToActivity();
              close();
            }}
            badge={<ActivityBadge className={'-ml-2'} />}
          />

          <MenuDrawerItem
            item={'Adicionar Telegrama'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_users.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToTelegram();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Sobre Nós'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_buildings.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToCompanyProfile();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Gaming Curaçao'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_files.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToLicense();
              close();
            }}
          />

          <div className={'w-full flex flex-col px-5'}>
            <div className={'w-full flex flex-col px-5'}>
              <div className="opacity-50 bg-gradient-to-r from-transparent via-white to-transparent h-px"></div>
            </div>
          </div>

          {label.map((item: IGameType) => {
            return (
              <MenuDrawerItem
                item={item}
                className={
                  'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
                }
                icon={`assets/${environment.uVersion}/${
                  environment.mVersion
                }/icon_${item.toLowerCase()}.png`}
                defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
                onClick={() => {
                  onClickToIndex();
                  dispatch(
                    gameSlice.actions.setIndexPagecurrentSelectLabel(item)
                  );
                  scrollToWindowTop();
                  close();
                }}
              />
            );
          })}

          <div className={'w-full flex flex-col px-5'}>
            <div className="opacity-50 bg-gradient-to-r from-transparent via-white to-transparent h-px"></div>
          </div>

          <MenuDrawerItem
            item={'Favoritos'}
            className={
              'flex flex-row gap-3 items-start px-4 py-2 hover:bg-[var(--grayscale-30)] hover:rounded-lg text-[var(--grayscale-70)] hover:text-[rgb(255,255,255)]'
            }
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToIndex();
              dispatch(
                gameSlice.actions.setIndexPagecurrentSelectLabel('Favoritos')
              );
              scrollToWindowTop();
              close();
            }}
          />
        </div>

        <MenuDrawerDonItem
          item={'Download'}
          id={'DownloadSimple'}
          className={
            'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)] flex flex-row justify-center pt-2 gap-3 w-full h-10 items-start rounded-lg'
          }
          icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_download.png`}
          defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
          onClick={() => {
            props.onClickToDownload();
          }}
        />
      </Wraaper>
    </div>
  );
};
