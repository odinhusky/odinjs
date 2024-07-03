import React, {useState} from "react";
import {AppCarousel} from "../../Carousel";

import {PrimeiraRecargCarouselContent} from "../../Carousel/env/u6/PrimeiraRecargCarouselContent";
import {CashbackCarouselContent} from "../../Carousel/env/u6/CashbackCarouselContent";
import {RecommendCarouselContent} from "../../Carousel/env/u6/RecommendCarouselContent";
import {VipCarouselContent} from "../../Carousel/env/u6/VipCarouselContent";
import {CheckInCarouselContent} from "../../Carousel/env/u6/CheckInCarouselContent";
import {AboutUsCarouselContent} from "../../Carousel/env/u6/AboutUsCarouselContent";


const AppCarouselItem = () => {
    const [isMoving, setIsMoving] = useState(false);

    return (
        <AppCarousel setIsMoving={setIsMoving}>
            <PrimeiraRecargCarouselContent isMoving={isMoving}/>
            <CashbackCarouselContent isMoving={isMoving}/>
            <RecommendCarouselContent isMoving={isMoving}/>
            <VipCarouselContent isMoving={isMoving}/>
            <CheckInCarouselContent isMoving={isMoving}/>
            <AboutUsCarouselContent isMoving={isMoving}/>
        </AppCarousel>
    )

}

export default AppCarouselItem;
