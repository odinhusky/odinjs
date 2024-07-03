import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';

import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';

export const AppCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToFirstDeposit } = usePageNavigate();
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );
  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[22.5px] text-white'}
      onClickBanner={(event) => {
        onClickToFirstDeposit();
      }}
    >
      <div className={''}>
        <CarouselTitleSection>
          Primeiro depósito <br /> bônus de {recharge_first_cashback_rate}
        </CarouselTitleSection>
        <CarouselImage alt={'banner_1'} srcName={`banner_primeira_recarga`} />

        {/*{isMobile ? (*/}
        {/*  <CarouselImage alt={"h5_banner_2"}*/}
        {/*                 src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_primeira_recarga_m.png`}/>*/}
        {/*) : (*/}
        {/*  <CarouselImage alt={"banner_2"}*/}
        {/*                 src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_primeira_recarga.png`}/>*/}
        {/*)}*/}
      </div>
    </CarouselContainer>
  );
};
