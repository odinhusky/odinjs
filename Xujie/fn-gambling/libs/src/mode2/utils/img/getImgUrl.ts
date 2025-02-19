import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { isEmpty } from 'lodash';

const vVersion = import.meta.env['VITE_V_VERSION'];
const localPath = import.meta.env['VITE_ASSETS_IMAGES_PATH'];
const isS3ImageRes = import.meta.env['VITE_IMAGE_LOAD_S3'];
const countryCode: string = import.meta.env['VITE_COUNTRY_CODE'] || '';

// const countryCode = import.meta.env['VITE_COUNTRY_CODE'];

// s3
// const logoReplaceWhitelist: string[] = ['v5'];
// const bannerReplaceWhitelist: string[] = ['v5'];
// const vReplaceWhitelist: string[] = ['v5'];
// const sharedReplaceWhitelist: string[] = ['v5'];

// webp
// const logoExtensionWhitelist: string[] = ['v2'];
// const bannerExtensionWhitelist: string[] = ['v2'];
// const vExtensionWhitelist: string[] = ['v2'];
// const sharedExtensionWhitelist: string[] = ['v2'];

export enum EResourceLevel {
  V = 'v',
  LOGO = 'logo',
  BANNER = 'banner',
  SHARED = 'shared',
  POPUP_BANNER = 'popup_banner',
  ICONS = 'icons',
}

const replacePathVerify = () => {
  return isS3ImageRes === 'true'
    ? `${
        import.meta.env['VITE_S3_PATH']
      }/fn-images/${countryCode.toLowerCase()}`
    : localPath;
};

const replaceExtVerify = (isVerify: boolean) => {
  const isWebPSupport = sdkUtils.getStorage(AppLocalStorageKey.IS_WEBP_SUPPORT);
  return isVerify && isWebPSupport === 'true' ? '.webp' : '.png';
};

const getLogoResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}/logo`;
};

const getBannerResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}/banner`;
};

const getPopBannerResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}/popup_banner`;
};

const getIconsResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}/icons`;
};

const getVResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}`;
};

// [/UI/shared]
const getSharedResourcePath = () => {
  return `${replacePathVerify()}/shared`;
};

const getLogoExt = () => {
  return replaceExtVerify(true);
};

const getBannerExt = () => {
  return replaceExtVerify(true);
};

const getIconsExt = () => {
  return replaceExtVerify(true);
};

const getVExt = () => {
  return replaceExtVerify(true);
};

const getSharedExt = () => {
  return replaceExtVerify(true);
};

/**
 * `${getImgUrl(EResourceLevel.M,'event_banner_bg')}`
 * @param level
 * @param imageSrc
 */
export const getImgUrl = (
  level: EResourceLevel,
  imageSrc: string,
  ext: string = ''
) => {
  if (level === EResourceLevel.LOGO) {
    return `${getLogoResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getLogoExt() : ext
    }`;
  }

  if (level === EResourceLevel.BANNER) {
    return `${getBannerResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getBannerExt() : ext
    }`;
  }

  if (level === EResourceLevel.POPUP_BANNER) {
    return `${getPopBannerResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getBannerExt() : ext
    }`;
  }

  if (level === EResourceLevel.ICONS) {
    return `${getIconsResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getIconsExt() : ext
    }`;
  }

  if (level === EResourceLevel.V) {
    return `${getVResourcePath()}/${imageSrc}${isEmpty(ext) ? getVExt() : ext}`;
  }
  if (level === EResourceLevel.SHARED) {
    return `${getSharedResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getSharedExt() : ext
    }`;
  }
  return imageSrc;
};
