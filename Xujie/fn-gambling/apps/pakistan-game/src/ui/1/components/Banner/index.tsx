import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useBreakPoint } from '@libs/commonUtils';
import 'swiper/css';
import 'swiper/css/pagination';
import './index.scss';
import fallbackImg from '@constant/fallbackBase64';
import {
  AnnouncementItem,
  useMode2BannerActionsStore,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import { SyntheticEvent, useRef, useState } from 'react';
import cx from '@commonUtils/cx';
import BannerBorder from './BannerBorder';
import Icon from '@libs/mode2/components/Icon';
import SwiperCore from 'swiper';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const BannerImage = (props: { item: AnnouncementItem; index: number }) => {
  const [isError, setError] = useState(false);

  const bannerActionList = useMode2BannerActionsStore(
    (state) => state.bannerActionList
  );
  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden';
    e.currentTarget.style.maxHeight = 'max-content';
    setError(true);
  };

  const bannerUrl = props.item.bannerUrl;

  return (
    <div
      className={cx('cursor-pointer', {
        'aspect-[2.17] mobile:aspect-[2.15] tablet:aspect-[2.2]': isError,
      })}
      onClick={() => {
        bannerActionList[props.index]();
      }}
    >
      {isError ? (
        <div
          className={cx(
            'absolute top-0 right-0 left-0 bottom-0 bgi-[#F3F3F3FF] rounded-lg flex items-center justify-center'
          )}
        >
          <img className="object-contain w-auto h-auto" src={fallbackImg} />
        </div>
      ) : null}

      <BaseCacheImg
        src={bannerUrl}
        alt={`${props.index}_${props.item.type}`}
        className={'object-fill w-full'}
        onLoad={() => {}}
        onError={(e) => {
          handleOnError(e);
        }}
      />
    </div>
  );
};
const Banner = () => {
  const { isMobile } = useBreakPoint();
  const bannerList = useMode2BannerStore((state) => state.bannerList);
  const [activeIndex, setActiveIndex] = useState<number>();
  const swiperRef = useRef<SwiperCore | null>(null);
  const handleSlidePrev = () => {
    if (swiperRef?.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (swiperRef?.current) {
      swiperRef.current.slideNext();
    }
  };
  return (
    <div className="mode-banner relative">
      {!isMobile && (
        <>
          <div
            className="absolute cursor-pointer z-10 left-10 top-1/2 -translate-y-1/2 bg-[var(--transparent-white-50)] rounded-full p-1.5"
            onClick={handleSlidePrev}
          >
            <Icon
              className="w-5 h-5 rotate-180"
              name="arrow_right"
              color="var(--grayscale-00)"
            />
          </div>
          <div
            className="absolute cursor-pointer z-10 right-10 top-1/2 -translate-y-1/2 bg-[var(--transparent-white-50)] rounded-full p-1.5"
            onClick={handleSlideNext}
          >
            <Icon
              className="w-5 h-5"
              name="arrow_right"
              color="var(--grayscale-00)"
            />
          </div>
        </>
      )}

      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        centeredSlides={true}
        slideToClickedSlide={false}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        observer={true}
        observeParents={false}
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          renderBullet: (index: number, className: string) => {
            return `<span class="${className}"></span>`;
          },
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {bannerList.map((item: AnnouncementItem, index: number) => {
          return (
            <SwiperSlide
              className="relative"
              key={index}
              style={{
                width: isMobile ? '100%' : '70%',
                height: 'auto',
              }}
            >
              <div className="relative">
                <BannerImage index={index} item={item} />
                {index !== activeIndex && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/35" />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <BannerBorder className=" absolute w-full bottom-6 mobile:bottom-9 tablet:bottom-8  z-10  " />
    </div>
  );
};

export default Banner;
