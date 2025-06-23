import { cx } from '@libs/commonUtils';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { SWIPER_ACTION_BUTTON_SIZE_CLASS } from '../..';
import { usePlatformServicesStore } from '@libs/mode2/zustand/platform/platformServicesStore';
import { handleSwiperActionButtonTelegramClick } from '@libs/mode2/action/actionTypes';
import sdkUtils from '@libs/mode2/utils/sdk';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import { useCallback } from 'react';
import { ServicesTypeResult } from '@libs/mode2/external/api/endpoint/user/PostHomeEndpoint';
import { AppSchemeData } from '@constant/AppSchemeData';

export const SwiperActionButtonTelegram = () => {
  const servicesList = usePlatformServicesStore((state) => state.servicesList);
  const findLink = useCallback(
    (type: ServicesTypeResult, def: string): string => {
      const link = servicesList.find((item) => item.type === type)?.link;
      return link || def;
    },
    [servicesList]
  );
  const getOfficialUrl = (type: ServicesTypeResult): string => {
    const key = type.toLowerCase().replace('_', '');
    const schemeData = AppSchemeData[key];
    return schemeData?.url || '';
  };

  const target = findLink(
    ServicesTypeResult.TELEGRAM,
    getOfficialUrl(ServicesTypeResult.TELEGRAM)
  );

  // console.log('!! servicesList', servicesList);
  // console.log('!! target', target);

  return (
    <button
      type="button"
      className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}
      onClick={() => {
        handleGlobalClick({
          target: handleSwiperActionButtonTelegramClick,
          callback: () => {
            if (target) sdkUtils.openBrowser(target);
          },
        });
      }}
    >
      <BaseCacheImg
        src={getImgUrl(EResourceLevel.V, 'swiper_action_button_telegram')}
        className={cx('w-full h-full')}
      />
    </button>
  );
};

export default SwiperActionButtonTelegram;
