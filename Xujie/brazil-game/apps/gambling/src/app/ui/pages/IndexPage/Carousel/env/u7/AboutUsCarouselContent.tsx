import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import cx from "../../../../../utils/cx";
import {CarouselContainer} from "./CarouselContainer";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";

export const AboutUsCarouselContent= (props: IAppCarouselContent) => {
  const {onClickToCompanyProfile} = usePageNavigate();
    const {isMobile, isTablet, isDesktop} = useBreakpoint();
    const bgSrc = `assets/${environment.uVersion}/${environment.mvVersion}/home_banner_about_us${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  return (
      <CarouselContainer
          isMoving={props.isMoving}
          className={'w-full'}
          onClickBanner={(event) => {
            onClickToCompanyProfile();
          }}
      >
          <CarouselImage
              alt={'banner_company_profile'}
              className={cx('bg-gradient-to-br from-[var(--liner-4-main-from)] to-[var(--liner-4-main-to)]', 'rounded-lg')}
              genieSrc={bgSrc}
          />
          <CarouselTitleSection>
              {/* {`${environment.platformGroup} merece a sua confiança`} */}
              {`${environment.platformGroup} Um cassino responsável`}
          </CarouselTitleSection>
      </CarouselContainer>
)
}


