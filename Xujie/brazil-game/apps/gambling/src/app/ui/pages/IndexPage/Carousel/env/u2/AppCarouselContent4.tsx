import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";

export const AppCarouselContent4 = (props: IAppCarouselContent) => {
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
        <CarouselImage
          alt={"banner_4"}
          src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_checkin.png`}
          genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/banner_checkin_genie.png`}
        />
        <CarouselTitleSection className={"sm:top-[45%] md:top-[45%]"}>
          Colete denheiro sem parar todos os dias!
        </CarouselTitleSection>
      </div>
    </CarouselContainer>
  )
}


