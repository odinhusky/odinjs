import { useState } from 'react';
import { isEmpty } from 'lodash';
import { message } from 'antd';
import useDeepEffect from './useDeepEffect';
import { useTranslation } from 'react-i18next';

export enum ClipboardState {
  INCOMPLETE = 'INCOMPLETE', // 未開始
  SUCCESS = 'SUCCESS', // 複製成功
  FAIL = 'FAIL', // 複製失敗
}

export type ClipboardInfo = {
  state: ClipboardState;
  message: string;
  resetInterval?: number;
};

/**
 * 複製文字到剪貼簿
 *
 * @param text 複製文本
 * @param resetInterval 重新設置 預設 [2000]
 *
 *
 * @example
 * const { clipboard, copyToClipboard } = useClipboard();
 *
 * @example
 * copyToClipboard({text});
 *
 * @example
 * useEffect(() => {
 *   if (clipboard.state === ClipboardState.SUCCESS) {
 *     // TODO SUCCESS
 *   }
 *   if (clipboard.state === ClipboardState.FAIL) {
 *    // TODO FAIL
 *   }
 * }, [clipboard])
 */
export const useClipboard = () => {
  const { t } = useTranslation();
  const [clipboard, setClipboardInfo] = useState<ClipboardInfo>({
    state: ClipboardState.INCOMPLETE,
    message: '',
  });

  const reset = (resetInterval: number) => {
    setTimeout(() => {
      const incomplete = generate(ClipboardState.INCOMPLETE, '');
      setClipboardInfo(incomplete);
    }, resetInterval);
  };

  const generate = (
    state: ClipboardState,
    message: string,
    resetInterval: number = 2000
  ): ClipboardInfo => {
    return {
      state: state,
      message: message,
      resetInterval: resetInterval,
    };
  };

  useDeepEffect(() => {
    if (clipboard.state === ClipboardState.SUCCESS) {
      const successMessage = message.success(t('toast_copied_successfully'));
      if (clipboard.resetInterval !== 0) {
        setTimeout(() => successMessage(), clipboard.resetInterval);
      }
    } else if (clipboard.state === ClipboardState.FAIL) {
      const failMessage = message.error(clipboard.state);
      if (clipboard.resetInterval !== 0) {
        setTimeout(() => failMessage(), clipboard.resetInterval);
      }
    }
  }, [clipboard]);

  const fallbackCopyTextToClipboard = (
    text: string,
    resetInterval: number = 2000
  ): Promise<ClipboardInfo> => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // 避免滚动到视图外
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.readOnly = true;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const success = generate(ClipboardState.SUCCESS, text);
        setClipboardInfo(success);
        reset(resetInterval);
        return Promise.reject(success);
      } else {
        const fail = generate(
          ClipboardState.FAIL,
          `Fallback: Failed to copy text`
        );
        return Promise.reject(fail);
      }
    } catch (error) {
      console.error('Fallback: Failed to copy text:', error);
      const fail = generate(
        ClipboardState.FAIL,
        `Fallback: Failed to copy text: ${error}`
      );
      setClipboardInfo(fail);
      return Promise.reject(fail);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  /**
   *
   * @param text 複製文本
   * @param resetInterval 重新設置 預設 [2000]
   */
  const copyToClipboard = async (
    text: string,
    resetInterval: number = 2000
  ): Promise<ClipboardInfo> => {
    if (isEmpty(text.trim())) {
      const fail = generate(
        ClipboardState.FAIL,
        'Fallback: Failed to copy text: is Empty'
      );
      setClipboardInfo(fail);
      return Promise.reject(fail);
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        const success = generate(ClipboardState.SUCCESS, text);
        setClipboardInfo(success);
        reset(resetInterval);
        return Promise.resolve(success);
      } catch (error) {
        return fallbackCopyTextToClipboard(text, resetInterval);
      }
    } else {
      return fallbackCopyTextToClipboard(text, resetInterval);
    }
  };

  return { clipboard, copyToClipboard };
};
