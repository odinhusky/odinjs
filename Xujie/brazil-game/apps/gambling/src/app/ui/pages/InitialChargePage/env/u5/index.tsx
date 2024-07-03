import { useSelector } from 'react-redux';
import { environment } from '../../../../../../environments/environment';
import { RootState } from '../../../../../reduxStore';
import { PageContainer } from '../../../../components-bs/PageContainer';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';

export const InitialChargePage = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );
  const recharge_bonus_start = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_bonus_start
  );

  const { onClickToWallet } = usePageNavigate();
  return (
    <PageContainer className="text-white">
      {/*Banner*/}
      <div className="w-full flex justify-end items-center bg-[var(--grayscale-30)] relative rounded-2xl overflow-hidden">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_primeira_recarga${
            isMobile ? '_m' : isTablet ? '_t' : ''
          }.png`}
          alt="banner"
          id="banner"
          className="w-2/3"
        />

        <div
          className="tablet:text-5xl mobile:text-3xl text-base text-start shadow-te font-extrabold text-white absolute left-3 mobile:left-6 tablet:left-12 top-1/2 -translate-y-1/2"
          style={{
            textShadow: `${
              isMobile ? '2px 2px' : '6px 6px'
            } 2px var(--grayscale-20)`,
          }}
        >
          <div>Bônus de primeira recarga</div>
          <div className="mt-1 mobile:mt-3 tablet:mt-5">
            Bônus de {recharge_first_cashback_rate}
          </div>
        </div>
      </div>
      {/* Bônus de {20}% para o primeiro depósito */}
      <div className="bg-[var(--grayscale-20)] rounded-lg mt-3 mobile:mt-5 tablet:mt-8 p-8 max-mobile:p-4">
        <div className="text-sm mobile:tex-base tablet:text-lg text-center font-extrabold">
          Bônus de {recharge_first_cashback_rate} para o primeiro depósito
        </div>
        <div className="max-mobile:mt-3 mt-5 bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6">
          Obrigado pela confiança e apoio. Para sua primeira recarga, oferecemos
          um bônus de recarga de até {recharge_first_cashback_rate}! As
          recompensas serão transferidas diretamente para sua conta após a
          recarga.Detalhes do evento:
          <br />
          1. O valor da sua primeira recarga deve ser superior a{' '}
          {recharge_bonus_start} reais.
          <br />
          2. Cada conta tem apenas uma chance (depois de completar esta
          recompensa, você pode participar do evento de presente de recarga da
          plataforma).
          <br />
          3. O bônus de depósito será creditado diretamente em sua conta de
          depósito. <br />
          4. Rejeitamos contas fraudulentas, uma vez descobertas, elas serão
          permanentemente congeladas.
          <br />
          5. O direito de interpretação final das atividades da plataforma
          pertence ao {environment.platformGroup} (propriedade do{' '}
          {environment.platformName})
        </div>
      </div>
      {/* warn */}
      <div className="bg-[var(--grayscale-20)] rounded-lg mt-3 mobile:mt-5 tablet:mt-8 p-8 max-mobile:p-4">
        <img
          src={`assets/${environment.uVersion}/icon_warn.png`}
          alt="warn"
          className="tablet:w-11 w-8 mx-auto"
        />

        <div className="text-center max-mobile:mt-3 mt-5 bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6">
          Lembrete caloroso, certifique-se de que seu nome, número de telefone
          celular e número de conta CPF são únicos. Se o mesmo usuário registrar
          várias contas para receber bônus em dinheiro, consideraremos isso uma
          trapaça. Se isso acontecer, a conta relevante será permanentemente
          congelada. Nós não compensará as perdas causadas por trapaça!
        </div>
      </div>
      <button
        className={`mt-3 mobile:mt-5  tablet:mt-8 w-full sm:w-80 lg:w-[480px] h-10 lg:h-12 mx-auto  text-sm font-extrabold linear-1-button`}
        onClick={() => onClickToWallet()}
      >
        Recarregue agora
      </button>
    </PageContainer>
  );
};
