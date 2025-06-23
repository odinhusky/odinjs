import { useTranslation } from 'react-i18next';
import { EResourceLevel } from '@libs/mode2/utils';
import { useMode2HallPageDownloadBannerStore } from '@mode2/zustand/page/hallPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { cx, useBreakPoint, useImgUrlByBreakPoint } from '@libs/commonUtils';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const ApkDownloadBanner = () => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useBreakPoint();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const setIsShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.setIsShowDownloadBanner
  );
  const isShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.isShowDownloadBanner
  );

  const appName = `${sdkUtils.productName()} APP`;

  const handleDownloadClick = () => {
    const shouldPreventApkDownload =
      sdkUtils.isPwaInstalled() ||
      sdkUtils.isInNative() ||
      sdkUtils.isIOSKernel();

    if (!shouldPreventApkDownload) {
      const url = import.meta.env.VITE_DOWNLOAD_APK_URL;
      window.open(url, '_blank');
    }
  };

  const needDownloadApk =
    !sdkUtils.isPwaInstalled() &&
    !sdkUtils.isInNative() &&
    !sdkUtils.isIOSKernel();

  const shouldShowDownloadBanner = needDownloadApk && isShowDownloadBanner;

  return (
    shouldShowDownloadBanner && (
      <div
        className="relative overflow-hidden flex gap-2 bgi-[var(--linear-8-main)] mobile:h-[68px] h-16
            mobile:py-2 py-[5px] tablet:pr-4 tablet:pl-[76px] mobile:pr-6 mobile:pl-[60px] pr-2 pl-8 tablet:mb-5 mb-0
            tablet:rounded-lg rounded-none items-center justify-between"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full">
          <BaseCacheImg
            className="h-full"
            src={getImgUrlByBreakPoint(
              'bg_download',
              EResourceLevel.V,
              isTablet,
              isMobile
            )}
            imgName={`bg_download${isMobile ? '_m' : isTablet ? '_t' : ''}`}
            alt="icon"
          />
        </div>
        <div
          className="flex flex-col mobile:gap-1 gap-0 mobile:ml-[72px] ml-[52px]
              mobile:text-base text-sm font-semibold"
        >
          <span className="bgi-text-[var(--base-2-main)] drop-shadow-[0px_1px_2px_#00000066]">
            {appName}
          </span>
          <span className="bgi-text-[var(--base-2-main)]">
            {t('home_download_better_experience')}
          </span>
        </div>

        <BaseSecondaryBtn
          className={cx(
            'w-auto h-auto',
            'font-medium',
            'text-sm  mobile:text-base',
            'py-1 px-4 tablet:py-2'
          )}
          onClick={handleDownloadClick}
          children={
            <div className={cx(FLEX_ITEMS_CENTER)}>
              <Icon
                className="h-5 w-5 mobile:h-6 mobile:w-6 p-[2px]"
                name="ic_download"
              />
              <span className="bgi-text-[var(--grayscale-100)]">
                {t('home_download_btn_download')}
              </span>
            </div>
          }
        />

        <BaseSecondaryBtn
          className={cx(
            'mobile:w-10 mobile:h-10 w-6 h-6',
            'rounded-full',
            'absolute mobile:-top-4 mobile:-left-4 -top-[10px] -left-[10px]'
          )}
          onClick={() => setIsShowDownloadBanner(false)}
          children={
            <Icon
              className="absolute mobile:w-4 mobile:h-4 w-[11px] h-[11px] mobile:right-[6px] mobile:bottom-[6px] right-[3px] bottom-[3px]"
              name="ic_close_4"
            />
          }
        />
      </div>
    )
  );
};

export default ApkDownloadBanner;
