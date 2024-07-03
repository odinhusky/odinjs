import React, {useEffect, useRef, useState} from "react";
import cx from "classnames";
import {ILazyImage} from "./LazyImage";
import {useImageLoad} from "../../hooks/useImageLoag";

interface ILazyCacheImage extends ILazyImage {
  id?: string;
  defSrc?: string;
}

export const LazyCacheImage = (props: ILazyCacheImage) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const itemRef = useRef<any>(null);

  const {loadImageAndCache, imageCache} = useImageLoad()

  useEffect(() => {
    let observer: IntersectionObserver;
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageSrc(props.src);
          observer.unobserve(entry.target);
        }
      });
    };

    if (itemRef.current) {
      observer = new IntersectionObserver(handleObserver, {
        threshold: 0.01,
        rootMargin: '70%'
      });
      observer.observe(itemRef.current);
    }

    return () => {
      if (observer && itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [props.src]);

  useEffect(() => {
    imageSrc && loadImageAndCache(imageSrc, props.defSrc ? props.defSrc : imageSrc, -1)
  }, [imageSrc])

  return imageSrc && imageCache[imageSrc] ?
    (
      <img
        id={props.id}
        ref={itemRef}
        alt={props.alt}
        className={cx(props.className)}
        src={imageCache[imageSrc].cacheValue}
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
    : (<a ref={itemRef}/>)
}
