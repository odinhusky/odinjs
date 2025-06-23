import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import useLeaveGameConfirmModalStore from '@libs/mode2/zustand/components/leaveGameConfirmModalStore';
import { useEffect } from 'react';
import { useMode2WebviewPageStore } from '@mode2/zustand/page/webviewPageStore';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';

export const useWebviewPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  const setIsShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.setIsShowRechargeContent
  );
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  const setIsShowLeaveGameConfirmModal = useLeaveGameConfirmModalStore(
    (state) => state.setIsShowLeaveGameConfirmModal
  );

  useEffect(() => {
    setConfig({
      type: EHeaderType.GameWeb,
      onBack: () => {
        const isShowRechargeContent =
          useMode2WebviewPageStore.getState().isShowRechargeContent;
        if (isShowRechargeContent) {
          setIsShowRechargeContent(false);
          finishRecharge();
        } else {
          setIsShowLeaveGameConfirmModal(true);
        }
      },
      onDepositClick: () => {
        setIsShowRechargeContent(true);
      },
      onSystemLogoClick: () => {},
    });
  }, []);
};

export default useWebviewPageHeaderSetting;
