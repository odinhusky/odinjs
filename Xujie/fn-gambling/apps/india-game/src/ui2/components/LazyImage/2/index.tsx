import { Ref, forwardRef, useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import BaseCacheImg from '@mode2/components/BaseCacheImg';
import { LazyImageProps } from '../LazyImageProps';
import { cx } from '@libs/commonUtils';

export const LazyImage = forwardRef(
  (
    {
      src = null,
      imgName = '',
      alt = '',
      className = '',
      onClick = () => {},
      onLoad = () => {},
      onError = (e) => {},
      rootMargin = '100%',
      isCache = true,
      loadingFallback = '',
    }: LazyImageProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoaded = (
      e?: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      setHasLoaded(true);
      onLoad?.();
      setIsLoading(false);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error('Lazy Image Error', imageSrc);
      onError?.(e);
      setHasError(true);
      setIsLoading(false);
    };

    useEffect(() => {
      let observer: IntersectionObserver;
      const handleObserver = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            setIsLoading(true);
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
      const isLoaded = typeof imageSrc === 'string' && imageSrc.length > 0;

      if (isLoaded) {
        return (
          <>
            {/* Loading 圖片 */}
            {isLoading && loadingFallback ? (
              <BaseCacheImg
                src={loadingFallback}
                alt="Fallback"
                className={cx('absolute rounded-lg w-full h-full object-cover')}
                imgName={`LazyImage - GameItem - Fallback Image - ${imageSrc}`}
              />
            ) : null}

            {isCache ? (
              <BaseCacheImg
                src={imageSrc}
                alt={alt}
                imgName={`LazyImage - ${imgName}`}
                className={className}
                onClick={onClick}
                onLoad={handleLoaded}
                onError={handleError}
              />
            ) : (
              <img
                src={imageSrc}
                alt={alt}
                className={className}
                onClick={onClick}
                onLoad={handleLoaded}
                onError={handleError}
              />
            )}
          </>
        );
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

    return <div ref={ref}>{renderImage()}</div>;
  }
);

export default LazyImage;
