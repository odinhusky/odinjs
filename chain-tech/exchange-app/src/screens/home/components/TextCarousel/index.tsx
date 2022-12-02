import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useTranslation } from "react-i18next";
import Animated from 'react-native-reanimated';
import { infoService } from 'services';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

const width = Dimensions.get('window').width;

const TextCarousel = () => {
    const [marquee, setMarquee] = React.useState<Marquee[]>([]);
    const ref = React.useRef<ICarouselInstance>(null);
    const { i18n } = useTranslation();

    const baseOptions = {
        vertical: true,
        width: width,
        height: 20
    } as const

    useEffect(() => {
        ref.current?.scrollTo({ count: -1, animated: true });
        infoService.getMarquees(i18n.language).then((response) => {
            setMarquee(response.data)
        })
    }, []);

    const _renderItem = (renderInfo: CarouselRenderItemInfo<Marquee>) => {
        const { item } = renderInfo;

        return (
            <Animated.View style={{ flex: 1 }}>
                <View>
                    <Text style={{ color: "white" }}>{item.title}</Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                {...baseOptions}
                ref={ref}
                style={{ width: '100%' }}
                autoPlay={true}
                autoPlayInterval={3000}
                data={marquee}
                pagingEnabled={true}
                renderItem={_renderItem}
            />
        </View>
    );
}

export default TextCarousel;