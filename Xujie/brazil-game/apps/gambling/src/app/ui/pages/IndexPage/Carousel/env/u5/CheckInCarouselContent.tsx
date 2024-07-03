import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import cx from "classnames";


export const CheckInCarouselContent = (props: IAppCarouselContent) => {
  const {onClickToCheckInDaily} = usePageNavigate();


  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={"text-[20px] text-white w-full"}
      onClickBanner={(event) => {
        onClickToCheckInDaily();
      }}
    >
      <CarouselImage
        alt={"banner_checkin"}
        className={cx('bg-linear-5-main', 'rounded-lg')}
        genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/home_banner_checkin.png`}
      />
      <CarouselTitleSection>
        {'Check-in todos os dias O dinheiro não para!'}
      </CarouselTitleSection>
    </CarouselContainer>
  )
}


