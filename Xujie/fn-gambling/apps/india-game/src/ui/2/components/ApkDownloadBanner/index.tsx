import { useTranslation } from 'react-i18next';
import { useMode2HallPageDownloadBannerStore } from '@mode2/zustand/page/hallPageStore';
import sdkUtils from '@mode2/utils/sdk';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';

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

        <BaseSecondaryBtn
          className={cx(
            'w-auto h-auto',
            'font-medium',
            'text-sm  mobile:text-base',
            'py-1 px-4 tablet:py-2'
          )}
          classNameText={cx(FLEX_ITEMS_CENTER)}
          onClick={handleDownloadClick}
          children={
            <>
              <Icon
                className="h-5 w-5 mobile:h-6 mobile:w-6 mr-[4px]"
                name="ic_download"
                color="var(--grayscale-10)"
              />
              <span className="bgi-text-[var(--grayscale-10)]">
                {t('home_download_btn_download')}
              </span>
            </>
          }
        />

        <BaseSecondaryBtn
          className={cx(
            'h-8 w-8 mobile:h-[48px] mobile:w-[48px] tablet:h-[40px] tablet:w-[40px]',
            'rounded-full',
            'absolute -left-[16px] -top-4 -mobile:left-[24px] -mobile:top-[24px] -tablet:left-[20px] -tablet:top-[20px]',
            'border-t-transparent border-l-transparent'
          )}
          onClick={() => setIsShowDownloadBanner(false)}
          children={
            <Icon
              className="absolute w-4 h-4 right-[12%] bottom-[12%]"
              name="ic_close"
              color="var(--grayscale-10)"
            />
          }
        />
      </div>
    )
  );
};

export default ApkDownloadBanner;
