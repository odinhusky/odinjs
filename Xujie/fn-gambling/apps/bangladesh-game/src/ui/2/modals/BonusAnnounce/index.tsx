import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Image } from 'antd';
import 'swiper/css';
import 'swiper/css/pagination';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import sdkUtils from '@mode2/utils/sdk';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { CarouselItemResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useBreakPoint } from '@libs/commonUtils';
import { useMode2HallPageModalStore } from '@mode2/zustand/page/hallPageStore';
import { t } from 'i18next';
import dayjs from 'dayjs';
import Checkbox from '@mode2/components/Checkbox';
import Icon from '@libs/mode2/components/Icon';
import { AnnouncementType } from '@mode2/@types/announcementType';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';

const CloseButton = ({
  onClose,
  customClass,
}: {
  onClose: () => void;
  customClass?: string;
}) => {
  return (
    <button
      className={cx(
        'flex justify-center items-center cursor-pointer h-6 w-6 p-1 rounded-full border border-solid z-[2] border-white',
        customClass
      )}
      onClick={onClose}
    >
      <Icon className="w-full" name="ic_close" />
    </button>
  );
};

/** 首頁獎勵公告modal */
export const BonusAnnounce = () => {
  const { isMobile, isDesktop, isTablet } = useBreakPoint();
  const location = useLocation();

  const [isNotShowToday, setIsNotShowToday] = useState<boolean>(false);

  const carouselItems = usePlatformNotifyStore((state) => state.carouselItems);
  const apkInfoId = usePlatformNotifyStore((state) => state.apkInfoId);
  const isShowBonusModal = useMode2HallPageModalStore(
    (state) => state.isShowBonusModal
  );

  const setIsShowBonusModal = useMode2HallPageModalStore(
    (state) => state.setIsShowBonusModal
  );

  const handleClose = () => {
    setIsShowBonusModal(false);
  };

  const closePop = () => {
    sdkUtils.playSound();

    handleClose();

    // 有勾選時, 關閉時才要將modal相關資訊存到local storage
    if (isNotShowToday) {
      const currentTime = +dayjs().startOf('day').unix();
      userLocalForage.setItem(
        UserLocalforageStoreKeys.BONUS_POPUP_INFO,
        `${currentTime};${apkInfoId}`
      );
    }
  };

  const handleCarouselItemClick = (type: AnnouncementType) => {
    closePop();
  };

  useEffect(() => {
    return () => {
      handleClose();
    };
  }, [location]);

  return (
    isShowBonusModal && (
      <BaseModal>
        <>
          <div
            className={cx('relative w-full text-center', {
              'h-[304px] w-[328px]': isMobile,
              'h-[380px] w-[410px]': isTablet,
              'h-[430px] w-[430px]': isDesktop,
            })}
          >
            <img
              className={cx(
                'absolute top-0 left-1/2 w-full h-full -translate-x-1/2 rounded-lg'
              )}
              src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_frame')}
              alt="popup_frame"
            />

            {isDesktop && (
              <CloseButton
                onClose={() => closePop()}
                customClass="absolute top-3 right-3"
              />
            )}

            <div>
              <Swiper
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                observer={true}
                loop={true}
                observeParents={false}
                modules={[Autoplay]}
              >
                {carouselItems.map(
                  (item: CarouselItemResult, index: number) => {
                    return (
                      <SwiperSlide
                        key={index}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <Image
                          width={'100%'}
                          height={'100%'}
                          src={item.bannerUrl}
                          preview={false}
                          onClick={() => handleCarouselItemClick(item.type)}
                        />
                      </SwiperSlide>
                    );
                  }
                )}
              </Swiper>
            </div>
            <img
              className="absolute bottom-0 left-0"
              src={getImgUrl(EResourceLevel.V, 'home_popup_invite_bottom')}
              alt="bottom img"
            />
          </div>

          <div className={cx('flex align-center mt-[16px]')}>
            <Checkbox
              checked={isNotShowToday}
              onChange={() => setIsNotShowToday(!isNotShowToday)}
              label={t('popup_home_not_displayed_today')}
            />
          </div>

          {!isDesktop && (
            <div className="flex justify-center mt-3">
              <CloseButton onClose={() => closePop()} />
            </div>
          )}
        </>
      </BaseModal>
    )
  );
};
