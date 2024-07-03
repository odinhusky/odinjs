import {
  cacheImage,
  updateCachedImage,
} from '../../reduxStore/imageCacheSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxStore';

export const useImageLoad = () => {
  const dispatch = useDispatch();
  const imageCache = useSelector((state: RootState) => state.imageCache);

  const loadImageAndCache = (
    iconSrc: string,
    defIconSrc: string,
    expirationSec: number | undefined
  ) => {
    const loadImage = async () => {
      await loadAndCache(iconSrc, defIconSrc, -1)();
    };
    if (!imageCache[iconSrc]) loadImage();
  };

  // 建立一個非同步 action creator，用於載入並快取圖片
  const loadAndCache =
    (
      imageUrl: string,
      defaultValue: string,
      expirationSec: number | undefined
    ) =>
    async () => {
      try {
        const cacheResult = imageCache[imageUrl];
        // 如果快取中已經存在該圖片的 base64 字串，則直接使用快取數據
        if (
          cacheResult &&
          !isExpiration(imageUrl, cacheResult.expirationTime)
        ) {
          dispatch(
            updateCachedImage({
              key: imageUrl,
              cacheValue: cacheResult.cacheValue,
              expirationTime: cacheResult.expirationTime,
            })
          );
          return;
        }

        let base64;
        // 如果是網頁資源，直接載入並快取
        if (imageUrl.startsWith('http')) {
          // TODO CORS 問題
          dispatch(
            cacheImage({
              key: imageUrl,
              cacheValue: imageUrl,
              expirationTime: -1,
            })
          );
          return;
          // base64 = await fetchAndConvertToBase64(imageUrl);
        } else {
          // 如果是本機資源，先轉換為 base64 再緩存
          base64 = await localResourceToBase64(imageUrl);
        }

        const expirationTime =
          expirationSec === undefined || expirationSec === -1
            ? -1
            : Date.now() + expirationSec * 1000;
        // 如果成功取得 base64 字串，則快取圖片
        if (base64) {
          dispatch(
            cacheImage({
              key: imageUrl,
              cacheValue: base64,
              expirationTime: expirationTime,
            })
          );
        } else {
          // 載入失敗時，使用 defaultValue 進行快取
          base64 = await localResourceToBase64(defaultValue);
          if (base64) {
            dispatch(
              cacheImage({
                key: imageUrl,
                cacheValue: defaultValue,
                expirationTime: expirationTime,
              })
            );
          } else {
            console.error(
              'Failed to fetch and convert image to base64:',
              imageUrl
            );
          }
        }
      } catch (error) {
        console.error('Error loading image and caching:', error);
      }
    };

  // 檢查快取是否過期
  // expirationTime === undefined || -1，永不過期
  // new Date().getMilliseconds() > expirationTime，過期
  // 若已經過過期，清除快取
  const isExpiration = (key: string, expirationTime: number | undefined) => {
    if (expirationTime === undefined || expirationTime === -1) {
      return false; // 永不過期
    }
    const now = Date.now(); // 取得當前時間的時間戳
    return now > expirationTime; // 檢查是否過期
  };

  // load by local to Base64 str
  const localResourceToBase64 = async (
    localPath: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(localPath);
      if (response.ok) {
        const blob = await response.blob();
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        return base64String;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error converting local resource to base64:', error);
      return null;
    }
  };

  // load by remote
  // 未解決 OCRS
  const fetchAndConvertToBase64 = async (
    imageUrl: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        return base64String;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching image:', imageUrl, error);
      return null;
    }
  };

  return {
    loadImageAndCache,
    // loadImageAndCache,
    imageCache,
  };
};
