import { twMerge } from "tailwind-merge";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import Carousel from "react-multi-carousel";
import { responsive } from "../../responsive";

type IAppCarousel = {
  children: React.ReactNode;
  setIsMoving: (isMoving: boolean) => void;
}

export const AppCarousel = ({children, setIsMoving}: IAppCarousel) => {

  const { isMobile } = useBreakpoint();

  const TransitionDuration = 0.3

  return (
    <div
      className={twMerge(
        !isMobile && 'isdesktop',
        isMobile && 'ismobile'
      )}
    >
      <Carousel
        // customDot={<div className={"bg-red w-[30px] h-[20px]"}/>}
        swipeable={true}
        draggable={true}
        showDots={true}
        arrows={!isMobile}
        responsive={responsive}
        autoPlay={true}
        // autoPlay={false}
        autoPlaySpeed={3000}
        // transitionDuration={500}
        infinite={true}
        // renderDotsOutside={true}
        // deviceType={"mobile"}
        // deviceType={deviceType}
        removeArrowOnDeviceType={[]} // 在所有设备上都移除箭头
        // removeArrowOnDeviceType={["tablet", "mobile"]}
        // ssr={true} // means to render carousel on server-side.
        customTransition={`transform ${TransitionDuration}s ease-in-out`}
        transitionDuration={TransitionDuration * 1000}
        keyBoardControl={false}

        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        beforeChange={() => setIsMoving && setIsMoving(true)}
        afterChange={() => setIsMoving && setIsMoving(false)}
      >
        {children}
      </Carousel>
    </div>
  )
}
