import { AppCarousel } from "../../Carousel";
import React, { useState } from "react";

import {AppCarouselContent} from '../../Carousel/env/p1/AppCarouselContent'
import {AppCarouselContent2} from '../../Carousel/env/p1/AppCarouselContent2'
import {AppCarouselContent3} from '../../Carousel/env/p1/AppCarouselContent3'
import {AppCarouselContent4} from '../../Carousel/env/p1/AppCarouselContent4'
import {AppCarouselContent5} from '../../Carousel/env/p1/AppCarouselContent5'


const AppCarouselItem = () => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <AppCarousel setIsMoving={setIsMoving}>
      <AppCarouselContent isMoving={isMoving}/>
      <AppCarouselContent2 isMoving={isMoving}/>
      <AppCarouselContent3 isMoving={isMoving}/>
      <AppCarouselContent4 isMoving={isMoving}/>
      <AppCarouselContent5 isMoving={isMoving}/>
    </AppCarousel>
  )
}

export default AppCarouselItem;
