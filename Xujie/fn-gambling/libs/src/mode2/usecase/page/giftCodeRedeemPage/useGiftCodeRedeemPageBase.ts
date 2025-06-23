import { useMode2PageResetFloatActionButton } from '@mode2/usecase/page/useMode2PageResetFloatActionButton';
import useGiftCodeRedeemPageHeaderSetting from '@mode2/usecase/page/giftCodeRedeemPage/useGiftCodeRedeemPageHeaderSetting';
import useGiftCodeRedeemPageFooterSetting from '@mode2/usecase/page/giftCodeRedeemPage/useGiftCodeRedeemPageFooterSetting';
import useRedeemGiftCodeBase from '@mode2/usecase/page/giftCodeRedeemPage/useRedeemGiftCodeBase';
import {
  GiftCodeRedeemResultScenarios,
  GiftCodeRedeemScenarios,
} from '@mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';

export const useGiftCodeRedeemPageBase = (
  displayResult: GiftCodeRedeemResultScenarios = GiftCodeRedeemResultScenarios.TOAST
) => {
  useRedeemGiftCodeBase(GiftCodeRedeemScenarios.PAGE, displayResult);

  useGiftCodeRedeemPageHeaderSetting();

  useGiftCodeRedeemPageFooterSetting();

  useMode2PageResetFloatActionButton();
};

export default useGiftCodeRedeemPageBase;
