import React, { useEffect, CSSProperties } from "react";
import cx from "classnames";
import {ILazyImage} from "./LazyImage";
import {useImageLoad} from "../../hooks/useImageLoag";

interface ICacheImage extends ILazyImage {
  id?: string;
  defSrc?: string;
  children?: React.ReactNode;
  style?: CSSProperties
}

export const CacheImage = (props: ICacheImage) => {

  const {loadImageAndCache, imageCache} = useImageLoad()

  useEffect(() => {
    loadImageAndCache(props.src, props.defSrc ? props.defSrc : props.src, -1)
  }, [props.src]);

  return imageCache[props.src] ?
    (
      <img
        id={props.id}
        alt={props.alt}
        className={cx(props.className)}
        style={props?.style}
        src={imageCache[props.src].cacheValue}
        onClick={() => {
          props.onClick && props.onClick()
        }}
        onLoad={() => {
          props.onLoad && props.onLoad()
        }}
        onError={(e) => {
          props.onError && props.onError(e)
        }}
      />
    )
    : (props.children)
}
