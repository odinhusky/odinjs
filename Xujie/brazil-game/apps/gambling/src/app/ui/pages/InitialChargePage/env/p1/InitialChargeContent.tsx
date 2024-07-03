import { ChargeButton } from '../../../../components-bs/Buttons/env/u1/ChargeButton';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';

import { BenefitSection } from '../components/BenefitSection';
import { NoticeSection } from '../components/NoticeSection';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { Banner } from '../../../../components/Banner';
import { environment } from '../../../../../../environments/environment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { PageContainer } from '../../../../components-bs/PageContainer';
import cx from 'classnames';
import { IInitialChargePage } from '../../index';

export const InitialChargeContent = (props: IInitialChargePage) => {
  const { isMobile } = useBreakpoint();
  const { onClickToIndex, onClickToWallet, onClickToActivity } =
    usePageNavigate();

  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  const RechargeButton = () => {
    return (
      <section className={'flex justify-center items-center'}>
        <ChargeButton
          style={{
            fontWeight: '700',
            color: 'var(--main-primary-varient)',
            borderRadius: '49px',
            background:
              'linear-gradient(180deg,var(--btn-gradient1-from),var(--btn-gradient1-to))',
            padding: isMobile ? '12px 24px' : '14px 48px',
          }}
          onClick={() => onClickToWallet({ panelType: 'deposit' })}
          className={cx(
            'leading-none mt-3 mb-4 md:my-8',
            isMobile ? 'text-lg' : 'text-xl'
          )}
        >
          RECARREGUE AGORA
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
            <div className={'w-full font-bold text-center'}>
              Primeira recarga
            </div>
          )
        }
      />

      <Banner
        imgClassName={`rounded-lg mb-4 md:mb-8 mt-6`}
        src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_primeira_recarga.png`}
        bannerText={
          <div
            className={
              'absolute left-[5%] top-1/2 transform -translate-y-1/2 font-bold'
            }
          >
            <div className={'text-white text-[4vw]'}>Primeiro depósito</div>
            <div className={'text-white text-[4vw]'}>
              bônus de {recharge_first_cashback_rate}
            </div>
          </div>
        }
      />

      <section
        className={cx(
          'border border-[var(--main-primary-main)]',
          'rounded-xl',
          'py-6 px-6',
          'bg-gradient-to-b from-[#013E42CC] to-[#013E42CC]'
        )}
      >
        <div className="text-white my-2 md:my-4 mx-4">
          <div className="text-2xl font-bold mb-6 md:mb-4">
            Primeira recarga
          </div>
          <BenefitSection className="mb-3 md:mb-1 text-base md:text-2xl leading-6 md:leading-8" />
        </div>
        {isMobile && <RechargeButton />}
        <div
          className={`
         py-3 px-4 md:py-2
         text-sm md:text-xl
         rounded-lg flex flex-col text-left text-white`}
        >
          <NoticeSection
            titleClassName={'mb-1 leading-5 md:leading-7'}
            textClassName={'mb-2 md:mb-1 leading-5 md:leading-7'}
          />
          <div className={cx('h-[1px] bg-white my-3')} />
          <div
            className={
              'text-[var(--text-popup)] text-left leading-5 md:leading-7 -mt-1 md:mt-0'
            }
          >
            Lembrete caloroso, certifique-se de que seu nome, número de telefone
            celular e número de conta CPF são únicos. Se o mesmo usuário
            registrar várias contas para receber bônus em dinheiro,
            consideraremos isso uma trapaça. Se isso acontecer, a conta
            relevante será permanentemente congelada. Nós não compensará as
            perdas causadas por trapaça!
          </div>
        </div>

        {!isMobile && <RechargeButton />}
      </section>
    </PageContainer>
  );
};
