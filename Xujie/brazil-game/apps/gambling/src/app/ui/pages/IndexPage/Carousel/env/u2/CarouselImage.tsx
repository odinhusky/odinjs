import {twMerge} from "tailwind-merge";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {useEffect} from "react";
import {useImageLoad} from "../../../../../hooks/useImageLoag";

type ICarouselImage = {
  genieSrc?: string;
  src: string;
  alt: string;
}
export const CarouselImage = (props: ICarouselImage) => {
  const {isDesktop} = useBreakpoint();
  const {loadImageAndCache, imageCache} = useImageLoad()
  const expirationSec = 60 * 10;

  useEffect(() => {
    loadImageAndCache(props.src, props.src, expirationSec);
    props.genieSrc && loadImageAndCache(props.genieSrc, props.genieSrc, expirationSec);
  }, []);


  return (
    <div className='relative rounded-lg border border-[var(--grayscale-30)] overflow-hidden'>
      {
        imageCache[props.src] &&
        <img
          alt={props.alt}
          className={"w-[100vw]"}
          src={imageCache[props.src].cacheValue}
        />
      }
      {
        props.genieSrc && imageCache[props.genieSrc] &&
        <img alt='genie'
             className={twMerge('duration-300 absolute right-0 top-0 h-full', isDesktop && 'group-hover:scale-125', !isDesktop && 'group-active:scale-125')}
             src={imageCache[props.genieSrc].cacheValue}
        />
      }
    </div>
  )
}
