import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";

export const AppCarouselContent4 = (props: IAppCarouselContent) => {
  const {isMobile} = useBreakpoint();
  const {onClickToVipGrade} = usePageNavigate();

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={"text-[22.5px] text-white"}
      onClickBanner={(event) => {
        onClickToVipGrade();
      }}
    >
      <div className={""}>
        <CarouselTitleSection className={"sm:top-[45%] md:top-[45%]"}>
          Prêmio upgrade VIP
          <br/>
          Só esperando você coletar!
          <br/>
          VIP0 Pode Retirar
        </CarouselTitleSection>
        <CarouselImage alt={"banner_4"}
                       srcName={`banner_vip`}/>
      </div>
    </CarouselContainer>
  )
}


