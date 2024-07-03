import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { PageOrModalPathEnum } from '../../../../../PageOrModalPathEnum';
import { IRLevelButton } from './index';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { JackpotMap } from '../../../index';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import {
  GetUserVIPAllInfoResponse,
  GetVIPInfoResponse,
} from '../../../../../../external/UserEndpoint';
import { GetPunchInConfigResponse } from '../../../../../../external/PunchInEndpoint';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { BackNavigation } from '../../../../../components-bs/BackNavigation/BackNavigation';
import { PageContainer } from '../../../../../components-bs/PageContainer';
import { ProgressBar } from '../../../../../components-bs/ProgressBar';
import { VIPButtonList } from './VIPButtonList';
import { useScrollSelectFixCenter } from '../../../../../hooks/useScrollSelectFixCenter';
import { clampNumber, formatLocaleMoney } from '../../../../../utils/format';
import { Banner } from '../../../../../components/Banner';
import { useVIPGradePage } from '../../../hook/useVIPGradePage';

export const LevelListBottomBr = styled.div`
  height: 1rem;
  background: linear-gradient(180deg, transparent 0%, #793fdb 100%);
  box-shadow: 0 -1px rgba(255, 255, 255, 0.1) inset,
    0 0.03rem 0.08rem rgba(0, 0, 0, 0.3);
  padding-bottom: 0;
`;

const vips: number[] = [];

for (let i = 0; i <= 25; i += 1) {
  vips.push(i);
}

const ItemContainer = styled.div.attrs((props) => ({
  className: cx(
    'rounded-xl px-5 py-4 mb-3 text-white text-base',
    props.className
  ),
}))`
  //width: 100%;
  //margin: 0 auto 0.3rem;
  //border-radius: 0.2rem;
  //padding: 0 0.6rem 0 2rem;
  //box-sizing: border-box;
  //position: relative;
  //z-index: 1;
  //height: 1.2rem;
  //display: flex;
  //align-items: center;
  background: var(--medium);
  border-radius: 16px;
`;

const Container = styled.div`
  //    no-repeat center top/100%,
  //  #e55b69;
  //background-color: #287052;
  background-color: rgba(40, 112, 82, 0.1);
  background-size: 100% 100%;
`;

interface IVIPGradeMobileTemplateProps {
  userVIPInfo?: GetVIPInfoResponse;
  allLevelInfo: GetUserVIPAllInfoResponse['data'];
  allSignInConfig: GetPunchInConfigResponse['data']['signInAllConfig'];
}

const VIPTitle = styled.button.attrs<{
  className?: string;
}>((props) => ({
  className: props.className,
}))`
  background: -webkit-linear-gradient(
    -90deg,
    var(--dashboard-block3-gradient-from) 0%,
    var(--dashboard-block3-gradient-to) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const VIPLabel = styled.div`
  width: 160px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  //box-shadow: inset 0 0 36px 5px rgba(255, 219, 0, 0.09);
  border-radius: 30px;
  border: none; /* 取消边框 */
  color: var(--dashboard-block3);
  float: right;
  font-weight: bold;
  background: linear-gradient(
    180deg,
    var(--dashboard-block3-gradient-from) 0%,
    var(--dashboard-block3-gradient-to) 100%
  );
  // background: url("assets/${environment.uVersion}/vip_di.png") no-repeat center;
