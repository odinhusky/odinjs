import {useEffect} from "react";
import {useImageLoad} from "../../../../../hooks/useImageLoag";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {environment} from "../../../../../../../environments/environment";

type ICarouselImage = {
  srcName: string;
  alt: string;
}
export const CarouselImage = (props: ICarouselImage) => {
  const {loadImageAndCache, imageCache} = useImageLoad()
  const {isMobile, isTablet} = useBreakpoint();
  const expirationSec = 60 * 10;
  const srcRef = `assets/${environment.uVersion}/${environment.mvVersion}/${props.srcName}${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  useEffect(() => {
    loadImageAndCache(srcRef, srcRef, expirationSec);
  }, [isMobile]);

  return imageCache[srcRef]
    ? (<img
      alt={props.alt}
      className={"w-[100vw]"}
      src={imageCache[srcRef].cacheValue}
    />)
    : (<></>)
}
