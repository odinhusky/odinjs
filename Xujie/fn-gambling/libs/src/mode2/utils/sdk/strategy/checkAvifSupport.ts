// import sdkUtils from '@mode2/utils/sdk';
// import {AppLocalStorageKey} from '@mode2/utils/sdk/persistant/storageKey';
//
// // 檢查瀏覽器是否支持webp
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

export const checkAvifSupport: () => Promise<boolean> = async () => {
  const isAvifSupport = sdkUtils.getStorage(AppLocalStorageKey.IS_AVIF_SUPPORT);
  return new Promise((resolve) => {
    if (isAvifSupport === null) {
      const img = new Image();
      img.src =
        'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
      img.onload = () => {
        sdkUtils.setStorage(AppLocalStorageKey.IS_AVIF_SUPPORT, 'true');
        return resolve(true);
      };
      img.onerror = () => {
        sdkUtils.setStorage(AppLocalStorageKey.IS_AVIF_SUPPORT, 'false');
        return resolve(false);
      };
    } else {
      return resolve(isAvifSupport === 'true');
    }
  });
};

export default checkAvifSupport;
