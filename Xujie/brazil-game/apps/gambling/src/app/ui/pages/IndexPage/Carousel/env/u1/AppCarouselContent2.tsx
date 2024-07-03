import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';

export const AppCarouselContent2 = (props: IAppCarouselContent) => {
  const { onClickToDepositCashback } = usePageNavigate();
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );
  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[22.5px] text-white'}
      onClickBanner={(event) => {
        onClickToDepositCashback();
      }}
    >
      <div className={''}>
        <CarouselTitleSection>
          Benefícios-ofertasde deposito
          <br />
          Ate {recharge_cashback_rate} bônus
        </CarouselTitleSection>
        <CarouselImage alt={'banner_2'} srcName={`banner_cashback`} />

        {/*{isMobile ? (*/}
        {/*  <CarouselImage alt={"h5_banner_1"}*/}
        {/*                 src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_cashback_m.png`}/>*/}
        {/*) : (*/}
        {/*  <CarouselImage alt={"banner_2"}*/}
        {/*                 src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_cashback.png`}/>*/}
        {/*)}*/}
      </div>
    </CarouselContainer>
  );
};
