import React, { useState } from 'react';
import { AppCarousel } from '../../Carousel';
import { IndexBannerType } from '../../hooks/useU9IndexPageBase';
import U9CarouselContent from '../../Carousel/env/u9/U9CarouselContent';

export interface U9AppCarouselPropsType {
  indexBannersList: IndexBannerType[];
}

export const U9AppCarousel = ({ indexBannersList }: U9AppCarouselPropsType) => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <AppCarousel setIsMoving={setIsMoving}>
      {indexBannersList.map((item) => {
        return (
          <U9CarouselContent key={item.id} isMoving={isMoving} {...item} />
        );
      })}
    </AppCarousel>
  );
};

export default U9AppCarousel;
