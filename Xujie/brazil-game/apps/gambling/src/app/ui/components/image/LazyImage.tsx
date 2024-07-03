import React, {SyntheticEvent, useEffect, useRef, useState, forwardRef} from "react";
import cx from "classnames";

export interface ILazyImage {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void;
  rootMargin?: string;
}

export const LazyImage = forwardRef((props: ILazyImage, ref: any) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const itemRef = useRef<any>(null);
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

    if (ref.current) {
      observer = new IntersectionObserver(handleObserver, {
        threshold: 0.01,
        rootMargin: props.rootMargin ? props.rootMargin : '70%'
      });
      observer.observe(ref.current);
    }

    return () => {
      if (observer && ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [props.src]);

  return imageSrc ?
    (
      <img
        ref={itemRef}
        alt={props.alt}
        className={cx(props.className)}
        src={imageSrc}
        onClick={() => {
          props.onClick && props.onClick()
        }}
        onLoad={() => {
          props.onLoad && props.onLoad()
        }}
        onError={(e) => {
          props.onError &&  props.onError(e)
        }}
      />
    )
    : (
      <a ref={itemRef}/>
    )
})
