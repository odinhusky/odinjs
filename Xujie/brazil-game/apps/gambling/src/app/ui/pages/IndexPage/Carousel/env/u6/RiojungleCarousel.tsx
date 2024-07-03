// https://react-multi-carousel.surge.sh/
import Carousel from "react-multi-carousel";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {responsive} from "./responsive";
import cx from "../../../../../utils/cx";


type IAppCarousel = {
    children: React.ReactNode;
    setIsMoving: (isMoving: boolean) => void;
}

export const AppCarousel = (props: IAppCarousel) => {
    const {isDesktop, isTablet, isMobile} = useBreakpoint();
    const TransitionDuration = 0.3

    return (
        <div className={cx({"ismobile": isMobile})}>
            <Carousel
                // customDot={<div className={"bg-red w-[30px] h-[20px]"}/>}
                swipeable={true}
                draggable={true}
                showDots={false}
                arrows={false}
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                // transitionDuration={500}
                infinite={true}
                // renderDotsOutside={true}
                // deviceType={"mobile"}
                // deviceType={deviceType}
                // removeArrowOnDeviceType={[]} // 在所有设备上都移除箭头
                // removeArrowOnDeviceType={["tablet", "mobile"]}
                // ssr={true} // means to render carousel on server-side.
                customTransition={`transform ${TransitionDuration}s ease-in-out`}
                transitionDuration={TransitionDuration * 1000}
                keyBoardControl={false}
                partialVisible={true}
                containerClass="carousel-container -mr-0 mobile:-mr-0 tablet:-mr-4"
                dotListClass="custom-dot-list-style"
                itemClass={'pr-2 mobile:pr-2 tablet:pr-1'}
                beforeChange={() => props.setIsMoving && props.setIsMoving(true)}
                afterChange={() => props.setIsMoving && props.setIsMoving(false)}
                // customLeftArrow={<CustomLeftArrow/>}
                // customRightArrow={<CustomRightArrow/>}
                // removeArrowOnDeviceType={['mobile']}
            >
                {props.children}
            </Carousel>
        </div>
    )

}
