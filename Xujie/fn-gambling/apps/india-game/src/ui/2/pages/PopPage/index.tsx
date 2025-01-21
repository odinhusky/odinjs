import cx from '@libs/commonUtils/cx';
import Icon from '@libs/mode2/components/Icon';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  useNavigateClick,
  useNavPageClick,
} from '@libs/mode2/usecase/useNavPageClick';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils/img/getImgUrl';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useFooterStore } from '@libs/mode2/zustand/components/footerStore';
import { LoginFormType } from '@libs/mode2/zustand/loginStore';
import { useEffect, useRef, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import Marquee from 'react-fast-marquee';
import { useManufacturerListBase } from '@mode2/usecase/components/useManufacturerListBase';
import LazyImage from '@components/LazyImage';

const bannerList = Array.from({ length: 9 }, (v, i) => `pop/banner_${i + 1}`);
const smList = [
  {
    img: 'pop/banner_sm_6',
  },
  {
    img: 'pop/banner_sm_7',
    detail: (
      <div className="text-[var(--grayscale-100)] text-sm font-medium p-2">
        <div>VIP Bonus!</div>
        <div>
          🙌 - Level up rewards{' '}
          <span className="text-[#FFE100]">₹20 - ₹30000</span>!
        </div>
        <div>
          🙌 - Monthly rewards{' '}
          <span className="text-[#FFE100]">₹30 - ₹99999</span>!
        </div>
      </div>
    ),
  },
  {
    img: 'pop/banner_sm_8',
  },
  {
    img: 'pop/banner_sm_9',
  },
];
const PopPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { navToLoginPage } = useNavPageClick();
  useManufacturerListBase();

  const swiperRef = useRef<SwiperCore | null>(null);
  const handleSlidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(
        activeIndex > 0 ? activeIndex - 1 : bannerList.length - 1
      );
    }
  };

  const handleSlideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(
        activeIndex < bannerList.length - 1 ? activeIndex + 1 : 0
      );
    }
  };
  const manufacturerList = useFooterStore((state) => state.manufacturerList);
  const containerRef = useRef<HTMLDivElement>(null);
  const [btnActive, setBtnActive] = useState(false);
  const navigate = useNavigateClick();

  const handleToLogin = () => {
    navigate(BasePagePathObj.HallPage);
    if (!sdkUtils.isCurrentLogin()) {
      navToLoginPage(true, LoginFormType.REGISTER);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('referral_code');
    referralCode && sdkUtils.getStorage(AppLocalStorageKey.REFERRAL_CODE);
  }, []);
  const widthClass = 'm-auto max-w-[750px] px-4';
  return (
    <div className="bgi-[var(--bg-main)]">
      <div className={cx(widthClass, 'bgi-[var(--grayscale-10)]')}>
        <div className="relative">
          <button
            className={cx('absolute left-3 -translate-y-1/2 z-10 top-1/2')}
            onClick={handleSlidePrev}
          >
            <div className="bgi-[var(--transparent-gray-50)] p-1 rounded-full">
              <Icon name="ic_arrow_left_1" className="w-5 h-5" />
            </div>
          </button>
          <button
            className={cx('absolute   -translate-y-1/2 z-10 top-1/2 right-3')}
            onClick={handleSlideNext}
          >
            <div className="bgi-[var(--transparent-gray-50)] p-1 rounded-full">
              <Icon name="ic_arrow_right_1" className="w-5 h-5" />
            </div>
          </button>
          <Swiper
            autoHeight
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={0}
            slidesPerView={'auto'}
            modules={[Autoplay]}
          >
            {bannerList.map((item, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-full"
                  src={getImgUrl(EResourceLevel.V, item)}
                  alt=""
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Marquee
          ref={containerRef}
          className="py-2 my-4 bg-[var(--grayscale-00)]"
        >
          {manufacturerList.map((item) => (
            <LazyImage
              key={item}
              alt={item}
              ref={containerRef}
              src={getImgUrl(EResourceLevel.SHARED, `manufacturer/${item}`)}
              className="h-6 ml-4"
            />
          ))}
        </Marquee>
        <div className="px-3.5 flex flex-col gap-3 pb-[35%]">
          {smList.map((item) => (
            <div key={item.img}>
              <div className="p-1 bg-[var(--grayscale-20)] rounded-lg">
                <img
                  className="rounded-lg"
                  src={getImgUrl(EResourceLevel.V, item.img)}
                  alt="banner_sm"
                />
                <div>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={cx(
            widthClass,
            'fixed bottom-0 left-0 right-0 bg-[var(--grayscale-00)] py-7 px-12'
          )}
        >
          <button className="relative">
            <img
              onMouseDown={() => {
                setBtnActive(true);
              }}
              onMouseUp={() => {
                setBtnActive(false);
              }}
              src={getImgUrl(
                EResourceLevel.V,
                btnActive ? 'pop/btn_active' : 'pop/btn_default'
              )}
              alt="button"
              onClick={handleToLogin}
            />
          </button>
          <img
            className=" absolute right-14 top-8 w-14 rotate-90"
            src={getImgUrl(EResourceLevel.V, 'pop/hand', '.gif')}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default PopPage;
