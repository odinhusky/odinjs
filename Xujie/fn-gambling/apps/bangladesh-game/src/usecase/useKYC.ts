import { useLocation, useNavigate } from 'react-router';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import {
  InitialValuesTypes,
  useKycDisplayStore,
} from '@/zustand/kyc/useKycDisplayStore';
import { useCallback, useEffect, useState } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import { usePostPlayerInfoSaveMutation } from '@libs/mode2/external/api';

import { usePostBankSaveMutation } from '@/external/api/index';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@constant/KYC';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useUserState } from '@/usecase/useUserState';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import {
  useNavigateClick,
  useNavPageClick,
} from '@mode2/usecase/useNavPageClick';

export const useKYC = () => {
  const { t } = useTranslation();
  const navigate = useNavigateClick();
  const location = useLocation();
  const checkType = location.state ? location.state?.tab : KYC_BOTH_STATE;
  const { refreshUserState } = useUserState();
  const userVerifyState = useUserVerifyState();
  const [
    postBankSave,
    {
      data: bankSaveResult,
      isSuccess: isBankSaveSuccess,
      isLoading: isBankSaveLoading,
    },
  ] = usePostBankSaveMutation();

  const [
    postPlayerInfoSave,
    {
      data: playerInfoResult,
      isSuccess: isPlayerInfoSuccess,
      isLoading: isPlayerInfoLoading,
    },
  ] = usePostPlayerInfoSaveMutation();

  // # API 來的資料
  const isPersonalInfoFirstBind = useUserProfileStore(
    (state) => state.isPersonalInfoFirstBind
  );

  const isBankFirstBind = useUserProfileStore((state) => state.isBankFirstBind);

  // const personalInfo = useKycDataStore((state) => state.personalInfo);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const nickname = useUserProfileStore((state) => state.nickname);

  const bankAccountInfo = useKycDataStore((state) => state.bankAccountInfo);

  const refreshKYCInit = useKycDataStore((state) => state.refreshKYCInit);

  // = 組織畫面上要的資料

  const initialValues = {
    bankCode: '',
    ifsc: '',
    phone: '',
    realName: '',
    userName: '',
    password: '',
  };

  const setIsShowPersonalBlock = useKycDisplayStore(
    (state) => state.setIsShowPersonalBlock
  );

  const setIsShowBankAccountBlock = useKycDisplayStore(
    (state) => state.setIsShowBankAccountBlock
  );

  const setIsShowPasswordInput = useKycDisplayStore(
    (state) => state.setIsShowPasswordInput
  );

  const setIsDisablePhoneInput = useKycDisplayStore(
    (state) => state.setIsDisablePhoneInput
  );

  const setDefaultValues = useKycDisplayStore(
    (state) => state.setDefaultValues
  );

  const isShowPersonalBlock = useKycDisplayStore(
    (state) => state.isShowPersonalBlock
  );

  const isShowBankAccountBlock = useKycDisplayStore(
    (state) => state.isShowBankAccountBlock
  );

  const setHeaderTitleText = useKycDisplayStore(
    (state) => state.setHeaderTitleText
  );

  const saveBindKYC = useCallback(
    (values: InitialValuesTypes) => {
      const isBankSave =
        isShowPersonalBlock === false && isShowBankAccountBlock === true;
      const isBindAll =
        isShowPersonalBlock === true && isShowBankAccountBlock === true;

      if (isBankSave) {
        const reqData = {
          bankCode: values.bankCode,
          ifsc: values.ifsc,
          phone: values.phone,
          realName: values.realName,
          userName: values.userName,
          password: values.password,
        };

        postBankSave(reqData);
      } else {
        postPlayerInfoSave({
          ...values,
          isBindAll, // 是否同時綁定個人和銀行資訊
        });
      }
    },
    [isShowPersonalBlock, isShowBankAccountBlock]
  );

  useEffect(() => {
    switch (checkType) {
      // 從 my/personal 連過來，或是從 withdraw/deposit 的時候連過來
      // 只需要考慮是否有綁定
      case KYC_PERSONAL_STATE:
        setIsShowPersonalBlock(true);
        setIsShowBankAccountBlock(false);

        // 控制是否要 Disabled Phone Input
        if (isPersonalInfoFirstBind === false) {
          setIsDisablePhoneInput(true);
        } else {
          setIsDisablePhoneInput(false);
        }

        setIsShowPasswordInput(false);
        break;
      // 從 my/bank 連過來從 withdraw/withdraw 的時候連過來
      // 或是從遊戲內部充值過來
      case KYC_BOTH_STATE:
      default:
        setIsShowBankAccountBlock(true);

        if (isPersonalInfoFirstBind === true) {
          setIsShowPersonalBlock(true);
          setIsDisablePhoneInput(false);
        } else {
          setIsShowPersonalBlock(false);
          setIsDisablePhoneInput(true);
        }

        if (isBankFirstBind === false) {
          setIsShowPasswordInput(false);
        } else {
          setIsShowPasswordInput(true);
        }
        break;
    }
  }, [checkType, isPersonalInfoFirstBind, isBankFirstBind]);

  // 不管哪個模式都填入所有的個人資料中既有的資料
  useDeepEffect(() => {
    const thisDefaultValues = { ...initialValues };

    // 先確認真的有資料再填入，雙重保險
    thisDefaultValues.phone = userVerifyState.hasRealPhone()
      ? realPhone
      : thisDefaultValues.phone;

    thisDefaultValues.userName =
      userVerifyState.hasCertificationPersonalInfoNickname()
        ? nickname
        : thisDefaultValues.userName;

    thisDefaultValues.realName = bankAccountInfo.realName;
    thisDefaultValues.bankCode = bankAccountInfo.bankCode;
    thisDefaultValues.ifsc = bankAccountInfo.ifsc;
    setDefaultValues(thisDefaultValues);
  }, [realPhone, nickname, bankAccountInfo]);

  // Send Event
  useEffect(() => {
    if (isBankSaveSuccess) {
      sdkUtils.sendEvent(AdjustEventKey.BANK_CARD_BINDING);
      message.success(t('toast_payment_info_saved'));
      refreshUserState();

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } else {
      console.log('@@ bindBindAccountFail');
    }
  }, [isBankSaveSuccess]);

  useEffect(() => {
    if (isPlayerInfoSuccess) {
      sdkUtils.sendEvent(AdjustEventKey.RECHARGE_INFO_VERIFICATION);
      message.success(t('toast_payment_info_saved'));
      refreshUserState();

      if (isShowBankAccountBlock) {
        sdkUtils.sendEvent(AdjustEventKey.BANK_CARD_BINDING);
      }

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } else {
      console.log('@@ bindPlayerInfoFail');
    }
  }, [isPlayerInfoSuccess]);

  // 決定 Desktop Header 的 Title text
  useEffect(() => {
    if (isShowPersonalBlock === true && isShowBankAccountBlock === false) {
      setHeaderTitleText(t('account_menu_personal_information'));
    } else {
      setHeaderTitleText(t('account_menu_bank_account'));
    }
  }, [isShowPersonalBlock, isShowBankAccountBlock, t]);

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(isPlayerInfoLoading || isBankSaveLoading);
  }, [isBankSaveLoading, isPlayerInfoLoading]);

  // 離開 BinKYCPage 的時候重新取得一次最新的資料
  useEffect(() => {
    return () => {
      refreshKYCInit();
    };
  }, []);

  return {
    saveBindKYC,
    disabled,
  };
};

export default useKYC;
