import {AppCarousel} from "../../Carousel";
import React, {useState} from "react";
import {PrimeiraRecargCarouselContent} from "../../Carousel/env/u5/PrimeiraRecargCarouselContent";
import {CheckInCarouselContent} from "../../Carousel/env/u5/CheckInCarouselContent";
import {VipCarouselContent} from "../../Carousel/env/u5/VipCarouselContent";
import {AboutUsContent} from "../../Carousel/env/u5/AboutUsContent";
import {CashbackCarouselContent} from "../../Carousel/env/u5/CashbackCarouselContent";
import {RecommendCarouselContent} from "../../Carousel/env/u5/RecommendCarouselContent";


const AppCarouselItem = () => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <AppCarousel setIsMoving={setIsMoving}>
      <CheckInCarouselContent isMoving={isMoving}/>
      <VipCarouselContent isMoving={isMoving}/>
      <AboutUsContent isMoving={isMoving}/>
      <PrimeiraRecargCarouselContent isMoving={isMoving}/>
      <CashbackCarouselContent isMoving={isMoving}/>
      <RecommendCarouselContent isMoving={isMoving}/>
    </AppCarousel>
  )
}

export default AppCarouselItem
