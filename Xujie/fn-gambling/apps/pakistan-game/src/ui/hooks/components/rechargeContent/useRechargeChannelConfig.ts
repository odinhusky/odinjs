import { useEffect } from 'react';
import { usePostPayConfigInfoWithOptionsMutation } from '@mode2API/index';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import {
  handleWalletPagePayPayChannelOtpClick,
  handleWalletPageSetPayChannelClick,
} from '@mode2/action/walletPageAction/acitonType';

export const useRechargeChannelConfig = () => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

  const [postPayConfigInfo, { data: payConfigInfoResult }] =
    usePostPayConfigInfoWithOptionsMutation();

  const setAllPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.setAllPayChannelActionItems
  );

  const setOriginalPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.setOriginalPayChannelActionItems
  );

  const originalPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.originalPayChannelActionItems
  );

  useEffect(() => {
    postPayConfigInfo();
  }, []);

  useEffect(() => {
    if (payConfigInfoResult && payConfigInfoResult.payChannels) {
      setOriginalPayChannelActionItems(payConfigInfoResult.payChannels);
    }
  }, [payConfigInfoResult]);

  useEffect(() => {
    const allPayActions = originalPayChannelActionItems.flatMap((item) => {
      const optionActions = item.options.map((item) => {
        return {
          ...item,
          onAction: () => {
            handleWalletPageBaseClick({
              actionName: handleWalletPagePayPayChannelOtpClick,
              payload: { item },
            });
          },
        };
      });

      return {
        ...item,
        optionActions: optionActions,
        onAction: () => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageSetPayChannelClick,
            payload: { item },
          });
        },
      };
    });
    setAllPayChannelActionItems(allPayActions);
  }, [originalPayChannelActionItems]);
};

export default useRechargeChannelConfig;
