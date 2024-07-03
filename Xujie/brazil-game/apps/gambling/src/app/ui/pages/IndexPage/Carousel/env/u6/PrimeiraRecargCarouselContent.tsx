import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from './CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselTitleSection } from './CarouselTitleSection';
import { CarouselImage } from './CarouselImage';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';

export const PrimeiraRecargCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToFirstDeposit } = usePageNavigate();
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const bgSrc = `assets/${environment.uVersion}/${
    environment.mvVersion
  }/home_banner_primeira_recarga${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;
  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'w-full'}
      onClickBanner={(event) => {
        onClickToFirstDeposit();
      }}
    >
      <CarouselImage alt={'banner_primeira_recharg'} genieSrc={bgSrc} />

      <CarouselTitleSection>
        {`Ate ${recharge_first_cashback_rate} bônus Bônus de primeira recarga`}
        {/*{`Primeiro depósito + bônus de ${recharge_first_cashback_rate}`}*/}
      </CarouselTitleSection>
    </CarouselContainer>
  );
};
