import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselTitleSection } from './CarouselTitleSection';
import { CarouselImage } from './CarouselImage';
import cx from 'classnames';

export const PrimeiraRecargCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToFirstDeposit } = usePageNavigate();
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[20px] text-white w-full'}
      onClickBanner={(event) => {
        onClickToFirstDeposit();
      }}
    >
      <CarouselImage
        alt={'banner_primeira_recharg'}
        className={cx('bg-linear-1-main', 'rounded-lg')}
        genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/home_banner_primeira_recarga.png`}
      />
      <CarouselTitleSection>
        {`Primeiro depósito + bônus de ${recharge_first_cashback_rate}`}
      </CarouselTitleSection>
    </CarouselContainer>
  );
};
