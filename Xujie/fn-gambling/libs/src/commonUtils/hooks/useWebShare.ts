import { useCallback, useMemo, useState } from 'react';
import sdkUtils from '@libs/mode2/utils/sdk';

type UseWebShareOptions = {
  title?: string;
  text?: string;
  url: string;
  imageUrl?: string;
  file?: File;
  onFallbackShare?: () => void; // 用來觸發自定義 Modal、Toast 等
};

export const useWebShare = ({
  title,
  text,
  url,
  imageUrl,
  file,
  onFallbackShare,
}: UseWebShareOptions) => {
  const [error, setError] = useState<null | Error>(null);

  const isSafari = sdkUtils.isSafari();

  const canUseNativeShare = useMemo(() => {
    if (!navigator.share) return false;
    if (file && navigator.canShare) {
      return navigator.canShare({ files: [file] });
    }
    if (imageUrl && navigator.canShare && typeof File !== 'undefined') {
      return navigator.canShare({ files: [new File([], 'dummy.jpg')] });
    }
    return true;
  }, [file, imageUrl]);

  const share = useCallback(async () => {
    setError(null);

    if (!navigator.share || !canUseNativeShare) {
      onFallbackShare?.();
      return;
    }

    const shareData: ShareData = {
      title,
      text,
      url,
    };

    let shareFile: File | undefined = undefined;

    if (file) {
      shareFile = file;
    } else if (imageUrl) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        shareFile = new File([blob], 'shared-image.jpg', { type: blob.type });
      } catch (err) {
        console.warn('圖片讀取失敗，略過圖片', err);
      }
    }

    if (shareFile && navigator.canShare?.({ files: [shareFile] })) {
      shareData.files = [shareFile];
    }

    try {
      await navigator.share(shareData);
    } catch (err) {
      setError(err as Error);
    }
  }, [title, text, url, imageUrl, file, canUseNativeShare, onFallbackShare]);

  return {
    share,
    error,
    isSafari,
    canUseNativeShare,
  };
};
