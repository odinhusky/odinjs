import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';
import cx from 'classnames';

export const CashbackCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToDepositCashback } = usePageNavigate();
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[20px] text-white w-full'}
      onClickBanner={(event) => {
        onClickToDepositCashback();
      }}
    >
      <CarouselImage
        alt={'banner_cashback'}
        className={cx('bg-linear-3-main', 'rounded-lg')}
        genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/home_banner_cashback.png`}
      />
      <CarouselTitleSection>
        {`Benefícios-ofertasde deposito Ate ${recharge_cashback_rate} bônus`}
      </CarouselTitleSection>
    </CarouselContainer>
  );
};
