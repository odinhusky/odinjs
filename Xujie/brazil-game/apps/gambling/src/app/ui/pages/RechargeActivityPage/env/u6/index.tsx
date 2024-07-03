import { environment } from '../../../../../../environments/environment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { IRechargeActivityPage } from '../..';

export const RechargeActivityPage = (props: IRechargeActivityPage) => {
  const { isMobile, isTablet } = useBreakpoint();
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  const { onClickToWallet, onClickToActivity, onClickToIndex } =
    usePageNavigate();

  return (
    <PageContainer className={'text-white'}>
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
              }/internal_banner_cashback${
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
            <div className="">
              Bem-estar Oferta de<br></br>depósito Ate
            </div>
            <div className="">Ate {recharge_cashback_rate} bônus</div>
          </div>
        </div>

        <div className="bg-[var(--grayscale-30)] rounded-xl py-4 px-5 mobile:py-8 mobile:px-9 tablet:py-10 tablet:px-12 space-y-4 mobile:space-y-5 tablet:space-y-7">
          <div className="space-y-2 mobile:space-y-3">
            {/* Bônus de {20}% para o primeiro depósito */}
            <div className="space-y-2 mobile:space-y-3">
              <div className="bg-[var(--grayscale-50)] rounded-xl p-4 text-center max-tablet:mobile:p-6 text-sm tablet:text-base">
                A partir de agora, a recarga pode obter recompensas extras em
                dinheiro. Quanto mais você recarregar, maior será a taxa de
                recompensa, até {recharge_cashback_rate}. Após a recarga, o
                dinheiro extra também será transferido diretamente para a sua
                conta.
              </div>
            </div>
            {/* warn */}
            <div
              className="
              flex flex-col tablet:flex-row text-[var(--grayscale-80)] text-sm tablet:text-base 
              gap-1 mobile:gap-4 tablet:gap-[18px] mobile:py-2 tablet:py-4"
            >
              <div className="m-auto flex flex-row justify-center items-center space-x-2">
                <div className="flex flex-none bg-linear-1-main rounded-full tablet:w-9 w-6 tablet:h-9 h-6 m-auto">
                  <img
                    src={`assets/${environment.uVersion}/icon_warn.png`}
                    alt="warn"
                    className="w-full h-full"
                  />
                </div>
                <div className="block tablet:hidden font-medium">
                  Nota especial:
                </div>
              </div>
              <div className="m-auto flex flex-col">
                <div className="tablet:block hidden font-medium">
                  Nota especial:
                </div>
                <div className="w-full text-center tablet:text-start">
                  Certifique-se de que o seu número de conta, número de
                  telemóvel e CPF são únicos. Se o mesmo usuário registrar
                  várias contas para obter bônus, consideraremos isso
                  trapaceando e as contas relevantes serão congeladas
                  permanentemente.Não faremos qualquer compensação pelas perdas
                  causadas por trapaça.
                </div>
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
