import { useTranslation } from 'react-i18next';
import { useMode2HallPageDownloadBannerStore } from '@mode2/zustand/page/hallPageStore';
import sdkUtils from '@mode2/utils/sdk';
import Icon from '@libs/mode2/components/Icon';
const ApkDownloadBanner = () => {
  const { t } = useTranslation();

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
      <div className="relative overflow-hidden flex items-center justify-between h-10 w-full mobile:h-[64px] tablet:rounded-[8px] bgi-[var(--linear-1)] tablet:mb-5 py-1.5 pr-2 pl-8 mobile:py-2 mobile:pr-6 mobile:pl-10 tablet:py-3 tablet:pr-4 tablet:mt-8">
        <div className="flex flex-col font-medium bgi-text-[var(--base-2-main)] text-xs mobile:text-base ">
          <span>{appName}</span>
          <span>{t('home_download_better_experience')}</span>
        </div>

        <button
          className="flex items-center font-medium bgi-[var(--base-2-main)] rounded-[4px] text-sm  mobile:text-base py-1  px-4 tablet:py-2"
          onClick={handleDownloadClick}
        >
          <Icon
            className="h-5 w-5 mobile:h-6 mobile:w-6 mr-[4px]"
            name="ic_download"
            color="var(--grayscale-10)"
          />
          <span className="bgi-text-[var(--grayscale-10)]">
            {t('home_download_btn_download')}
          </span>
        </button>

        <button
          className="absolute -left-[16px] -top-4 -mobile:left-[24px] -mobile:top-[24px] -tablet:left-[20px] -tablet:top-[20px] bgi-[var(--base-2-main)] h-8 w-8 mobile:h-[48px] mobile:w-[48px] tablet:h-[40px] tablet:w-[40px] rounded-full border-t-transparent border-l-transparent flex justify-center items-center"
          onClick={() => setIsShowDownloadBanner(false)}
        >
          <Icon
            className="absolute w-4 h-4 right-[12%] bottom-[12%]"
            name="ic_close"
            color="var(--grayscale-10)"
          />
        </button>
      </div>
    )
  );
};

export default ApkDownloadBanner;
