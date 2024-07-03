import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "./CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";

export const VipCarouselContent = (props: IAppCarouselContent) => {
  const {onClickToVipGrade} = usePageNavigate();
  const {isMobile, isTablet, isDesktop} = useBreakpoint();
  const bgSrc = `assets/${environment.uVersion}/${environment.mvVersion}/home_banner_vip${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  return (
      <CarouselContainer
          isMoving={props.isMoving}
          className={'w-full'}
          onClickBanner={(event) => {
            onClickToVipGrade();
          }}
      >
          <CarouselImage
              alt={'banner_vip'}
              genieSrc={bgSrc}
          />
          <CarouselTitleSection>
              {/* {`Venha e colete explosivo Recompensas VIP! VIP0 Pode Retirar`} */}
              {'Prêmio upgrade Só esperando você coletar! VIP0 Pode Retirar'}
          </CarouselTitleSection>
      </CarouselContainer>
)
}


