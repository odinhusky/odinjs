import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import isEmpty from 'lodash/isEmpty';

const vVersion = import.meta.env['VITE_V_VERSION'];
const localPath = import.meta.env['VITE_ASSETS_IMAGES_PATH'];
const isS3ImageRes = import.meta.env['VITE_IMAGE_LOAD_S3'];
const countryCode: string = import.meta.env['VITE_COUNTRY_CODE'] || '';
const VITE_IMAGE_VERSION = import.meta.env['VITE_IMAGE_VERSION'];
const VITE_ICON_VERSION = import.meta.env['VITE_ICON_VERSION'];

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
  NUMBER_IMGS = 'number_imgs',
  LOTTIE_ICON = 'lottieicon',
}

const replacePathVerify = () => {
  return isS3ImageRes === 'true'
    ? `${
        import.meta.env['VITE_S3_PATH']
      }/fn-images/${countryCode.toLowerCase()}`
    : localPath;
};

interface replaceExtVerifyParamsType {
  isVerify: boolean;
  shouldAvifShow?: boolean;
  shouldWebPShow?: boolean;
}

const replaceExtVerify = ({
  isVerify,
  shouldAvifShow = false,
  shouldWebPShow = true,
}: replaceExtVerifyParamsType) => {
  const isAvifSupport = sdkUtils.getStorage(AppLocalStorageKey.IS_AVIF_SUPPORT);
  const isWebPSupport = sdkUtils.getStorage(AppLocalStorageKey.IS_WEBP_SUPPORT);

  // return '.png';
  if (!isVerify) return '.png';

  // TODO 如何實作 avif
  // if (isAvifSupport === 'true' && shouldAvifShow) return '.avif';
  if (isWebPSupport === 'true' && shouldWebPShow) return '.webp';

  return '.png';
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

const getIconsNumberImgsPath = () => {
  return `${replacePathVerify()}/${vVersion}/number_imgs`;
};

const getVResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}`;
};

// [/UI/shared]
const getSharedResourcePath = () => {
  return `${replacePathVerify()}/shared`;
};

const getLottieIconResourcePath = () => {
  return `${replacePathVerify()}/${vVersion}/lottie/icon`;
};
const getLogoExt = () => {
  return replaceExtVerify({ isVerify: true });
};

const getBannerExt = () => {
  return replaceExtVerify({ isVerify: true });
};

const getIconsExt = () => {
  return replaceExtVerify({ isVerify: true });
};

const getVExt = () => {
  return replaceExtVerify({ isVerify: true });
};

const getSharedExt = () => {
  return replaceExtVerify({ isVerify: true });
};

/**
 * `${getImgUrl(EResourceLevel.M,'event_banner_bg')}`
 * @param level
 * @param imageSrc
 * @description 給 <img> 的 src 用的
 */
export const getImgUrl = (
  level: EResourceLevel,
  imageSrc: string,
  ext: string = ''
) => {
  // const isS3ImageRes = import.meta.env['VITE_IMAGE_LOAD_S3'];

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
    }${isS3ImageRes ? `?v=${VITE_IMAGE_VERSION}` : ''}`;
  }

  if (level === EResourceLevel.ICONS) {
    return `${getIconsResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getIconsExt() : ext
    }${isS3ImageRes ? `?v=${VITE_ICON_VERSION}` : ''}`;
  }

  if (level === EResourceLevel.NUMBER_IMGS) {
    return `${getIconsNumberImgsPath()}/${imageSrc}${
      isEmpty(ext) ? getIconsExt() : ext
    }`;
  }

  if (level === EResourceLevel.V) {
    return `${getVResourcePath()}/${imageSrc}${isEmpty(ext) ? getVExt() : ext}${
      isS3ImageRes ? `?v=${VITE_IMAGE_VERSION}` : ''
    }`;
  }
  if (level === EResourceLevel.SHARED) {
    return `${getSharedResourcePath()}/${imageSrc}${
      isEmpty(ext) ? getSharedExt() : ext
    }`;
  }

  if (level === EResourceLevel.LOTTIE_ICON) {
    return `${getLottieIconResourcePath()}/${imageSrc}${
      '.json'
      // isEmpty(ext) ? getSharedExt() : ext
    }`;
  }
  return imageSrc;
};

/**
 * @param level
 * @param imageSrc
 * @description 專門給 backgroundImage 的屬性用的
 */
export const getBgImgUrl = (
  level: EResourceLevel,
  imageSrc: string,
  ext: string = '.webp'
) => getImgUrl(level, imageSrc, ext);
