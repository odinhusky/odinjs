import { useTranslation } from 'react-i18next';
import { useMode2HallPageDownloadBannerStore } from '@mode2/zustand/page/hallPageStore';
import sdkUtils from '@mode2/utils/sdk';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

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
      <div className="relative overflow-hidden flex items-center justify-between h-10 w-full mobile:h-[64px] tablet:rounded-[8px] bgi-[var(--linear-1)] tablet:mb-5 py-1.5 pr-2 pl-3 mobile:py-2 mobile:pr-6 mobile:pl-6 tablet:py-3 tablet:pr-4 tablet:mt-8">
        <div className="flex items-center h-full">
          <img
            className="h-[200%]"
            src={getImgUrl(EResourceLevel.V, 'bg_download')}
            alt="icon"
          />
          <div className="flex flex-col font-medium text-[var(--grayscale-00)]  ">
            <span className="text-sm mobile:text-lg">{appName}</span>
            <span className="text-xs mobile:text-base">
              {t('home_download_better_experience')}
            </span>
          </div>
        </div>

        <BaseSecondaryBtn
          className={cx(
            'w-auto h-auto',
            'font-medium',
            'rounded-s mobile:rounded-lg tablet:rounded-xl',
            'text-sm  mobile:text-base tablet:text-lg',
            'py-1 px-4 tablet:py-2',
            'shadow-[0px_-2px_2px_0px_#FFFFFF66_inset,0px_2px_2px_0px_#FFFFFF99_inset]'
          )}
          classNameText={cx(FLEX_ITEMS_CENTER)}
          onClick={handleDownloadClick}
          children={
            <>
              <Icon
                className="h-5 w-5 mobile:h-6 mobile:w-6 mr-[4px]"
                name="ic_download"
                color="var(--grayscale-00)"
              />
              <span className="bgi-text-[var(--grayscale-00)]">
                {t('home_download_btn_download')}
              </span>
            </>
          }
        />
        <BaseSecondaryBtn
          className={cx(
            'w-8 h-8 mobile:w-10 mobile:h-10',
            'rounded-[66px] mobile:rounded-[83px]',
            'absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2',
            'border-t-transparent border-l-transparent'
          )}
          onClick={() => setIsShowDownloadBanner(false)}
          children={
            <Icon
              className="absolute mobile:w-4 mobile:h-4 w-3 h-3 right-[8%] bottom-[8%]"
              name="ic_close"
              color="var(--grayscale-100)"
            />
          }
        />
      </div>
    )
  );
};

export default ApkDownloadBanner;
