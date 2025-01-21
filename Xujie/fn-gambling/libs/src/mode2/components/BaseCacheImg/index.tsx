import React, { memo, SyntheticEvent, useState } from 'react';
import cx from '@commonUtils/cx';
import { useImageCache } from '@mode2/usecase/useImageCache';
import { useDeepEffect } from '@libs/commonUtils';
import isEqual from 'lodash/isEqual';

interface BaseCacheImgProps {
  key?: string;
  src: string;
  className?: string;
  alt?: string;
  // fallback?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * @param src - 圖片 url
 * @param className - 圖片的 className
 * @param alt - 圖片 alt 屬性
 // * @param fallback - 如果讀不到 src 的圖片則預設使用這個圖片當作預設顯示
 * @param onClick - 點擊事件
 * @param onLoad - 加載完成事件
 * @param onError - 錯誤事件
 * @constructor
 *
 * @example
 * import axios from 'axios';
 * import rateLimit from 'axios-rate-limit';
 *
 * - Set up an axios instance and limit concurrent requests to [5] at a time
 * const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 });
 *
 * - Now you can make requests as normal, but you will be limited in the number of concurrent requests.
 * http.get('https://example.com')
 *   .then(response => {
 *     console.log(response.data);
 *   });
 */

export const BaseCacheImg = (props: BaseCacheImgProps) => {
  // const handleDefaultError = (target: HTMLImageElement) => {
  //   console.error('BaseCacheImg Error:', target);
  //   // e.src = src;
  // };

  const key = props.key || `${props.src}_${props.alt}_${props}`;
  const [imageSrc, setImageSrc] = useState<string>(props.src);

  // 解決 LazyImage 使用中，不斷重新 assign imageSrc to <img>
  useDeepEffect(() => {
    const fetchImageSrc = async () => {
      const cachedSrc = useImageCache.getByCache(props.src);
      setImageSrc(cachedSrc);
    };

    fetchImageSrc().catch((e) =>
      console.error('Error fetching cached image:', e)
    );
  }, [props.src]);

  return (
    <img
      key={key}
      src={imageSrc}
      className={cx(props.className)}
      alt={props.alt}
      onClick={() => {
        if (props.onClick instanceof Function) props.onClick();
      }}
      onLoad={() => {
        if (props.onLoad instanceof Function) props.onLoad();
      }}
      onError={(e) => {
        if (props.onError instanceof Function) props.onError(e);
        // handleDefaultError(e.currentTarget);
      }}
    />
  );
};

export default memo(BaseCacheImg, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.src, nextProps.src) &&
    isEqual(prevProps.className, nextProps.className) &&
    isEqual(prevProps.key, nextProps.key)
  );
});
