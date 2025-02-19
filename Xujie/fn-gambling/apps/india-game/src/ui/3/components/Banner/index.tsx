import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import fallbackImg from '@constant/fallbackBase64';
import {
  AnnouncementItem,
  useMode2BannerActionsStore,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import { SyntheticEvent, useRef, useState } from 'react';
import cx from '@commonUtils/cx';
import LazyImage from '@components/LazyImage';

const BannerImage = (props: { item: AnnouncementItem; index: number }) => {
  const [isError, setError] = useState(false);

  const bannerActionList = useMode2BannerActionsStore(
    (state) => state.bannerActionList
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden';
    e.currentTarget.style.maxHeight = 'max-content';
    setError(true);
  };
  const bannerUrl = props.item.bannerUrl;

  return (
    <div
      ref={containerRef}
      className={cx('cursor-pointer', {
        'aspect-[3.343]': isError,
      })}
      onClick={() => {
        bannerActionList[props.index]();
      }}
    >
      {isError ? (
        <div
          className={cx(
            'absolute top-0 right-0 left-0 bottom-0 bgi-[#F3F3F3FF] rounded-lg flex items-center justify-center '
          )}
        >
          <img className="object-contain w-auto h-full" src={fallbackImg} />
        </div>
      ) : null}

      <LazyImage
        ref={containerRef}
        className={'object-fill w-full aspect-[3.343]'}
        src={bannerUrl}
        alt={`${props.index}_${props.item.type}`}
        onLoad={() => {}}
        onError={(e) => {
          handleOnError(e);
        }}
      />
    </div>
  );
};
const Banner = () => {
  const bannerList = useMode2BannerStore((state) => state.bannerList);

  return (
    <div className={cx('aspect-[3.582]')}>
      {bannerList.length === 0 ? (
        <div
          className={cx(
            'bgi-[var(--base-2-variant12)] rounded-lg flex items-center justify-center w-auto h-full',
            'animate-pulse'
          )}
        />
      ) : (
        <Swiper
          className={cx('min-h-max')}
          spaceBetween={16}
          slidesPerView={'auto'}
          centeredSlides={false}
          slideToClickedSlide={false}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          observer={true}
          observeParents={false}
          modules={[Autoplay]}
        >
          {bannerList.map((item: AnnouncementItem, index: number) => {
            return (
              <SwiperSlide className="relative w-full h-full" key={index}>
                <BannerImage index={index} item={item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;
