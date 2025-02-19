import { forwardRef, Ref, SyntheticEvent } from 'react';

interface LazyImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
  rootMargin?: string;
  isCache?: boolean;
  fallback?: string;
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
    }: // fallback,
    LazyImageProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return <div ref={ref}></div>;
  }
);

export default LazyImage;
