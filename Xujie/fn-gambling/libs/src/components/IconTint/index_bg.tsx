// import * as React from 'react';
// import { ReactElement } from 'react';
// import useDeepEffect from '@commonUtils/hooks/useDeepEffect';
// import isEqual from 'lodash/isEqual';
// import { IconTintUtils } from '@libs/components/IconTint/IconTintUtils';
//
// const { memo, useRef, useState } = React;
//
// interface IconTintProps {
//   fallback?: ReactElement;
//   src: string;
//   color?: string;
//   className?: string;
//   defaultSrc?: string;
//   onClick?: () => void;
// }
//
// interface DimensionsI {
//   width: number;
//   height: number;
// }
//
// // const rootStyles = getComputedStyle(document.body);
// //
// // const cacheData: Record<string, string> = {};
// // const cacheNormalizeData: Record<string, string> = {};
// //
// // const hexToRgba = (hex: string): string => {
// //   let r: number,
// //     g: number,
// //     b: number,
// //     a: number = 1;
// //
// //   if (hex.length === 9) {
// //     // #RRGGBBAA
// //     r = parseInt(hex.slice(1, 3), 16);
// //     g = parseInt(hex.slice(3, 5), 16);
// //     b = parseInt(hex.slice(5, 7), 16);
// //     a = parseInt(hex.slice(7, 9), 16) / 255;
// //   } else if (hex.length === 7) {
// //     // #RRGGBB
// //     r = parseInt(hex.slice(1, 3), 16);
// //     g = parseInt(hex.slice(3, 5), 16);
// //     b = parseInt(hex.slice(5, 7), 16);
// //   } else {
// //     return hex; // 如果 hex 格式不正确，返回原始颜色
// //   }
// //
// //   return `rgba(${r},${g},${b},${a})`;
// // };
// //
// // const convertHslaToRgba = (hsla: string): string => {
// //   const match = hsla.match(
// //     /^hsla\((\d+),\s*(\d+)%\\,\s*(\d+)%\\,\s*(\d+\.?\d*)\)$/
// //   );
// //   if (match) {
// //     const h = parseInt(match[1], 10);
// //     const s = parseInt(match[2], 10) / 100;
// //     const l = parseInt(match[3], 10) / 100;
// //     const a = parseFloat(match[4]);
// //
// //     const c = (1 - Math.abs(2 * l - 1)) * s;
// //     const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
// //     const m = l - c / 2;
// //
// //     let r: number, g: number, b: number;
// //     if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
// //     else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
// //     else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
// //     else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
// //     else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
// //     else [r, g, b] = [c, 0, x];
// //
// //     r = Math.round((r + m) * 255);
// //     g = Math.round((g + m) * 255);
// //     b = Math.round((b + m) * 255);
// //
// //     return `rgba(${r},${g},${b},${a})`;
// //   }
// //   return hsla; // 如果转换失败，返回原始颜色
// // };
// //
// // const normalizeColor = (color: string): string => {
// //   if (/^rgba/.test(color)) {
// //     return color; // rgba 格式直接返回
// //   } else if (/^hsla/.test(color)) {
// //     return convertHslaToRgba(color); // 转换 hsla 到 rgba
// //   } else if (/^#[0-9a-fA-F]{8}$/.test(color)) {
// //     return hexToRgba(color); // 转换带透明度的 hex 到 rgba
// //   } else if (/^#[0-9a-fA-F]{6}$/.test(color)) {
// //     return hexToRgba(`${color}FF`); // 默认透明度为 1 的 hex 转换
// //   } else if (/^rgb/.test(color)) {
// //     return color; // rgb 格式直接返回
// //   }
// //   return color; // 默认返回原始颜色
// // };
// // const getGradient = (
// //   tintCtx: CanvasRenderingContext2D,
// //   tintCanvas: HTMLCanvasElement,
// //   color: string
// // ): string | CanvasGradient => {
// //   let gameMainColor = color;
// //   let normalize = color;
// //   if (color.trim().startsWith('var')) {
// //     const variableName = color.trim().slice(4, -1).trim(); // 提取变量名 '--game-1-main'
// //     // 降低相同 color parameter， 重複使用 rootStyles.getPropertyValue
// //     gameMainColor = cacheData[color]
// //       ? cacheData[color]
// //       : rootStyles.getPropertyValue(variableName).replace(/\n/g, '').trim();
// //     // 降低相同計算
// //     normalize = cacheNormalizeData[gameMainColor]
// //       ? cacheNormalizeData[gameMainColor]
// //       : normalizeColor(gameMainColor);
// //     cacheData[color] = gameMainColor;
// //     cacheNormalizeData[gameMainColor] = normalize;
// //   }
// //
// //   if (gameMainColor.startsWith('linear-gradient')) {
// //     const gradientInfo = gameMainColor.match(/linear-gradient\(([^,]+),(.+)\)/);
// //     if (gradientInfo) {
// //       const angle = parseFloat(gradientInfo[1].trim());
// //       const colorStops = gradientInfo[2].split(',').map((stop) => stop.trim());
// //
// //       const angleInRadians = (angle + 90) * (Math.PI / 180);
// //
// //       const startX =
// //         tintCanvas.width / 2 +
// //         Math.cos(angleInRadians) * (tintCanvas.width / 2);
// //       const startY =
// //         tintCanvas.height / 2 +
// //         Math.sin(angleInRadians) * (tintCanvas.height / 2);
// //       const endX =
// //         tintCanvas.width / 2 -
// //         Math.cos(angleInRadians) * (tintCanvas.width / 2);
// //       const endY =
// //         tintCanvas.height / 2 -
// //         Math.sin(angleInRadians) * (tintCanvas.height / 2);
// //
// //       const gradient = tintCtx.createLinearGradient(startX, startY, endX, endY);
// //
// //       colorStops.forEach((stop, index) => {
// //         const parts = stop.split(' ');
// //         const colorStop = cacheNormalizeData[parts[0]]
// //           ? cacheNormalizeData[parts[0]]
// //           : normalizeColor(parts[0]);
// //         cacheNormalizeData[parts[0]] = colorStop;
// //         const position = parts[1]
// //           ? parseFloat(parts[1]) / 100
// //           : index / (colorStops.length - 1);
// //         gradient.addColorStop(position, colorStop);
// //       });
// //
// //       return gradient;
// //     }
// //   }
// //   return normalize;
// // };
//
// /**
//  *
//  * @param fallback 渲染失敗時的備用元素
//  * @param src 資源路徑 [.png, .webp] 都支援
//  * @param color 不給就是原本顏色，可以給 [RGB || ARGB]，無法透過 className 添加
//  * @param className 可以針對 <canvas> 做 style 調整，如果 [maxWidth || maxHeight] 沒有給，也可以透過 className 添加
//  * @param props 其他傳遞給 <canvas> 元素的屬性
//  * @constructor
//  *
//  * @example
//  * <IconTint
//  *   src={'https://resources.ttgroup.vip/UI/u7/m1/icon_tab_account_m.webp'}
//  *   className={'max-h-[10px]'}
//  * />
//  *
//  * @example
//  * <IconTint
//  *  src={getImgUrl(EResourceLevel.V, 'lang_en')}
//  *  color={'rgba(211,58,58,0.35)'}
//  * />
//  *
//  */
// const IconTint: React.FunctionComponent<IconTintProps> = ({
//   fallback = <span />,
//   src,
//   color,
//   className, // 接收 className
//   defaultSrc,
//   ...props
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [size, setSize] = useState<DimensionsI>({
//     width: 24,
//     height: 24,
//   });
//   const _scaleImage = (
//     srcWidth: number,
//     srcHeight: number,
//     maxWidth?: number,
//     maxHeight?: number
//   ): DimensionsI => {
//     if (!maxWidth && !maxHeight) return { width: srcWidth, height: srcHeight };
//     const ratio = Math.min(
//       maxWidth ? maxWidth / srcWidth : 1,
//       maxHeight ? maxHeight / srcHeight : 1
//     );
//     return { width: srcWidth * ratio, height: srcHeight * ratio };
//   };
//
//   const handleDrawIcon = async (pic: HTMLImageElement) => {
//     const { current: canvas } = canvasRef;
//     const { width, height } = _scaleImage(pic.width, pic.height);
//
//     setSize({ width, height });
//
//     const tintCanvas = document.createElement('canvas');
//     const tintCtx = tintCanvas.getContext('2d');
//     const ctx = canvas?.getContext('2d');
//
//     if (tintCtx && ctx) {
//       tintCanvas.width = width;
//       tintCanvas.height = height;
//       ctx.clearRect(0, 0, width, height);
//
//       // 只有在 color 有值時才設置填充樣式
//       if (color) {
//         tintCtx.clearRect(0, 0, width, height); // 仅在有颜色时清除
//         tintCtx.fillStyle = IconTintUtils.getGradient(
//           tintCtx,
//           tintCanvas,
//           color
//         );
//         tintCtx.fillRect(0, 0, width, height);
//         tintCtx.globalCompositeOperation = 'destination-in';
//         tintCtx.drawImage(pic, 0, 0, width, height);
//         ctx.globalAlpha = 1; // 确保不透明效果
//         ctx.drawImage(tintCanvas, 0, 0, width, height);
//       } else {
//         ctx.globalAlpha = 1; // 确保不透明效果
//         ctx.drawImage(pic, 0, 0, width, height); // 直接绘制原始图片
//       }
//     }
//   };
//
//   useDeepEffect(() => {
//     const img = new Image();
//     img.src = src;
//
//     img.onload = async () => await handleDrawIcon(img);
//
//     img.onerror = () => {
//       if (!defaultSrc) return;
//       const defaultPic = new Image();
//       defaultPic.src = defaultSrc;
//       defaultPic.onload = async () => await handleDrawIcon(defaultPic);
//     };
//
//     return () => {
//       img.onload = null;
//       img.onerror = null;
//     };
//   }, [src, color, className, canvasRef?.current]);
//
//   if (
//     typeof window !== 'undefined'
//     // && window.document
//     // && window.document.createElement
//   ) {
//     return (
//       <canvas
//         width={size.width}
//         height={size.height}
//         ref={canvasRef}
//         className={className}
//         {...props}
//       />
//     );
//   }
//   return fallback;
// };
//
// export default memo(IconTint, (prevProps, nextProps) => {
//   return isEqual(prevProps, nextProps);
// });
