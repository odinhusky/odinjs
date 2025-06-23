import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './index.scss';
import fallbackImg from '@constant/fallbackBase64';
import paginationSetting from './paginationSetting';

import {
  AnnouncementItem,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import { SyntheticEvent, useRef, useState } from 'react';
import cx from '@commonUtils/cx';
import LazyImage from '@components/LazyImage';
import { BannerProps } from '../BannerProps';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useHallPageActions from '@mode2/action/hallPageAction/useHallPageActions';
import { handleBannerClickSwipe } from '@mode2/action/actionTypes';

const BannerImage = (props: { item: AnnouncementItem; index: number }) => {
  const [isError, setError] = useState(false);

  const { handleHallPageClick } = useHallPageActions();
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
      className={cx(
        'cursor-pointer',
        'aspect-[2.2]'
        // {
        // 'aspect-[2.15]': isError,
        // }
      )}
      onClick={() => {
        handleHallPageClick({
          actionName: handleBannerClickSwipe,
          payload: {
            item: props.item,
          },
        });
      }}
    >
      {isError ? (
        <div
          className={cx(
            'absolute top-0 right-0 left-0 bottom-0 bgi-[#F3F3F3FF] rounded-lg flex items-center justify-center '
          )}
        >
          <BaseCacheImg
            className="object-contain w-auto h-full"
            imgName="fallbackImgBase64"
            src={fallbackImg}
          />
        </div>
      ) : null}

      <LazyImage
        ref={containerRef}
        className={'object-fill w-full aspect-[2.2]'}
        src={bannerUrl}
        imgName={bannerUrl}
        alt={`${props.index}_${props.item.type}`}
        onLoad={() => {}}
        onError={(e) => {
          handleOnError(e);
        }}
      />
    </div>
  );
};

// export interface BannerProps {
//   bannerSwipeDuration?: number;
// }
const Banner = ({ bannerSwipeDuration }: BannerProps) => {
  const bannerList = useMode2BannerStore((state) => state.bannerList);

  return (
    <div className="">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        slidesPerGroup={1}
        centeredSlides={false}
        slideToClickedSlide={false}
        loop={bannerList.length > 1}
        autoplay={{
          delay: bannerSwipeDuration ? bannerSwipeDuration : 5000,
          disableOnInteraction: false,
        }}
        observer={true}
        observeParents={false}
        modules={[Autoplay, Pagination]}
        pagination={paginationSetting}
      >
        {bannerList.map((item: AnnouncementItem, index: number) => {
          return (
            <SwiperSlide
              className="relative w-full mobile:!w-[61.42%] h-auto"
              key={index}
            >
              <BannerImage index={index} item={item} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;