`;

const VIPGradePageMobileTemplate = ({
  userVIPInfo,
  allLevelInfo,
  allSignInConfig,
}: IVIPGradeMobileTemplateProps) => {
  // const user = AppLocalStorage.getItem("userInfo") ? JSON.parse(AppLocalStorage.getItem("userInfo") || ""): {};
  // const vip_level = useSelector((state: RootState) => state.app?.userStore?.userinfo?.vip_level)
  const vip_level = useSelector((state: RootState) => state.app?.vip_level);

  const [currentSelectedLevel, setCurrentSelectedLevel] = useState(vip_level);
  const [currentLevel, setCurrentLevel] = useState(vip_level);
  useEffect(() => {
    setCurrentLevel(vip_level);
  }, [vip_level]);

  const navigate = useNavigate();
  const { onClickToWallet } = usePageNavigate();
  const currentLevelInfo = allLevelInfo?.find(
    (info) => info.level === currentSelectedLevel
  );

  const vipConfig = allSignInConfig?.find(
    (config) =>
      config.identifier.split('::')[2].replace('V', '') ===
      `${currentSelectedLevel}`
  );

  const dayConfigs = JSON.parse(vipConfig?.value || '[]');

  const signBonus = dayConfigs?.reduce(
    (acc: number, current: { cashback: number }) => acc + current.cashback,
    0
  );

  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const internalBannerRes = isMobile
    ? 'internal_banner_vip_m.png'
    : isTablet
    ? 'internal_banner_vip_t.png'
    : undefined;
  const progressIndicatorStyle =
    'linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))';
  const { selectedVIP, setSelectedVIP } = useVIPGradePage(
    currentLevel,
    userVIPInfo?.data.vip_score
  );
  const { scrollWrapperRef } = useScrollSelectFixCenter(selectedVIP, false);

  useEffect(() => {
    // console.log("====> currentSelectedLevel" , currentSelectedLevel, userVIPInfo?.data.vip_score)
    setSelectedVIP(currentSelectedLevel);
  }, [currentSelectedLevel]);

  return (
    <PageContainer>
      <BackNavigation
        onClick={() => navigate(PageOrModalPathEnum.IndexPage)}
        title={
          isMobile && (
            <div className={'w-full font-bold text-center'}>Centro VIP</div>
          )
        }
      />

      {/*vip Banner*/}
      {internalBannerRes && (
        <Banner
          imgClassName={`rounded-lg mb-4 md:mb-8 mt-6`}
          src={`assets/${environment.uVersion}/${environment.mvVersion}/${internalBannerRes}`}
          bannerText={
            <div
              className={
                'absolute left-[5%] top-1/2 transform -translate-y-1/2 font-bold'
              }
            >
              <div className={'text-white text-[3vw]'}>PREMIO UPGRADE VIP</div>
              <div className={'text-white text-[3vw]'}>
                SO ESPERANDO VOCE COLETAR
              </div>
            </div>
          }
        />
      )}

      <div
        className={cx(
          'border border-[var(--main-primary-main)]',
          'rounded-xl',
          'py-8 px-3',
          'bg-gradient-to-b from-[#013E42CC] to-[#013E42CC]'
        )}
      >
        <section
          className={
            'mb-10 text-center text-base font-bold text-white md:text-2xl'
          }
        >
          <div className="flex items-center justify-center">
            {' '}
            {/* 使用 justify-center 来水平居中 */}
            <VIPLabel className={'mr-3'}>VIP {currentLevel}</VIPLabel>
            <VIPTitle>INTRODUCAO AO NIVEL VIP</VIPTitle>
          </div>
        </section>

        <section>
          <div
            style={{ scrollbarWidth: 'none' }}
            className={cx(
              'w-full mt-2 px-2 overflow-auto flex gap-2 items-center relative'
            )}
            ref={scrollWrapperRef}
          >
            <VIPButtonList
              selectedVIP={selectedVIP}
              currentVIP={currentLevel}
              onSelect={(vip) => setCurrentSelectedLevel(vip)}
            />
          </div>
        </section>

        <section className={'mb-4'}>
          <section
            className={
              'mb-4 text-center text-lg font-bold text-[var(--primary-main-from)]'
            }
          >
            — DISTÂNCIA PRÓXIMO NÍVEL —
          </section>

          <ItemContainer className={'flex flex-col text-left md:text-center'}>
            <div className="mb-1">
              Quantidade total de recarga: R$
              {userVIPInfo?.data?.vip_score
                ? formatLocaleMoney(userVIPInfo?.data?.vip_score / 100)
                : 0}
              /R$
              {userVIPInfo?.data?.next_level_score
                ? formatLocaleMoney(
                    allLevelInfo[selectedVIP]?.rechargeAmountLimit / 100
                  )
                : 0}
            </div>

            <div className={'progress-button flex flex-row items-center'}>
              <ProgressBar
                className="bg-[var(--drawer-bg)] mx-2 h-7"
                rounded="rounded-full"
                progress={
                  (userVIPInfo?.data?.vip_score || 0) /
                  100 /
                  (allLevelInfo[selectedVIP]?.rechargeAmountLimit / 100 || 1)
                }
                progressColor={progressIndicatorStyle}
              >
                <div
                  className={
                    'relative px-4 h-full mt-0.5 items-center text-[var(--text-progress)] text-right'
                  }
                >
                  <div>
                    {clampNumber(
                      ((userVIPInfo?.data?.vip_score || 0) /
                        100 /
                        (allLevelInfo[selectedVIP]?.rechargeAmountLimit / 100 ||
                          1)) *
                        100,
                      0,
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              </ProgressBar>

              <div className={'shrink-0'}>
                <IRLevelButton
                  className="text-base px-8 py-2"
                  onClick={() => onClickToWallet({ panelType: 'deposit' })}
                >
                  <span className={'text-[#247855] font-bold'}>IR</span>
                </IRLevelButton>
              </div>
            </div>
          </ItemContainer>

          <ItemContainer className={'flex flex-col text-left md:text-center'}>
            <div className="mb-1">
              Número total de apostas: R$
              {userVIPInfo?.data?.flow
                ? formatLocaleMoney((userVIPInfo?.data?.flow || 0) / 100)
                : 0}
              /R$
              {userVIPInfo?.data?.next_level_flow
                ? formatLocaleMoney(allLevelInfo[selectedVIP]?.flowLimit / 100)
                : 0}
            </div>

            <div className={'progress-button flex flex-row items-center'}>
              <ProgressBar
                className="bg-[var(--drawer-bg)] mx-2 h-7"
                rounded="rounded-full"
                progress={
                  (userVIPInfo?.data?.flow || 0) /
                  100 /
                  (allLevelInfo[selectedVIP]?.flowLimit / 100 || 1)
                }
                progressColor={progressIndicatorStyle}
              >
                <div
                  className={
                    'relative px-4 h-full mt-0.5 items-center text-[var(--text-progress)] text-right'
                  }
                >
                  <div>
                    {clampNumber(
                      ((userVIPInfo?.data?.flow || 0) /
                        100 /
                        (allLevelInfo[selectedVIP]?.flowLimit / 100 || 1)) *
                        100,
                      0,
                      100
                    ).toFixed(0)}
                    %
                  </div>
                </div>
              </ProgressBar>

              <div className={'shrink-0'}>
                <IRLevelButton
                  className="text-base px-8 py-2"
                  onClick={() => navigate(PageOrModalPathEnum.IndexPage)}
                >
                  <span className={'text-[#247855] font-bold'}>IR</span>
                </IRLevelButton>
              </div>
            </div>
          </ItemContainer>
        </section>

        <section className={'mb-4 text-center'}>
          <section className={'mb-4 text-center text-lg font-bold text-white'}>
            — PRIVILÉGIO —
          </section>

          {currentSelectedLevel >= 20 && (
            <ItemContainer className="flex flex-col items-center justify-center">
              <img
                alt="jackpot"
                src={`assets/${environment.uVersion}/${JackpotMap[currentSelectedLevel].image}`}
              />
              <div className="w-full bg-purple-900 bg-opacity-20">
                <div className="text-sm ">
                  Nível Mega Jackpot: {JackpotMap[currentSelectedLevel].label}
                </div>
                <div className="text-[10px] leading-none opacity-70">
                  Ou numerário de valor equivalente
                </div>
              </div>
            </ItemContainer>
          )}

          <ItemContainer className="flex justify-between">
            <img
              className={'h-[43px] w-[70px]'}
              alt={''}
              src={`assets/${environment.uVersion}/icon_vip_context_2.png`}
            />
            <div className="flex flex-col justify-center text-left font-bold leading-5 ml-1">
              <div>Recompensas de upgrade</div>
              <div>de associação: R${formatLocaleMoney(signBonus)}</div>
            </div>
          </ItemContainer>

          <ItemContainer className="flex justify-between">
            <img
              className={'h-[43px] w-[70px]'}
              alt={''}
              src={`assets/${environment.uVersion}/icon_vip_context_1.png`}
            />
            <div className="flex flex-col justify-center text-left font-bold leading-5 ml-1">
              <div>Recompensa total de</div>
              <div>check-in de 7 dias: R${formatLocaleMoney(signBonus)}</div>
            </div>
          </ItemContainer>

          <ItemContainer className="text-center font-bold">
            Limite máximo de retirada única : R$
            {formatLocaleMoney(
              currentLevelInfo?.withdrawAmountLimitDay
                ? currentLevelInfo?.withdrawAmountLimitDay / 100
                : 0
            )}
          </ItemContainer>

          <ItemContainer className="text-center font-bold">
            Número de retiradas por dia:{' '}
            {currentLevelInfo?.withdrawTimesLimitDay}
          </ItemContainer>
        </section>

        <section className={'mb-4'}>
          <section className={'mb-4 text-center text-lg font-bold text-white'}>
            — CONDIÇÕES DO VIP ATUAL —
          </section>

          <ItemContainer className="text-center font-bold">
            Quantidade total de recarga : R$
            {formatLocaleMoney(
              currentLevelInfo?.rechargeAmountLimit
                ? currentLevelInfo?.rechargeAmountLimit / 100
                : 0
            )}
            <div></div>
          </ItemContainer>

          <ItemContainer className="text-center font-bold">
            Número total de apostas : R$
            {formatLocaleMoney(
              currentLevelInfo?.flowLimit
                ? currentLevelInfo?.flowLimit / 100
                : 0
            )}
            {/*{currentLevelInfo?.flowLimit*/}
            {/*  ? `${currentLevelInfo?.flowLimit / 100}`*/}
            {/*  : '0'}*/}
          </ItemContainer>
        </section>
      </div>
    </PageContainer>
  );
};

export default VIPGradePageMobileTemplate;
