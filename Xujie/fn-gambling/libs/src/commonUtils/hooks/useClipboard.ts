import { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import useDeepEffect from './useDeepEffect';
import { useTranslation } from 'react-i18next';
import { useMessageStore } from '@mode2/zustand/components/messageStore';

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

export interface CopyOptions {
  resetInterval?: number; // 複製成功後，重置狀態的時間，單位為秒，預設為 2 秒
  successMessage?: string; // 複製成功時的訊息
  failMessage?: string; // 複製失敗時的訊息
}

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
 * copyToClipboard(text, {});
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

  /**
   * 生成提示的信息
   * @param state
   * @param message
   * @param resetInterval
   * @returns
   */
  const generate = (
    state: ClipboardState,
    message: string | undefined,
    resetInterval: number = 2000
  ): ClipboardInfo => {
    return {
      state: state,
      message: t(message || 'toast_copied_successfully'),
      resetInterval: resetInterval,
    };
  };

  /**
   * 显示Toast
   * @param message 默认t('toast_copied_successfully')
   * @param state
   * @returns
   */
  const showMessage = (message: string, state: ClipboardState) => {
    const messageStore = useMessageStore.getState();
    if (state === ClipboardState.SUCCESS) {
      messageStore.success(message || t('toast_copied_successfully'));
    } else if (state === ClipboardState.FAIL) {
      messageStore.error(message);
    } else {
      console.log('clipboard state is unknown')
    }
  };

  useDeepEffect(() => {
    if (clipboard.resetInterval !== 0) {
      setTimeout(() => {
        showMessage(clipboard.message, clipboard.state);
      }, clipboard.resetInterval);
    }
  }, [clipboard]);

  const failMessage = 'Fallback: Failed to copy text';

  const fallbackCopyTextToClipboard = (
    text: string,
    options?: CopyOptions
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

    const { resetInterval = 2000, successMessage } = options || {};

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const success = generate(ClipboardState.SUCCESS, successMessage);
        setClipboardInfo(success);
        reset(resetInterval);
        return Promise.reject(success);
      } else {
        const fail = generate(ClipboardState.FAIL, failMessage);
        return Promise.reject(fail);
      }
    } catch (error) {
      console.error(failMessage, error);
      const fail = generate(ClipboardState.FAIL, `${failMessage}: ${error}`);
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
    options?: CopyOptions
  ): Promise<ClipboardInfo> => {
    const { resetInterval = 2000 } = options || {};

    if (isEmpty(text.trim())) {
      const fail = generate(ClipboardState.FAIL, `${failMessage}: is Empty`);
      setClipboardInfo(fail);
      return Promise.reject(fail);
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        const success = generate(
          ClipboardState.SUCCESS,
          options?.successMessage,
          resetInterval
        );
        setClipboardInfo(success);
        reset(resetInterval);
        return Promise.resolve(success);
      } catch (error) {
        return fallbackCopyTextToClipboard(text, options);
      }
    } else {
      return fallbackCopyTextToClipboard(text, options);
    }
  };

  return { clipboard, copyToClipboard };
};
