import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";

export const AppCarouselContent5 = (props: IAppCarouselContent) => {
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
                       srcName={`banner_checkin`}/>
        {/*{isMobile ? (*/}
        {/*  <CarouselImage alt={"h5_banner_5"} src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_checkin_m.png`}/>*/}
        {/*): (*/}
        {/*  <CarouselImage alt={"banner_5"} src={`assets/${environment.uVersion}/${environment.mvVersion}/banner_checkin.png`}/>*/}
        {/*)}*/}
      </div>
    </CarouselContainer>
  )
}


