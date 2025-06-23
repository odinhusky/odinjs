import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import WeakTipsModal from '@modals/WeakTipsModal';
import React from 'react';

export const WalletWeakTipsModal = () => {
  const walletWeakTipsState = useWalletPageStore(
    (state) => state.walletWeakTipsState
  );

  const resetWalletWeakTipsState = useWalletPageStore(
    (state) => state.resetWalletWeakTipsState
  );

  return (
    <WeakTipsModal
      isShow={walletWeakTipsState.isShow}
      isShowClose={walletWeakTipsState.isShowClose}
      title={walletWeakTipsState.title}
      content={walletWeakTipsState.content}
      primaryBtnText={walletWeakTipsState.primaryBtnText}
      onPrimaryBtnClick={() => {
        walletWeakTipsState.onPrimaryCallback?.();
        resetWalletWeakTipsState();
      }}
      secondaryBtnText={walletWeakTipsState.secondaryBtnText}
      onSecondaryBtnClick={() => {
        walletWeakTipsState.onSecondaryCallback?.();
        resetWalletWeakTipsState();
      }}
      onClose={() => {
        walletWeakTipsState.onCloseCallback?.();
        resetWalletWeakTipsState();
      }}
    />
  );
};

export default WalletWeakTipsModal;
