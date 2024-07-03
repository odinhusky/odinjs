import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import cx from "classnames";

export const VipCarouselContent = (props: IAppCarouselContent) => {
  const {onClickToVipGrade} = usePageNavigate();

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={"text-[20px] text-white w-full"}
      onClickBanner={(event) => {
        onClickToVipGrade();
      }}
    >
      <CarouselImage
        alt={"banner_vip"}
        className={cx('bg-linear-2-main', 'rounded-lg')}
        genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/home_banner_vip.png`}
      />
      <CarouselTitleSection>
        {'Prêmio upgrade Só esperando você coletar! VIP0 Pode Retirar'}
      </CarouselTitleSection>
    </CarouselContainer>
  )
}


