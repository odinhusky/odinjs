import { useTranslation } from 'react-i18next';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useMode2HallPageDownloadBannerStore } from '@mode2/zustand/page/hallPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { cx } from '@libs/commonUtils';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import Icon from '@components/Icon';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useEffect, useMemo } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import handleGlobalClick from '@mode2/action/handleGlobalClick';

export const ApkDownloadBanner = () => {
  const { t } = useTranslation();
  const location = useLocationStore((state) => state.location);

  const setIsShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.setIsShowDownloadBanner
  );
  const setShouldShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.setShouldShowDownloadBanner
  );
  const isShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.isShowDownloadBanner
  );

  const appName = `${sdkUtils.productName()} APP`;

  const handleDownloadClick = () => {
    handleGlobalClick({
      target: 'handleDownloadApkActionClick',
      callback: () => {
        const shouldPreventApkDownload =
          sdkUtils.isPwaInstalled() ||
          sdkUtils.isInNative() ||
          sdkUtils.isIOSKernel();

        if (!shouldPreventApkDownload) {
          // [V6] 首頁下載 apk 渠道區分
          sdkUtils.downloadApp();
        }
      },
    });
  };

  const shouldShowDownloadBanner = useMemo(() => {
    return (
      location?.pathname === BasePagePathObj.HallPage &&
      !sdkUtils.isPwaInstalled() &&
      !sdkUtils.isInNative() &&
      !sdkUtils.isIOSKernel() &&
      isShowDownloadBanner
    );
  }, [location, isShowDownloadBanner]);

  useEffect(() => {
    setShouldShowDownloadBanner(shouldShowDownloadBanner);
  }, [shouldShowDownloadBanner]);

  return (
    shouldShowDownloadBanner && (
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'h-[50px]',
          'overflow-hidden flex gap-2',
          'bgi-[var(--base-2-variant18)]',
          'pr-2',
          'rounded-none items-center justify-between'
        )}
      >
        <div className="h-full w-full flex justify-between items-center gap-2">
          <BaseCacheImg
            className="h-full"
            src={getImgUrl(EResourceLevel.V, 'img_download')}
            imgName={`img_download`}
            alt="img_download"
          />

          <div
            className={cx(
              'flex-auto',
              'flex flex-col gap-0',
              'bgi-text-[var(--grayscale-100)] text-xs font-medium'
            )}
          >
            <span className="">{appName}</span>
            <span className="">{t('home_download_better_experience')}</span>
          </div>

          <BasePrimaryBtn
            className={cx(
              'w-auto h-auto',
              'font-medium',
              'text-sm',
              'py-1 px-4',
              'rounded-full'
            )}
            onClick={handleDownloadClick}
            children={
              <div
                className={cx(
                  'gap-1 justify-center',
                  'justify-self-end',
                  FLEX_ITEMS_CENTER
                )}
              >
                <Icon className="h-5 w-5" name="ic_download" />
                <span className="bgi-text-[var(--grayscale-20)] text-sm font-medium">
                  {t('home_download_btn_download')}
                </span>
              </div>
            }
          />

          <Icon
            className={cx('w-4 h-4', 'cursor-pointer')}
            name="ic_close_2"
            onClick={() => setIsShowDownloadBanner(false)}
          />
        </div>
      </div>
    )
  );
};

export default ApkDownloadBanner;
