import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { CarouselItemResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useMode2HallPageModalStore } from '@mode2/zustand/page/hallPageStore';
import { t } from 'i18next';
import dayjs from 'dayjs';
import Checkbox from '@mode2/components/Checkbox';
import Icon from '@libs/mode2/components/Icon';
import useBonusAnnounceModelActions from '@mode2/action/bonusAnnounceModelAction/useBonusAnnounceModelActions';
import {
  handleBonusAnnounceCloseClick,
  handleBonusAnnounceItemClick,
} from '@mode2/action/bonusAnnounceModelAction/actionType';
import fallbackImg from '@constant/fallbackBase64';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useBonusAnnounceModelBase from '@mode2/usecase/modal/bonusAnnounceModel/useBonusAnnounceModelBase';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';

const CloseButton = ({
  customClass,
  closePop,
}: {
  customClass?: string;
  closePop?: () => void;
}) => {
  return (
    <button
      className={cx(
        'flex justify-center items-center cursor-pointer h-6 w-6 p-1 rounded-full border border-solid z-[2] border-white',
        customClass
      )}
      onClick={() => {
        closePop && closePop();
      }}
    >
      <Icon className="w-full" name="ic_close" />
    </button>
  );
};

interface BonusBannerImageProps extends CarouselItemResult {
  closePop?: () => void;
}

const BonusBannerImage = (props: BonusBannerImageProps) => {
  const [isError, setError] = useState(false);
  const { handleBonusAnnounceModelClick } = useBonusAnnounceModelActions();

  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden';
    e.currentTarget.style.maxHeight = '0px';
    setError(true);
  };
  const aspectClass = 'aspect-[1.078947368421053]'; // 410x380
  return (
    <div
      className={'w-full h-full cursor-pointer'}
      onClick={() => {
        handleBonusAnnounceModelClick({
          actionName: handleBonusAnnounceItemClick,
          payload: { type: props.type },
        });
        props.closePop && props.closePop();
      }}
    >
      {isError ? (
        <div
          className={cx('w-full h-full pt-14 pb-10 rounded-lg', aspectClass)}
        >
          <img className="object-contain m-auto h-full" src={fallbackImg} />
        </div>
      ) : null}

      <BaseCacheImg
        src={props.bannerUrl}
        alt={`${props.type}`}
        className={'w-full h-full'}
        onLoad={() => {}}
        onError={(e) => {
          handleOnError(e);
        }}
      />
    </div>
  );
};

/** 首頁獎勵公告modal */
export const BonusAnnounceModel = () => {
  const { handleBonusAnnounceModelClick } = useBonusAnnounceModelActions();
  const location = useLocation();

  const [isNotShowToday, setIsNotShowToday] = useState<boolean>(false);
  const { carouselList } = useBonusAnnounceModelBase();

  const apkInfoId = usePlatformNotifyStore((state) => state.apkInfoId);
  const isShowBonusModal = useMode2HallPageModalStore(
    (state) => state.isShowBonusModal
  );

  const closePop = () => {
    // 有勾選時, 關閉時才要將modal相關資訊存到local storage
    if (isNotShowToday) {
      const currentTime = +dayjs().startOf('day').unix();
      userLocalForage.setItem(
        UserLocalforageStoreKeys.BONUS_POPUP_INFO,
        `${currentTime};${apkInfoId}`
      );
    }
    handleBonusAnnounceModelClick({
      actionName: handleBonusAnnounceCloseClick,
    });
  };

  useEffect(() => {
    return () => {
      handleBonusAnnounceModelClick({
        actionName: handleBonusAnnounceCloseClick,
      });
    };
  }, [location]);

  const frameAspectClass = 'aspect-[1.076115485564304]'; // 410x381
  return (
    isShowBonusModal && (
      <BaseModal>
        <>
          <div
            className={cx(
              'relative w-full text-center',
              'w-[328px]',
              'mobile:w-[410px]',
              'tablet:w-[446px]',
              frameAspectClass
            )}
          >
            <img
              className={cx(
                'absolute top-0 left-1/2 w-full h-full -translate-x-1/2 rounded-lg'
              )}
              src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_frame')}
              alt="popup_frame"
            />

            <CloseButton
              customClass="absolute top-3 right-3 hidden tablet:block"
              closePop={closePop}
            />

            <div>
              <Swiper
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                observer={true}
                loop={true}
                observeParents={false}
                modules={[Autoplay]}
              >
                {carouselList.map((item: CarouselItemResult, index: number) => {
                  return (
                    <SwiperSlide
                      key={index}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <BonusBannerImage {...item} closePop={closePop} />
                    </SwiperSlide>
                  );
                })}
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

          <div className="flex justify-center mt-3 block tablet:hidden">
            <CloseButton closePop={closePop} />
          </div>
        </>
      </BaseModal>
    )
  );
};
