import { Ref, forwardRef } from 'react';
import { LazyImageProps } from './LazyImageProps';

export const LazyImage = forwardRef(
  (
    {
      src = null,
      alt = '',
      className = '',
      onClick = () => {},
      onLoad = () => {},
      onError = () => {},
      rootMargin = '100%',
      isCache = true,
    }: // fallback,
    LazyImageProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return null;
  }
);

export default LazyImage;
