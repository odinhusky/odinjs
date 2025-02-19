import {
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useUpdateDeepEffect } from '@libs/commonUtils';
import { usePostGiftRandomMutation } from '@mode2API/index';
import { useDeepEffect } from '@libs/commonUtils';
import { formatMoney } from '@mode2/utils';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

/**
 * 兌換 GiftCode 邏輯與控制
 */
export const useRedeemGiftCodeBase = (scenarios: GiftCodeRedeemScenarios) => {
  const { t } = useTranslation();

  const [postGiftRandom, { isSuccess, data, isError }] =
    usePostGiftRandomMutation();
  const redeemGiftCodeSubmitObj = useGiftCodeRedeemStore(
    (state) => state.redeemGiftCodeSubmitObj
  );

  const resetSubmitObj = useGiftCodeRedeemStore(
    (state) => state.resetSubmitObj
  );
  const isGiftRedeemFinish = useGiftCodeRedeemStore(
    (state) => state.isGiftRedeemFinish
  );
  const setGiftRedeemFinish = useGiftCodeRedeemStore(
    (state) => state.setGiftRedeemFinish
  );
  const setGiftCode = useGiftCodeRedeemStore((state) => state.setGiftCode);
  const setShowRedeemGiftCodeModal = useGiftCodeRedeemStore(
    (state) => state.setShowRedeemGiftCodeModal
  );

  const showRedeemGiftCodeModal = useGiftCodeRedeemStore(
    (state) => state.showRedeemGiftCodeModal
  );

  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const isAPIMainInfoLoading = useUserProfileStore(
    (state) => state.isAPIMainInfoLoading
  );

  const showToast = useToastStore((state) => state.showToast);

  useDeepEffect(() => {
    if (isSuccess) {
      // 提交成功 就關閉 model
      setShowRedeemGiftCodeModal(false);
      // 提交成功就提前清除 input
      setGiftCode('');
      // 兌換成功刷新金額
      refreshUserData();
    }

    if (isSuccess && data) {
      // 兌換成功金額 show Toast
      const redeemToastId = uuidv4();
      showToast(
        t('gift_code_redeem_success_toast', {
          redeemAmount: formatMoney(data.redeemAmount, true),
        }),
        (id) => {
          // 等 Toast 結束在  resetSubmit 給下一次提交
          if (id === redeemToastId) {
            resetSubmitObj(scenarios, true);
          }
        },
        redeemToastId
      );
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      // 提交錯誤清除資料，但保留input
      resetSubmitObj(scenarios, false);
    }
  }, [isError]);

  useUpdateDeepEffect(() => {
    if (
      redeemGiftCodeSubmitObj.count > 0 &&
      redeemGiftCodeSubmitObj.giftCode !== '' &&
      redeemGiftCodeSubmitObj.scenarios === scenarios &&
      !isAPIMainInfoLoading &&
      isGiftRedeemFinish
    ) {
      setGiftRedeemFinish(false);
      postGiftRandom({
        giftKey: redeemGiftCodeSubmitObj.giftCode,
      });
    }
  }, [redeemGiftCodeSubmitObj, isAPIMainInfoLoading, isGiftRedeemFinish]);

  useEffect(() => {
    // 每次 modal 打開清除
    if (showRedeemGiftCodeModal) {
      resetSubmitObj(scenarios, true);
    }
    // 給 GiftCodeRedeemPage 離開 清除
    return () => {
      resetSubmitObj(scenarios, true);
    };
  }, [showRedeemGiftCodeModal]);
};

export default useRedeemGiftCodeBase;
