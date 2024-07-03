// import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import cx from "classnames";
import {CacheImage} from "../../../../../components/image/CacheImage";

type ICarouselImage = {
  genieSrc: string;
  className?: string;
  alt: string;
}
export const CarouselImage = (props: ICarouselImage) => {
  // const {isDesktop} = useBreakpoint();
  // 有 6px 的 offset，所以先暫時目標高度 - 6px
  const heightStyle = 'h-[114px] md:h-[138px] lg:h-[194px]';
  return (
    <div className={cx(
      'w-full ',
      heightStyle,
      'relative overflow-hidden',
    )}>
      <div className={cx('absolute bottom-0 w-full', heightStyle, props.className)}/>

      <CacheImage
        alt={'genie'}
        src={props.genieSrc}
        className={cx(
          'duration-300 absolute h-full right-0 bottom-0 aspect-auto object-cover object-right-bottom',
          heightStyle,
            // isDesktop && 'group-hover:scale-110', !isDesktop && 'group-active:scale-110'
        )}
      />
    </div>
  )
}
