import { ChargeButton } from '../../../../components-bs/Buttons/env/u1/ChargeButton';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { BenefitSection } from './BenefitSection';
import { NoticeSection } from './NoticeSection';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { environment } from '../../../../../../environments/environment';
import { Banner } from '../../../../components/Banner';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { IRechargeActivityPage } from '../../index';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

export const RechargeActivityContent = (props: IRechargeActivityPage) => {
  const { isMobile } = useBreakpoint();

  const { onClickToIndex, onClickToWallet, onClickToActivity } =
    usePageNavigate();

  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  const RechargeButton = () => {
    return (
      <section className={'flex justify-center items-center '}>
        <ChargeButton
          onClick={() => onClickToWallet({ panelType: 'deposit' })}
          className={'leading-none text-white text-xl md:text-lg mb-4 sm:my-8'}
        >
          Recarregue agora
        </ChargeButton>
      </section>
    );
  };

  return (
    <PageContainer>
      <BackNavigation
        onClick={() =>
          props.isFromActivity ? onClickToActivity() : onClickToIndex()
        }
        title={
          isMobile && (
            <div className={'w-full text-center font-bold'}>
              Recarga benefícios
            </div>
          )
        }
      />
      <Banner
        imgClassName={`rounded-lg mb-4 md:mb-8 mt-6`}
        src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_cashback.png`}
        bannerText={
          <div
            className={'absolute left-[5%] top-1/2 transform -translate-y-1/2'}
          >
            <div
              className={
                'text-white text-sm md:text-xl lg:text-4xl mb-2 md:mb-4 lg:mb-9'
              }
            >
              Benefícios-ofertasde deposito
            </div>
            <div className={'text-white text-xl md:text-3xl lg:text-8xl'}>
              Ate {recharge_cashback_rate} bônus
            </div>
          </div>
        }
      />

      <BenefitSection />
      {isMobile && <RechargeButton />}
      <NoticeSection />
      {!isMobile && <RechargeButton />}
    </PageContainer>
  );
};
