import { RefObject, useRef } from 'react';
import html2canvas, { Options } from 'html2canvas';

/**
 * 快照下載DOM元素功能
 */
export const useDownloadSnapshotElement = <E extends HTMLElement>() => {
  const elementRef = useRef<E>(null);

  // Hook to trigger the download
  const downloadElementAsImage = async (
    ref: RefObject<E> | null,
    downloadFileName: string,
    options?: Partial<Options>
  ) => {
    const currentRef = ref || elementRef;
    if (currentRef.current) {
      try {
        // Use html2canvas to convert the element to canvas
        const canvas = await html2canvas(currentRef.current, options);

        // Convert canvas to PNG image data
        const dataURL = canvas.toDataURL('image/png');

        // Create an <a> tag to download the image
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = `${downloadFileName}.png`; // 设置下载文件的名称

        // Trigger Download
        downloadLink.click();
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };

  return { elementRef, downloadElementAsImage };
};
