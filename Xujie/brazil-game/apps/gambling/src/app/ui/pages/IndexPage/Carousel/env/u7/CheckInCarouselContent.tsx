import {environment} from "../../../../../../../environments/environment";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {CarouselContainer} from "./CarouselContainer";
import {IAppCarouselContent} from "../../types";
import {CarouselImage} from "./CarouselImage";
import {CarouselTitleSection} from "./CarouselTitleSection";
import cx from "../../../../../utils/cx";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";


export const CheckInCarouselContent = (props: IAppCarouselContent) => {
    const {onClickToCheckInDaily} = usePageNavigate();
    const {isMobile, isTablet, isDesktop} = useBreakpoint();
    const bgSrc = `assets/${environment.uVersion}/${environment.mvVersion}/home_banner_checkin${isMobile ? '_m' : isTablet ? '_t' : ''}.png`

    return (
        <CarouselContainer
            isMoving={props.isMoving}
            className={'w-full'}
            onClickBanner={(event) => {
                onClickToCheckInDaily();
            }}
        >
            <CarouselImage
                alt={'banner_checkin'}
                genieSrc={bgSrc}
            />
            <CarouselTitleSection>
                {/* {`Colete dinheiro sem parar todos os dias!`} */}
                {'Check-in todos os dias O dinheiro não para!'}
            </CarouselTitleSection>
        </CarouselContainer>
    )
}


