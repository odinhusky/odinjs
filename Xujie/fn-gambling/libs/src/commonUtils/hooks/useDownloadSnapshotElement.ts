import { RefObject, useRef } from 'react';
import html2canvas, { Options } from 'html2canvas';
import { toPng } from 'html-to-image';
import { domToPng } from 'modern-screenshot';
import { message } from 'antd';

/**
 * 快照下載DOM元素功能
 * NOTICE 不支持漸變色邊框等複雜的css規則
 */
export const useDownloadSnapshotElement = <E extends HTMLElement>() => {
  const elementRef = useRef<E>(null);

  // Hook to trigger the download
  const downloadElementAsImage = async (
    ref: RefObject<E> | null,
    downloadFileName: string,
    options?: Partial<Options>,
    imgType: 'png' | 'jpeg' = 'png',
  ) => {
    const currentRef = ref || elementRef;
    if (currentRef.current) {
      try {
        // Use html2canvas to convert the element to canvas
        const canvas = await html2canvas(currentRef.current, options);

        // Convert canvas to PNG image data
        const dataURL = canvas.toDataURL(`image/${imgType}`); // 'image/png'

        // Create an <a> tag to download the image
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = `${downloadFileName}.${imgType}`; // 设置下载文件的名称

        // Trigger Download
        downloadLink.click();
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };

  /**
   * 可以導出漸變色邊框等複雜的css規則
   * NOTICE iOS会少东西，antd的QRCode也会显示空白(canvas都会显示空白)，改为[qrcode.react]的QRCodeSVG就可以
   * @param ref
   * @param downloadFileName
   * @returns
   */
  const downloadHtmlAsImage = async (
    ref: RefObject<E> | null,
    downloadFileName: string
  ) => {
    if (!ref?.current) return;

    try {
      const dataUrl = await toPng(ref.current!, {
        cacheBust: false,
        skipFonts: true,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${downloadFileName}.png`; // 设置下载文件的名称
      link.click();
    } catch (error) {
      console.error('Screenshot failed', error);
    }
  };

  /**
   * iOS可以導出漸變色邊框等複雜的css規則，也不會缺少東西
   * NOTICE iOS端導出會比較慢，且需要適配分辨率
   * @param ref
   * @param downloadFileName
   * @returns
   */
  const downloadDomAsImage = async (
    ref: RefObject<E> | null,
    downloadFileName: string
  ): Promise<boolean> => {
    if (!ref?.current) return Promise.reject(false);
    message.loading('Picture loading...');
    const scale = window.devicePixelRatio || 1; // 适配高分辨率屏幕

    try {
      const dataUrl = await domToPng(ref.current!, {
        scale,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${downloadFileName}.png`; // 设置下载文件的名称
      link.click();

      message.destroy();
      return Promise.resolve(true);
    } catch (error) {
      console.error('Screenshot failed', error);
      message.destroy();
      return Promise.reject(false);
    }
  };

  return {
    elementRef,
    downloadElementAsImage,
    downloadHtmlAsImage,
    downloadDomAsImage,
  };
};
