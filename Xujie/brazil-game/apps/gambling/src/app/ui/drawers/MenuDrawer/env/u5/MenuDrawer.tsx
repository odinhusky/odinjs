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
import { MenuDrawerCellTitle } from './MenuDrawerCellTitle';
import { MenuDrawerGameItem } from './MenuDrawerGameItem';
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
  const { recharge_first_cashback_rate, recharge_cashback_rate } = useSelector(
    (rootState: RootState) => rootState.app.config
  );

  const close = () => {
    const canClose = isMobile || isTablet;
    canClose && dispatch(uiSlice.actions.setOpenMenuDrawer(false));
  };

  const label = useSelector((state: any) => state.gameList.label);
  // 80px 扣掉最上方 Header Bar 的高度
  const Wraaper = styled.div`
    height: ${document.body.clientHeight}px;
    overflow-y: auto;
    width: 240px;
    scrollbar-width: none;

    @media (min-width: 1440px) {
      height: calc(${document.body.clientHeight}px - 80px);
    }
  `;

  const DownloadBtnWrapper = styled.div`
    width: 100%;
    margin-bottom: 72px;

    @media (min-width: 768px) {
      margin-bottom: 0px;
    }
  `;
  const { scrollToWindowTop } = useScrollToPartPageTemplate();
  const inNativeApp = useSelector(
    (rootState: RootState) => rootState.app.inNativeApp
  );

  return (
    <div
      className={twMerge(
        (isMobile || isTablet) &&
          'bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 w-full h-full',
        // 'grid grid-cols-2',
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
          // 'hidden',
          'bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-between pb-5 gap-3 items-start overflow-auto',
          'bg-tab',
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
          className={cx(
            'w-full flex flex-col items-start gap-3',
            isDesktop && 'pt-[16px]',
            isTablet && 'pt-[32px]',
            isMobile && 'pt-[64px]'
          )}
        >
          <MenuDrawerCellTitle title={'Desconto'} />

          <MenuDrawerGenieItem
            title={'Primeira recarga'}
            subTitle={`+${recharge_first_cashback_rate}`}
            className={cx(
              'overflow-hidden flex flex-row justify-between pl-3 gap-2 items-start',
              'bg-linear-4-main'
            )}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/menu_btn_recarga.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/menu_btn_recarga.png`}
            isActivePage={
              location.pathname === PageOrModalPathEnum.InitialChargePage
            }
            onClick={() => {
              onClickToFirstDeposit();
              close();
            }}
          />

          <MenuDrawerGenieItem
            title={'Recarregar'}
            subTitle={`Cashback+${recharge_cashback_rate}`}
            className={cx(
              'overflow-hidden flex flex-row justify-between pl-3 gap-2 items-start',
              'bg-linear-5-main'
            )}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/menu_btn_cashback.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/menu_btn_cashback.png`}
            isActivePage={
              location.pathname === PageOrModalPathEnum.RechargeActivityPage
            }
            onClick={() => {
              onClickToDepositCashback();
              close();
            }}
          />

          {/*<MenuDrawerGenieItem*/}
          {/*  title={'Bônus de suporte'}*/}
          {/*  subTitle={`diário de perdas`}*/}
          {/*  className={cx(*/}
          {/*    'overflow-hidden flex flex-row justify-between pl-3 gap-2 items-start',*/}
          {/*    'bg-linear-6-main',*/}
          {/*  )}*/}
          {/*  icon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`}*/}
          {/*  defIcon={`assets/${environment.uVersion}/${environment.mvVersion}/menu_btn_cashback.png`}*/}
          {/*  onClick={() => {*/}
          {/*    // TODO*/}
          {/*    close();*/}
          {/*  }}*/}
          {/*/>*/}

          <MenuDrawerCellTitle title={'Atividade'} />

          <MenuDrawerItem
            item={'Recomendar'}
            className={'flex flex-row gap-3 items-start py-2 '}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_thumbsup.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Regras VIP'}
            className={'flex flex-row gap-3 items-start py-2 '}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_crownsimple.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToVipGrade();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Check-In'}
            className={'flex flex-row gap-3 items-start py-2 '}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_calendarcheck.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToCheckInDaily();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Eventos'}
            className={'flex flex-row gap-3 items-start py-2 '}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_eventos.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToActivity();
              close();
            }}
            badge={
              <ActivityBadge
                className={cx(
                  'bg-[var(--state-error-main)] ',
                  'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                  'mr-4'
                )}
              />
            }
          />

          <MenuDrawerItem
            item={'Adicionar Telegrama'}
            className={'flex flex-row gap-3 items-start py-2'}
            textClassName={'mr-0'}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_users.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToTelegram();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Sobre Nós'}
            className={'flex flex-row gap-3 items-start py-2 '}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_buildings.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToCompanyProfile();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Gaming Curaçao'}
            className={'flex flex-row gap-3 items-start py-2'}
            icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_files.png`}
            defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
            onClick={() => {
              onClickToLicense();
              close();
            }}
          />

          <MenuDrawerItem
            item={'Favoritos'}
            className={'flex flex-row gap-3 items-start py-2'}
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

          <MenuDrawerCellTitle title={'Jogos'} />

          <div className={cx('grid grid-cols-3 gap-2 px-5 w-full mb-6')}>
            {label.map((item: IGameType, index: number) => {
              return (
                <MenuDrawerGameItem
                  item={item}
                  index={index}
                  className={cx(
                    'flex justify-center items-center aspect-square'
                  )}
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
          </div>
        </div>

        <DownloadBtnWrapper>
          {!inNativeApp && (
            <MenuDrawerDonItem
              item={'Download'}
              id={'DownloadSimple'}
              className={
                'flex flex-row justify-center gap-3 w-full h-10 items-start rounded-full menu_drawer_download_btn'
              }
              icon={`assets/${environment.uVersion}/${environment.mVersion}/icon_download.png`}
              defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
              onClick={() => {
                props.onClickToDownload();
                close();
              }}
            />
          )}
        </DownloadBtnWrapper>
      </Wraaper>

      {/*<div className={cx(*/}
      {/*  'text-white flex justify-center w-[20px] items-center',*/}
      {/*)}>*/}
      {/*  <button*/}
      {/*    className={cx('h-[40px] w-[20px]', 'bg-[var(--grayscale-20)] rounded-br-[4px] rounded-tr-[4px]')}*/}
      {/*    onClick={() => {*/}
      {/*      // close()*/}
      {/*      dispatch(uiSlice.actions.setOpenMenuDrawer(false))*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <CacheImage*/}
      {/*      alt={'tab-icon'}*/}
      {/*      src={`assets/${environment.uVersion}/${environment.mVersion}/icon_download.png`}*/}
      {/*      className={cx('w-[8px] h-[16px]')}*/}
      {/*      onError={(e: SyntheticEvent<HTMLImageElement>) => {*/}
      {/*        e.currentTarget.style.visibility = 'hidden'*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
};
