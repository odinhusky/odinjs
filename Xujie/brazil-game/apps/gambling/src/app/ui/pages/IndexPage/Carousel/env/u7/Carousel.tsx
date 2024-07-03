import Carousel from "react-multi-carousel"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
import { responsive } from "./responsive"

type IAppCarousel = {
  children: React.ReactNode
  setIsMoving: (isMoving: boolean) => void
}

export const AppCarousel = (props: IAppCarousel) => {
  const { isMobile, isDesktop } = useBreakpoint()
  const TransitionDuration = 0.3

  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={!isDesktop}
      arrows={false}
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={3000}
      infinite={true}
      customTransition={`transform ${TransitionDuration}s ease-in-out`}
      transitionDuration={TransitionDuration * 1000}
      keyBoardControl={false}
      partialVisible={true}
      containerClass="carousel-container hover:cursor-pointer"
      dotListClass="u7-dot-list-style"
      itemClass={isDesktop ? "image-item-16" :""}
      beforeChange={() => props.setIsMoving && props.setIsMoving(true)}
      afterChange={() => props.setIsMoving && props.setIsMoving(false)}
      removeArrowOnDeviceType={["mobile"]}
    >
      {props.children}
    </Carousel>
  )
}
