import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";

export const AppCarouselContent5 = (props: IAppCarouselContent) => {
  const {isMobile} = useBreakpoint();
  const {onClickToCheckInDaily} = usePageNavigate();

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={"text-[22.5px] text-white"}
      onClickBanner={(event) => {
        onClickToCheckInDaily();

      }}
    >
      <div className={""}>
        <CarouselTitleSection>
          <span>Check-in todos os dias <br/> O dinheiro não para!</span>
        </CarouselTitleSection>
        <CarouselImage alt={"banner_5"}
                       srcName={'banner_checkin'}
        />
      </div>
    </CarouselContainer>
  )
}


