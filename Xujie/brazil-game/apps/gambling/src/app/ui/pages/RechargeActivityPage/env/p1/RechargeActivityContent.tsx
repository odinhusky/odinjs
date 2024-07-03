import { ChargeButton } from '../../../../components-bs/Buttons/env/u1/ChargeButton';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { BenefitSection } from './BenefitSection';
import { NoticeSection } from './NoticeSection';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { environment } from '../../../../../../environments/environment';
import { Banner } from '../../../../components/Banner';
import { PageContainer } from '../../../../components-bs/PageContainer';
import cx from 'classnames';
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
            'leading-none text-white mb-4 sm:my-8',
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
            className={
              'absolute left-[5%] top-1/2 transform -translate-y-1/2 font-bold'
            }
          >
            <div className={'text-white text-[2vw]'}>
              BENEFÍCIOS-OFERTASDE DEPOSITO
            </div>
            <div className={'text-white text-[6vw]'}>
              ATE {recharge_cashback_rate} BÔNUS
            </div>
          </div>
        }
      />

      <div
        className={cx(
          'border border-[var(--main-primary-main)]',
          'rounded-xl',
          'py-6 px-6',
          'bg-gradient-to-b from-[#013E42CC] to-[#013E42CC]'
          // 'bg-[var(--main)] pt-5 border-2 border-[var(--light)]'
        )}
      >
        <BenefitSection />
        {isMobile && <RechargeButton />}
        <div className={cx('h-[1px] bg-white my-3')} />
        <NoticeSection />
        {!isMobile && <RechargeButton />}
      </div>
    </PageContainer>
  );
};
