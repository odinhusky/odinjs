import React, {useState} from "react";
import {AppCarousel} from "../../Carousel";

import {PrimeiraRecargCarouselContent} from "../../Carousel/env/u7/PrimeiraRecargCarouselContent";
import {CashbackCarouselContent} from "../../Carousel/env/u7/CashbackCarouselContent";
import {RecommendCarouselContent} from "../../Carousel/env/u7/RecommendCarouselContent";
import {VipCarouselContent} from "../../Carousel/env/u7/VipCarouselContent";
import {CheckInCarouselContent} from "../../Carousel/env/u7/CheckInCarouselContent";
import {AboutUsCarouselContent} from "../../Carousel/env/u7/AboutUsCarouselContent";


const AppCarouselItem = () => {
    const [isMoving, setIsMoving] = useState(false);

    return (
        <AppCarousel setIsMoving={setIsMoving}>
            <CheckInCarouselContent isMoving={isMoving}/>
            <VipCarouselContent isMoving={isMoving}/>
            <PrimeiraRecargCarouselContent isMoving={isMoving}/>
            <CashbackCarouselContent isMoving={isMoving}/>
            <RecommendCarouselContent isMoving={isMoving}/>
            <AboutUsCarouselContent isMoving={isMoving}/>
        </AppCarousel>
    )

}

export default AppCarouselItem;
