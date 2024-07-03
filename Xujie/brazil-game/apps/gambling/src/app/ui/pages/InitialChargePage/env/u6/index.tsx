import { useSelector } from 'react-redux';
import { environment } from '../../../../../../environments/environment';
import { RootState } from '../../../../../reduxStore';
import { PageContainer } from '../../../../components-bs/PageContainer';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { IInitialChargePage } from '../..';

export const InitialChargePage = (props: IInitialChargePage) => {
  const { isMobile, isTablet } = useBreakpoint();
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  const recharge_bonus_start = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_bonus_start
  );

  const { onClickToWallet, onClickToActivity, onClickToIndex } =
    usePageNavigate();

  return (
    <PageContainer className="mx-auto">
      <BackNavigation
        className="text-base mobile:text-xl"
        onClick={() => {
          props?.isFromActivity ? onClickToActivity() : onClickToIndex();
        }}
      />
      <div className="mx-auto text-[var(--grayscale-100)] w-full space-y-3 mobile:space-y-4 tablet:space-y-6 mt-3 tablet:mt-7">
        {/*Banner*/}
        <div className="w-full flex justify-center items-center relative">
          <div className="">
            <img
              src={`assets/${environment.uVersion}/${
                environment.mvVersion
              }/internal_banner_primeira_recarga${
                isMobile ? '_m' : isTablet ? '_t' : ''
              }.png`}
              alt="banner"
              id="banner"
              className="w-full h-full" /** */
            />
          </div>

          <div
            className="
              tablet:text-[56px] tablet:leading-[64px] mobile:text-4xl text-xl text-start font-bold tablet:font-black 
              absolute right-28 left-4 mobile:left-8 tablet:left-16 top-1/2 -translate-y-1/2"
            style={{
              textShadow: `0px ${
                isMobile ? '2px' : '4px'
              } 4px rgba(0,0,0,0.25)`,
            }}
          >
            <div className="">Bônus de primeira recarga</div>
            <div className="">Bônus de {recharge_first_cashback_rate}</div>
          </div>
        </div>

        <div className="bg-[var(--grayscale-30)] rounded-xl py-4 px-5 mobile:py-8 mobile:px-9 tablet:py-10 tablet:px-12 space-y-4 mobile:space-y-5 tablet:space-y-7">
          <div className="space-y-2 mobile:space-y-3">
            {/* Bônus de {20}% para o primeiro depósito */}
            <div className="space-y-2 mobile:space-y-3">
              <div className="text-sm mobile:text-base tablet:text-2xl text-center font-extrabold">
                Bônus de {recharge_first_cashback_rate} para o primeiro depósito
              </div>
              <div className="bg-[var(--transparente-10)] rounded-xl p-4 max-tablet:mobile:p-6 text-sm tablet:text-base">
                Obrigado pela confiança e apoio. Para sua primeira recarga,
                oferecemos um bônus de recarga de até{' '}
                {recharge_first_cashback_rate}! As recompensas serão
                transferidas diretamente para sua conta após a recarga.Detalhes
                do evento:
                <br />
                1. O valor da sua primeira recarga deve ser superior a{' '}
                {recharge_bonus_start} reais.
                <br />
                2. Cada conta tem apenas uma chance (depois de completar esta
                recompensa, você pode participar do evento de presente de
                recarga da plataforma).
                <br />
                3. O bônus de depósito será creditado diretamente em sua conta
                de depósito. <br />
                4. Rejeitamos contas fraudulentas, uma vez descobertas, elas
                serão permanentemente congeladas.
                <br />
                5. O direito de interpretação final das atividades da plataforma
                pertence ao {environment.platformGroup} (propriedade do{' '}
                {environment.platformName})
              </div>
            </div>
            {/* warn */}
            <div
              className="
              flex flex-col mobile:flex-row 
              gap-1 mobile:gap-4 tablet:gap-[18px] mobile:py-2 tablet:py-4"
            >
              <div className="flex flex-none bg-linear-1-main rounded-full tablet:w-9 w-6 tablet:h-9 h-6 m-auto">
                <img
                  src={`assets/${environment.uVersion}/icon_warn.png`}
                  alt="warn"
                  className="w-full h-full"
                />
              </div>

              <div className="w-full text-center mobile:text-start text-[var(--grayscale-80)] text-sm tablet:text-base">
                Lembrete caloroso, certifique-se de que seu nome, número de
                telefone celular e número de conta CPF são únicos. Se o mesmo
                usuário registrar várias contas para receber bônus em dinheiro,
                consideraremos isso uma trapaça. Se isso acontecer, a conta
                relevante será permanentemente congelada. Nós não compensará as
                perdas causadas por trapaça!
              </div>
            </div>
          </div>
          <button
            className="
              linear-2-button w-[304px] mobile:w-[320px] tablet:w-[400px] m-auto py-1.5 mobile:py-2.5 lg:py-3 
              text-base mobile:text-sm tablet:text-base bg-[var(--primary-main)] font-medium"
            onClick={() => onClickToWallet()}
          >
            Recarregue agora
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
