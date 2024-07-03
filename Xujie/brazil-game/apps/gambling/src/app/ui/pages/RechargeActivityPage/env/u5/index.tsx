import { environment } from '../../../../../../environments/environment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

export const RechargeActivityPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  const { onClickToWallet } = usePageNavigate();

  return (
    <PageContainer className={'text-white'}>
      {/*Banner*/}
      <div className="w-full flex justify-end items-center bg-[var(--grayscale-30)] relative rounded-2xl overflow-hidden">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_cashback${
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
          <div className="w-[700px] max-tablet:w-2/3">
            Bem-estar Oferta de depósito Ate
          </div>
          <div className="mt-1 mobile:mt-3 tablet:mt-5">
            {recharge_cashback_rate} bônus
          </div>
        </div>
      </div>

      {/* A partir de agora */}
      <div className="bg-[var(--grayscale-20)] rounded-lg mt-3 mobile:mt-5 tablet:mt-8 p-8 max-mobile:p-4">
        <div className="text-[var(--state-success-main)] bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6 ">
          A partir de agora, a recarga pode obter recompensas extras em
          dinheiro. Quanto mais você recarregar, maior será a taxa de
          recompensa, até {recharge_cashback_rate}. Após a recarga, o dinheiro
          extra também será transferido diretamente para a sua conta.
        </div>
        <div className="max-mobile:mt-3 mt-5 bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6">
          <div className="text-sm mobile:tex-base tablet:text-lg">
            Nota especial:
          </div>
          <div className="mt-3">
            Certifique-se de que o seu número de conta, número de telemóvel e
            CPF são únicos. Se o mesmo usuário registrar várias contas para
            obter bônus, consideraremos isso trapaceando e as contas relevantes
            serão congeladas permanentemente.Não faremos qualquer compensação
            pelas perdas causadas por trapaça.
          </div>
        </div>
      </div>
      <button
        className={`mt-3 mobile:mt-5  tablet:mt-8 w-full sm:w-80 lg:w-[480px] h-10 lg:h-12 mx-auto relative group cursor-pointer flex justify-center items-center text-sm text-white font-extrabold linear-3-button`}
        onClick={() => onClickToWallet()}
      >
        Recarregue agora
      </button>
    </PageContainer>
  );
};
