import { Ref, SyntheticEvent, forwardRef, useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import BaseCacheImg from '@mode2/components/BaseCacheImg';
import fallbackImg from '@libs/constant/fallbackBase64';

interface LazyImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
  rootMargin?: string;
  isCache?: boolean;
}

export const LazyImage = forwardRef(
  (
    {
      src = null,
      alt = '',
      className = '',
      onClick = () => {},
      onLoad = () => {},
      onError = (e) => {},
      rootMargin = '100%',
      isCache = true,
    }: LazyImageProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleDefaultError = () => {
      setImageSrc(fallbackImg);
    };

    useEffect(() => {
      let observer: IntersectionObserver;
      const handleObserver = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      };

      if (ref && 'current' in ref && ref.current) {
        observer = new IntersectionObserver(handleObserver, {
          threshold: 0.01,
          rootMargin,
        });
        observer.observe(ref.current);
      }

      return () => {
        if (ref && 'current' in ref && observer && ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [src]);

    const renderImage = () => {
      const isLoaded = imageSrc !== null;

      if (isLoaded) {
        if (isCache) {
          return (
            <BaseCacheImg
              src={imageSrc}
              alt={alt}
              className={className}
              onClick={onClick}
              onLoad={onLoad}
              onError={(e) => {
                if (onError instanceof Function) onError(e);
                handleDefaultError();
              }}
            />
          );
        } else {
          return (
            <img
              src={imageSrc}
              alt={alt}
              className={className}
              onClick={onClick}
              onLoad={onLoad}
              onError={(e) => {
                if (onError instanceof Function) onError(e);
                handleDefaultError();
              }}
            />
          );
        }
      }

      // loading中顯示佔位用深色背景色區塊
      return (
        <Skeleton.Node
          active // 載入中波浪動畫效果
          style={{ display: 'none' }}
          className="h-full !w-full rounded-lg"
        />
      );
    };

    return renderImage();
  }
);

export default LazyImage;
