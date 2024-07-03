import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';

import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';

export const AppCarouselContent = (props: IAppCarouselContent) => {
  const { isMobile } = useBreakpoint();
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
      </div>
    </CarouselContainer>
  );
};
