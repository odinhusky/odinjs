// https://react-multi-carousel.surge.sh/
import Carousel, { StateCallBack } from 'react-multi-carousel';
import './style.scss';
import { responsive } from './responsive';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import cx from 'classnames';
import { renderByUVersion } from '../../../utils/renderByUVersion';
import { AppCarousel as PAppCarousel } from './env/p1';
import { AppCarousel as RiojungleAppCarousel } from './env/u2/RiojungleCarousel';
import { AppCarousel as U5AppCarousel } from './env/u5/RiojungleCarousel';
import { AppCarousel as U6AppCarousel } from './env/u6/RiojungleCarousel';
import { AppCarousel as U7AppCarousel } from './env/u7/Carousel';
import U9AppCarousel from './env/u9/U9Carousel';

type IAppCarousel = {
  children: React.ReactNode;
  setIsMoving: (isMoving: boolean) => void;
};

const CocoAppCarousel = (props: IAppCarousel) => {
  const { isMobile } = useBreakpoint();
  const TransitionDuration = 0.3;

  return (
    <div
      className={cx({
        isdesktop: !isMobile,
        ismobile: isMobile,
      })}
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
        beforeChange={() => props.setIsMoving && props.setIsMoving(true)}
        afterChange={() => props.setIsMoving && props.setIsMoving(false)}
      >
        {props.children}
      </Carousel>
    </div>
  );
};

export const AppCarousel = (props: IAppCarousel) => {
  return renderByUVersion(
    {
      wild777bet: <CocoAppCarousel {...props} />,
      p1: <PAppCarousel {...props} />,
      u1: <CocoAppCarousel {...props} />,
      u2: <RiojungleAppCarousel {...props} />,
      u5: <U5AppCarousel {...props} />,
      u6: <U6AppCarousel {...props} />,
      u7: <U7AppCarousel {...props} />,
      u9: <U9AppCarousel {...props} />,
    },
    <CocoAppCarousel {...props} />
  );
};
