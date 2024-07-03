import React, {useEffect} from 'react';
import { useImageLoad } from './useImageLoag';

export const useImageExist = (
  src: string | undefined,
  defSrc?: string | undefined
): boolean => {

  if(!src) return false;

  const {loadImageAndCache, imageCache} = useImageLoad();

  useEffect(() => {
    loadImageAndCache(src, defSrc ? defSrc : src, -1)
  }, [src]);

  return imageCache[src] ? true : false;
}