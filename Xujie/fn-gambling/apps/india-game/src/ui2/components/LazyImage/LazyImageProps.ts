import { SyntheticEvent } from 'react';

export interface LazyImageProps {
  src: string | null;
  imgName?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
  rootMargin?: string;
  isCache?: boolean;
  fallback?: string;
  loadingFallback?: string;
}
