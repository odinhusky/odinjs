import React, {
  CSSProperties,
  memo,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from '@commonUtils/cx';
import { useImageCache } from '@mode2/usecase/useImageCache';
import isEqual from 'lodash/isEqual';

interface BaseCacheImgProps {
  cKey?: string;
  src: string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  imgName?: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
  onFetchError?: (err: unknown) => void;
}

export const BaseCacheImg = ({
  cKey,
  src,
  alt,
  className,
  style,
  imgName,
  onClick,
  onError,
  onLoad,
  onFetchError,
}: BaseCacheImgProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        abortControllerRef.current?.abort(); // 取消前一次請求
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const cachedSrc = useImageCache.getByCache(src); // 若有快取邏輯
        const response = await fetch(cachedSrc, {
          signal: controller.signal,
        });
        const blob = await response.blob();

        // 建立 ObjectURL 並釋放舊的
        const url = URL.createObjectURL(blob);
        if (previousBlobUrlRef.current) {
          URL.revokeObjectURL(previousBlobUrlRef.current);
        }
        previousBlobUrlRef.current = url;
        setBlobUrl(url);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('BaseCacheImg fetch error:', err);
          onFetchError?.(err);
        }
      }
    };

    setHasLoaded(false); // reset loading state
    loadImage();

    return () => {
      abortControllerRef.current?.abort();
      if (previousBlobUrlRef.current) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
        previousBlobUrlRef.current = null;
      }
    };
  }, [src]);

  return (
    <>
      {blobUrl && (
        <img
          key={cKey || src}
          src={blobUrl}
          className={cx(`BaseCacheImg-[${imgName}]`, className, 'opacity-0', {
            'opacity-100': hasLoaded,
          })}
          style={style}
          alt={alt}
          onClick={(e) => {
            onClick?.(e);
          }}
          onLoad={() => {
            setHasLoaded(true);
            onLoad?.();
          }}
          onError={(e) => {
            onError?.(e);
          }}
        />
        // posthog autocapture [data-ph-capture, data-ph-event-name]
      )}
    </>
  );
};

export default memo(BaseCacheImg, (prevProps, nextProps) =>
  isEqual(prevProps.src, nextProps.src)
);
