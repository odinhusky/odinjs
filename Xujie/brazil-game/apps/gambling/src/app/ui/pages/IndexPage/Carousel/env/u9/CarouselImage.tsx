// import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import { CacheImage } from '../../../../../components/image/CacheImage';
import cx from '../../../../../utils/cx';
import React from 'react';

type ICarouselImage = {
  genieSrc: string;
  className?: string;
  alt: string;
};
export const CarouselImage = (props: ICarouselImage) => {
  return (
    <div className={cx('relative overflow-hidden', 'pb-1.5')}>
      <CacheImage
        alt={'genie'}
        src={props.genieSrc}
        className={cx('w-[100vw]', props.className)}
      >
        <img className={'w-[100vw]'} src={props.genieSrc} />
      </CacheImage>
    </div>
  );
};
