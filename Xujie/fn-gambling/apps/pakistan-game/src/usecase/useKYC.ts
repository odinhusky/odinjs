import { useLocation } from 'react-router';
import {
  InitialValuesTypes,
  UpdateFromValuesTypes,
  useKycDisplayStore,
} from '@/zustand/kyc/useKycDisplayStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useCallback, useEffect, useState } from 'react';
import { useDeepEffect, useUpdateDeepEffect } from '@libs/commonUtils';
import { usePostPlayerInfoSaveMutation } from '@/external/api';

import { usePostBankSaveMutation } from '@/external/api/index';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@constant/KYC';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import {
  BankPayType,
  UIBankSaveRequest,
} from '@/external/api/endpoint/PostBankSaveEndpoint';
import { SavedBankListResult } from '@/external/api/endpoint/PostSavedBankListEndpoint';
import { get, isEmpty } from 'lodash';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useUserState } from '@/usecase/useUserState';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

const leadingRegx = /^03/;

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

  // diff
  const [activeSavedBank, setActiveSavedBank] = useState<
    SavedBankListResult | {}
  >({});

  const savedBankList = useBindKYCPageDiffStore((state) => state.savedBankList);

  const activeBankAccountTab = useBindKYCPageDiffStore(
    (state) => state.activeBankAccountTab
  );

  const isOtherBanks = activeBankAccountTab.code === 'OTHER_BANKS';

  // = 組織畫面上要的資料

  const initialValues = {
    bankCode: '',
    bankName: '',
    cnic: '',
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

  const setUpdateFormValues = useKycDisplayStore(
    (state) => state.setUpdateFormValues
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

      const payType: BankPayType = isOtherBanks ? 'BANK TRANSFER' : 'WALLET';

      if (isBankSave) {
        const bankCardId = get(activeSavedBank, 'id', '');
        const reqData: UIBankSaveRequest = {
          bankCode: values.bankCode,
          bankName: values.bankName,
          cnic: values.cnic,
          phone: values.phone,
          realName: values.realName,
          userName: values.userName,
          password: values.password,
          payType,
        };

        if (bankCardId) reqData.bankCardId = bankCardId;

        postBankSave(reqData);
      } else {
        postPlayerInfoSave({
          ...values,
          payType,
          isBindAll, // 是否同時綁定個人和銀行資訊
        });
      }
    },
    [isShowPersonalBlock, isShowBankAccountBlock, isOtherBanks, activeSavedBank]
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

  // 找到已經儲存的銀行 list 中是否有對應的物件
  useDeepEffect(() => {
    const activeBankCode = activeBankAccountTab.code;

    if (savedBankList.length === 0) return;

    if (isOtherBanks) {
      const findSavedBank = savedBankList.find(
        (item) => item.bankName !== 'JAZZCASH' && item.bankName !== 'EASYPAISA'
      );

      setActiveSavedBank(findSavedBank ? findSavedBank : {});
    } else {
      const findSavedBank = savedBankList.find(
        (item) => item.bankName === activeBankCode
      );

      setActiveSavedBank(findSavedBank ? findSavedBank : {});
    }
  }, [isOtherBanks, savedBankList, activeBankAccountTab]);

  /**
   * @author Odin
   * @description 針表單的物件進行處理，使其符合表單的規格，並且把目前儲存的資料帶入表單物件中
   * @param {UpdateFromValuesTypes} formObj - 代表要處理的物件，mutable
   * @param {SavedBankListResult} activeSavedBank - 上方定義的 state，用於記錄目前 bank account tab 切換的時候，找到對應儲存的 Bank obj
   * @returns void
   */
  const handleFormObj = ({
    formObj,
    activeSavedBank,
  }: {
    formObj: UpdateFromValuesTypes;
    activeSavedBank: SavedBankListResult | {};
  }) => {
    if (!isEmpty(activeSavedBank)) {
      formObj.bankName = !isOtherBanks
        ? activeBankAccountTab.name
        : get(activeSavedBank, 'bankName', '');

      formObj.realName = get(activeSavedBank, 'name', '');

      const bankCode = get(activeSavedBank, 'bankCode', '');
      formObj.bankCode = bankCode.replace(leadingRegx, '');

      formObj.cnic = get(activeSavedBank, 'cnic', '');
    } else {
      formObj.bankName = !isOtherBanks ? activeBankAccountTab.name : undefined;
      formObj.realName = '';
      formObj.bankCode = '';
      formObj.cnic = '';
    }
  };

  // 不管哪個模式都填入所有的資料中既有的資料，但只有這個，在第一次綁定 Personal Information 跟 Bank Account 的時候會因為切換 tab 導致 personal info 的欄位被 reset
  useDeepEffect(() => {
    const thisDefaultValues = { ...initialValues };

    // 先確認真的有資料再填入，雙重保險
    thisDefaultValues.phone = userVerifyState.hasRealPhone()
      ? leadingRegx.test(realPhone)
        ? realPhone.replace(leadingRegx, '') // 去掉 03
        : realPhone
      : thisDefaultValues.phone;

    thisDefaultValues.userName =
      userVerifyState.hasCertificationPersonalInfoNickname()
        ? nickname
        : thisDefaultValues.userName;

    handleFormObj({
      formObj: thisDefaultValues,
      activeSavedBank: activeSavedBank,
    });

    setUpdateFormValues(thisDefaultValues);
  }, [
    nickname,
    realPhone,
    bankAccountInfo,
    activeBankAccountTab,
    activeSavedBank,
  ]);

  // 切換 Bank Account tab 的時候，避免 personal info 的欄位被 reset
  useUpdateDeepEffect(
    () => {
      const resetToInitialValues: UpdateFromValuesTypes = { ...initialValues };
      delete resetToInitialValues.userName;
      delete resetToInitialValues.phone;
      if (resetToInitialValues.bankName === '')
        resetToInitialValues.bankName = undefined;

      handleFormObj({
        formObj: resetToInitialValues,
        activeSavedBank: activeSavedBank,
      });

      setUpdateFormValues(resetToInitialValues);
    },
    [activeBankAccountTab, isOtherBanks],
    true
  );

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
