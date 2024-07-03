import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from './CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';
import { useInviteInCompatible } from '../../../../../hooks/useInviteInCompatible';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';

export const RecommendCarouselContent = (props: IAppCarouselContent) => {
  const { onClickToInvite, onClickToBoxInvite } = usePageNavigate();
  const invite_hig_reward = useSelector(
    (rootState: RootState) => rootState.app.config.invite_hig_reward
  );
  const { isShowBoxInvite, boxInviteTitle } = useInviteInCompatible();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const bgSrc = `assets/${environment.uVersion}/${
    environment.mvVersion
  }/home_banner_recommend${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;

  const inviteTitle = isShowBoxInvite
    ? boxInviteTitle
    : `Ate R$${invite_hig_reward} bônus Convide uma pessoa e receba`;
  // : `Convide Amigos A maior recompensa para uma pessoa é R$ ${invite_hig_reward}`
  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'w-full'}
      onClickBanner={(event) => {
        isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
      }}
    >
      <CarouselImage alt={'banner_recommend'} genieSrc={bgSrc} />
      <CarouselTitleSection>{inviteTitle}</CarouselTitleSection>
    </CarouselContainer>
  );
};
