import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '@mode2/utils/sdk';
import { useAppStore } from '@mode2/zustand/appStore';
import { fetchBatchCurrentH5Version } from '@commonUtils/fetchBatchCurrentH5Version';

export const checkH5VersionUpdate: () => Promise<void> = async () => {
  const previousLastModified = sdkUtils.getStorage(
    AppLocalStorageKey.H5_LAST_MODIFIED
  );
  const previousEtag = sdkUtils.getStorage(AppLocalStorageKey.H5_LAST_ETAG);

  try {
    const result = await fetchBatchCurrentH5Version();
    const lastModified = result.lastModified;
    const currentEtag = result.currentEtag;

    // 检查是否有新版本
    const isNewVersion = Boolean(
      (lastModified && lastModified !== previousLastModified) ||
        (currentEtag && currentEtag !== previousEtag)
    );
    useAppStore.getState().setRealTimeH5Version({
      isNewVersion: isNewVersion,
      lastModified: lastModified,
      eTag: currentEtag,
    });

    // 點擊  sdkUtils.reloadWindow()，再更新 localStorage 中的 Last-Modified 和 ETag
  } catch (error) {
    console.error('@@@===>  check h5 version error ', error);
  }
};
