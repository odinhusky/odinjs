import useMode2SharePageBase from '@/ui/hooks/pages/SharePage/useMode2SharePageBase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@libs/commonUtils';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { SocialList } from '@components/SocialList';
import Icon from '@components/Icon';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { QRCode } from 'antd';
import useSharePageAction from '@mode2/action/sharePageAction/useSharePageAction';
import {
  handleSharePageClipboardClick,
  handleSharePageSaveImageClick,
} from '@mode2/action/actionTypes';
import { t } from 'i18next';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useMode2SharePageStore } from '@libs/mode2/zustand/page/sharePageStore';

export const SharePage = () => {
  useMode2SharePageBase();

  const headerElementRef = useTemplateLayoutStore(
    (state) => state.headerElementRef
  );
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const { handleSharePageClick } = useSharePageAction();

  const id = useUserProfileStore((state) => state.id);
  const sharePosterList = useMode2SharePageStore(
    (state) => state.sharePosterList
  );
  const referralLink = useUserProfileStore((state) => state.referralLink);

  const swiperRef = useRef<SwiperCore | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const asImageRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrent(swiper.realIndex);
  };

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

  useEffect(() => {
    if (headerElementRef && headerElementRef.current) {
      headerElementRef.current.style.position = 'fixed';
    }

    return () => {
      if (headerElementRef && headerElementRef.current) {
        headerElementRef.current.style.position = 'sticky';
      }
    };
  }, [headerElementRef]);

  const iconBlock =
    'w-[72px] h-[68px] text-xs font-medium flex flex-col items-center justify-center gap-2 bgi-[var(--transparent-white-10)] rounded-lg cursor-pointer';

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'h-full',
        'flex flex-col justify-around'
      )}
      style={{
        marginTop: headerElMetrics.height / 16 + 'rem',
        height: `calc(100vh - ${headerElMetrics.height / 16}rem)`,
      }}
    >
      <div className="w-full">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className=""
          spaceBetween={20}
          slidesPerView={'auto'}
          centeredSlides={true}
          slideToClickedSlide={false}
          loop={false}
          observer={true}
          observeParents={false}
          // initialSlide={}
          onSlideChange={handleSlideChange}
        >
          {sharePosterList.map((item, index) => {
            return (
              <SwiperSlide
                className=""
                key={index}
                style={{ width: '15.25rem', height: 'auto' }}
              >
                <div
                  ref={(el) => {
                    asImageRef.current[index] = el;
                  }}
                  key={index}
                  className={cx(
                    'w-full mt-10 mb-5 bg-black text-xxs bgi-text-[var(--transparent-white-60)] rounded-lg overflow-hidden',
                    'relative',
                    {
                      'shadow-[0px_0px_12px_0px_rgba(255,150,44,0.5)]':
                        index === current,
                    }
                  )}
                >
                  <div className="w-full flex items-center justify-center text-base">
                    <img
                      className="w-full h-[calc(100%_-_72px)]"
                      src={item}
                      alt=""
                    />
                  </div>
                  <div
                    className={cx(
                      'absolute bottom-0',
                      'w-full',
                      'p-3 box-border flex justify-between items-end'
                    )}
                  >
                    <div>
                      <div>
                        {t('earn_share_info_id')}:{' '}
                        <span className="bgi-text-[var(--grayscale-100)]">
                          {id}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        {t('earn_share_info_platform')}:
                        <span className="bgi-text-[#FFE16B]">
                          {' '}
                          {sdkUtils.productName()}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12">
                      {referralLink ? (
                        <QRCode
                          bgColor="white"
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#FFFFFF',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                          }}
                          value={referralLink}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="flex gap-2 items-center justify-center box-border">
          <Icon
            className="w-5 h-5 mr-1 cursor-pointer"
            name="ic_arrow_left_2"
            onClick={handleSlidePrev}
          />
          {sharePosterList.map((_, index) => {
            return (
              <div
                key={index}
                className={cx('w-1.5 h-1.5 rounded-full cursor-pointer', {
                  'bgi-[var(--state-warn-main)]': index === current,
                  'bgi-[var(--transparent-white-20)]': index !== current,
                })}
              ></div>
            );
          })}
          <Icon
            className="w-5 h-5 ml-1 cursor-pointer"
            name="ic_arrow_right_2"
            onClick={handleSlideNext}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <SocialList
          scenarios={SocialScenarios.SHARE}
          className="flex justify-center items-center gap-3"
          classNameUnit="w-[72px] h-[68px] gap-2 shrink-0 bgi-[var(--transparent-white-10)] rounded-lg"
          iconClassName="w-7 h-7"
          classNameLabel="text-xs font-medium"
        />
        <div className="flex items-center justify-center gap-3 ml-3">
          <div
            className={iconBlock}
            onClick={() => {
              handleSharePageClick({
                actionName: handleSharePageSaveImageClick,
                payload: {
                  asImageRef: {
                    current: asImageRef.current[current],
                  },
                },
              });
            }}
          >
            <img
              className="w-7 h-7"
              src={getImgUrl(EResourceLevel.V, 'ic_save_image')}
              alt="ic_save_image"
            />
            <div className="bgi-text-[var(--grayscale-100)]">
              {t('earn_share_save')}
            </div>
          </div>
          <div
            className={iconBlock}
            onClick={() => {
              handleSharePageClick({
                actionName: handleSharePageClipboardClick,
                payload: {
                  shareText: '',
                },
              });
            }}
          >
            <img
              className="w-7 h-7"
              src={getImgUrl(EResourceLevel.V, 'ic_copy_link')}
              alt="ic_copy_link"
            />
            <div className="bgi-text-[var(--grayscale-100)]">
              {t('earn_share_link')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
