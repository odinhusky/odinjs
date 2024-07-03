import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "../../CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import cx from "classnames";

export const AboutUsContent= (props: IAppCarouselContent) => {
  const {onClickToCompanyProfile} = usePageNavigate();

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={"text-[20px] text-white w-full"}
      onClickBanner={(event) => {
        onClickToCompanyProfile();
      }}
    >
      <CarouselImage
        alt={"banner_company_profile"}
        className={cx('bg-linear-4-main', 'rounded-lg')}
        genieSrc={`assets/${environment.uVersion}/${environment.mvVersion}/home_banner_about_us.png`}
      />
      <CarouselTitleSection>
        {`${environment.platformGroup} merece a sua  confiança`}
      </CarouselTitleSection>
    </CarouselContainer>
  )
}


