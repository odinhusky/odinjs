import * as React from 'react';
import { ReactElement, useMemo } from 'react';
import useDeepEffect from '@commonUtils/hooks/useDeepEffect';
import isEqual from 'lodash/isEqual';
import { IconTintUtils } from '@libs/components/IconTint/IconTintUtils';

const { memo, useRef, useState } = React;

interface IconTintProps {
  fallback?: ReactElement;
  src: string;
  color?: string;
  operation?: GlobalCompositeOperation;
  className?: string;
  defaultSrc?: string;
  onClick?: () => void;
}

// interface DimensionsI {
//   width: number;
//   height: number;
// }

/**
 *
 * @param fallback 渲染失敗時的備用元素
 * @param src 資源路徑 [.png, .webp] 都支援
 * @param color 不給就是原本顏色，可以給 [RGB || ARGB]，無法透過 className 添加
 * @param className 可以針對 <canvas> 做 style 調整，如果 [maxWidth || maxHeight] 沒有給，也可以透過 className 添加
 * @param props 其他傳遞給 <canvas> 元素的屬性
 * @constructor
 *
 * @example
 * <IconTint
 *   src={'https://resources.ttgroup.vip/UI/u7/m1/icon_tab_account_m.webp'}
 *   className={'max-h-[10px]'}
 * />
 *
 * @example
 * <IconTint
 *  src={getImgUrl(EResourceLevel.V, 'lang_en')}
 *  color={'rgba(211,58,58,0.35)'}
 * />
 *
 */
const IconTint: React.FunctionComponent<IconTintProps> = ({
  fallback = <span />,
  src,
  color,
  operation = 'destination-in',
  className, // 接收 className
  defaultSrc,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isError, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const processedColor = useMemo(() => {
    return color ? IconTintUtils.normalizeColor(color) : null; // 假設 normalizeColor 是處理顏色的函數
  }, [color]);

  const handleDrawIcon = (
    src: string,
    imageElement: HTMLImageElement,
    processedColor: string | null = null
  ) => {
    const { width, height } = {
      width: imageElement.width,
      height: imageElement.height,
    };

    if (!processedColor) {
      setImageSrc(imageElement.src);
      return;
    }

    const tintCanvas = document.createElement('canvas');
    const tintCtx = tintCanvas.getContext('2d');

    if (!tintCtx) {
      setImageSrc(imageElement.src);
      return;
    }

    tintCanvas.width = width;
    tintCanvas.height = height;
    tintCtx.clearRect(0, 0, width, height); // 仅在有颜色时清除
    tintCtx.fillStyle = IconTintUtils.getGradient(
      tintCtx,
      tintCanvas,
      processedColor
    );
    tintCtx.fillRect(0, 0, width, height);
    tintCtx.globalCompositeOperation = operation;
    tintCtx.drawImage(imageElement, 0, 0, width, height);
    // color tint 完成的 canvas，放到緩存機制裡
    // tintCanvas.toBlob((data) => {
    //   if (color) {
    //     useImageCache.asyncHandleIconCache(src, color, data);
    //   }
    // });
    setImageSrc(tintCanvas.toDataURL());
  };

  useDeepEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = async () => {
      handleDrawIcon(src, img, processedColor);
    };

    img.onerror = async () => {
      if (!defaultSrc) {
        setError(true);
        return;
      }
      handleDrawIcon(defaultSrc, img);
      // img.src = defaultSrc;
      // img.onload = async () => {
      //
      // };
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, imgRef?.current, processedColor]);

  return isError ? (
    fallback
  ) : imageSrc ? (
    <img ref={imgRef} src={imageSrc} className={className} {...props} />
  ) : (
    <span className={className}></span>
  );
};

export default memo(IconTint, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
