import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';

import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { CarouselContainer } from './CarouselContainer';

export const CashbackCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToDepositCashback } = usePageNavigate();
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const bgSrc = `assets/${environment.uVersion}/${
    environment.mvVersion
  }/home_banner_cashback${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;
  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'w-full'}
      onClickBanner={(event) => {
        onClickToDepositCashback();
      }}
    >
      <CarouselImage alt={'banner_cashback'} genieSrc={bgSrc} />
      <CarouselTitleSection>
        {`Ate ${recharge_cashback_rate} bônus Bem-estar Oferta de depósito`}
        {/*{`Benefícios-ofertasde deposito Ate ${recharge_cashback_rate} bônus`}*/}
      </CarouselTitleSection>
    </CarouselContainer>
  );
};
