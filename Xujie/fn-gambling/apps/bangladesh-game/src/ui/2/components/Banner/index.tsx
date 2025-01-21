import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useBreakPoint } from '@libs/commonUtils';
import 'swiper/css';
import 'swiper/css/pagination';
import './index.scss';
import fallbackImg from '@constant/fallbackBase64';
import paginationSetting from './paginationSetting';

import {
  AnnouncementItem,
  useMode2BannerActionsStore,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import { SyntheticEvent, useState } from 'react';
import cx from '@commonUtils/cx';
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

  return (
    <div className="">
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        centeredSlides={false}
        slideToClickedSlide={false}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        observer={true}
        observeParents={false}
        modules={[Autoplay, Pagination]}
        pagination={paginationSetting}
      >
        {bannerList.map((item: AnnouncementItem, index: number) => {
          return (
            <SwiperSlide
              className="relative"
              key={index}
              style={{ width: isMobile ? '100%' : '61.42%', height: 'auto' }}
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
