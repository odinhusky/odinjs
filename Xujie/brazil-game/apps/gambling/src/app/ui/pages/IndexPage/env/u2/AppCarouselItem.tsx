import { AppCarousel } from "../../Carousel";
import React, { useState } from "react";
import {AppCarouselContent} from "../../Carousel/env/u2/AppCarouselContent";
import {AppCarouselContent2} from "../../Carousel/env/u2/AppCarouselContent2";
import {AppCarouselContent3} from "../../Carousel/env/u2/AppCarouselContent3";
import {AppCarouselContent4} from "../../Carousel/env/u2/AppCarouselContent4";
import {AppCarouselContent5} from "../../Carousel/env/u2/AppCarouselContent5";
import { AppCarouselContent6 } from "../../Carousel/env/u2/AppCarouselContent6";


const AppCarouselItem = () => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <AppCarousel setIsMoving={setIsMoving}>
      <AppCarouselContent isMoving={isMoving}/>
      <AppCarouselContent2 isMoving={isMoving}/>
      <AppCarouselContent3 isMoving={isMoving}/>
      <AppCarouselContent4 isMoving={isMoving}/>
      <AppCarouselContent5 isMoving={isMoving}/>
      <AppCarouselContent6 isMoving={isMoving}/>
    </AppCarousel>
  )
}

export default AppCarouselItem
