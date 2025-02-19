import BaseModal from '@libs/components/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRef, useState } from 'react';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';
import { TUTORIAL_DATA_MAP } from './const';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { useTranslation } from 'react-i18next';

const paginationSetting = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return `<span class="${className} !w-1 !h-1 !rounded-full mt-10"></span>`;
  },
};

const TutorialModal = ({
  type,
  onClose,
}: {
  type: PayActivationResult;
  onClose?: () => void;
}) => {
  const layout = TUTORIAL_DATA_MAP[type] || [];
  const swiperRef = useRef<SwiperCore | null>(null);
  const handleSlidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  return (
    <BaseModal>
      <div className="relative bgi-[var(--linear-8-main)] rounded-lg px-6 py-8 border border-[var(--grayscale-50)] w-[328px] mobile:w-[352px]">
        <div
          className={cx(
            'absolute right-2 top-2 mobile:right-2 mobile:top-2 p-1 border border-[var(--transparent-white-70)] rounded-full cursor-pointer'
          )}
          onClick={onClose}
        >
          <Icon
            className="w-4 h-4"
            name="ic_close"
            color="var(--transparent-white-70)"
          />
        </div>
        <div
          className={cx(
            'text-[var(--grayscale-100)]',
            'text-xl max-mobile:text-lg'
          )}
        >
          {t(layout.title)}
        </div>
        <div className="w-full h-0.5 bgi-[var(--linear-3)] my-3" />
        <div className="relative">
          <button
            className={cx(
              'absolute left-0 -translate-x-1/2  top-24 z-10',
              activeIndex === 0 ? 'hidden' : ''
            )}
            onClick={handleSlidePrev}
          >
            <div className="bgi-[var(--base-1-main)] p-1 rounded-full">
              <Icon name="ic_arrow_left_1" className="w-5 h-5" />
            </div>
          </button>
          <button
            className={cx(
              'absolute right-0 translate-x-1/2  top-24 z-10',
              activeIndex === layout.data.length - 1 ? 'hidden' : ''
            )}
            onClick={handleSlideNext}
          >
            <div className="bgi-[var(--base-1-main)] p-1 rounded-full">
              <Icon name="ic_arrow_right_1" className="w-5 h-5" />
            </div>
          </button>
          <Swiper
            autoHeight
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={0}
            slidesPerView={'auto'}
            modules={[Pagination]}
            pagination={paginationSetting}
          >
            {layout.data.map((item) => (
              <SwiperSlide>
                <img
                  className="w-full"
                  src={getImgUrl(EResourceLevel.V, `${item.image}_${'en'}`)}
                  alt=""
                />
                <div className="text-[var(--grayscale-100)] text-base mt-3 font-semibold">
                  {t(item.title)}
                </div>
                <div className="mt-1 text-[var(--grayscale-90)] text-base">
                  {t(item.dec)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </BaseModal>
  );
};
export default TutorialModal;
