import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';
import { CarouselImage } from './CarouselImage';
import { CarouselTitleSection } from './CarouselTitleSection';
import { useInviteInCompatible } from '../../../../../hooks/useInviteInCompatible';

export const AppCarouselContent3 = (props: IAppCarouselContent) => {
  const { onClickToInvite, onClickToBoxInvite } = usePageNavigate();
  const invite_hig_reward = useSelector(
    (rootState: RootState) => rootState.app.config.invite_hig_reward
  );
  const { isShowBoxInvite, boxInviteTitle } = useInviteInCompatible();
  const inviteTitle = isShowBoxInvite ? (
    <span>{boxInviteTitle}</span>
  ) : (
    <span>
      A maior recompensa
      <br />
      para uma pessoa é R${invite_hig_reward}
    </span>
  );

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[22.5px] text-white'}
      onClickBanner={(event) => {
        isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
      }}
    >
      <div className={''}>
        <CarouselTitleSection>{inviteTitle}</CarouselTitleSection>
        <CarouselImage alt={'banner_3'} srcName={`banner_recommend`} />
      </div>
    </CarouselContainer>
  );
};
