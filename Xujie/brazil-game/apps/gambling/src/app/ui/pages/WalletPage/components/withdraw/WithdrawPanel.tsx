import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { InputValue } from '../../../../components-bs/Inputs/Input';
import {
  useGetWithdrawLimitMutation,
  useWithdrawMutation,
} from '../../../../../external';
import { environment } from '../../../../../../environments/environment';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { useAutoUpdateBalance } from '../../../../hooks/useAutoUpdateBalance';
import { RootState } from '../../../../../reduxStore';
import { renderByUVersion } from '../../../../utils/renderByUVersion';
import { WithdrawPanel as CWithdrawPanel } from '../../env/u1/tabsContent/withdraw/WithdrawPanel';
import { WithdrawPanel as PWithdrawPanel } from '../../env/p1/tabsContent/withdraw/WithdrawPanel';
import { WithdrawPanel as WWithdrawPanel } from '../../env/wild/tabsContent/withdraw/WithdrawPanel';
import { WithdrawPanel as RWithdrawPanel } from '../../env/u2/tabsContent/withdraw/WithdrawPanel';
import { WithdrawPanel as U5WithdrawPanel } from '../../env/u5/WithdrawPanel';
import { WithdrawPanel as U6WithdrawPanel } from '../../env/u6/WithdrawPanel';
import { WithdrawPanel as U7WithdrawPanel } from '../../env/u7/WithdrawPanel';

import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import moment from 'moment';
import { totalReasableSelector } from '../../../../../reduxStore/appSlice';
import { formatLocaleMoney } from '../../../../utils/format';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import t from 'apps/gambling/src/assets/constant/lang';
import { AccountType } from '../../../../../external/WithdrawEndpoint';

type IWithdrawPanel = {
  onClickToWithdrawRecord: () => void;
};

type ISelectOption = {
  value: string;
  label: string;
};

export type IWithdrawPanelCommon = {
  vip_level: RootState['app']['vip_level'];

  withdrawLimitMin: number;
  withdrawLimitMax: number;

  amountInput: InputValue<string>;
  setAmountInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  validateAmount: (value: string) => void;

  nameInput: InputValue<string>;
  setNameInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  validateName: (value: string) => void;

  CPFInput: InputValue<string>;
  setCPFInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  validateCPForCNPJ: (value: string) => void;

  selectInput: InputValue<string>;
  setSelectInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;

  tipoPixOptions: ISelectOption[];
  selectOption: ISelectOption;
  setSelectOption: (value: ISelectOption) => void;
  validateSelectInput: (value: string) => void;

  onClickToWithdraw: () => void;
  onClickToVIP: () => void;
  onClickToWithdrawRecord: () => void;

  contextHolder: any;
  isDuringRestrictTime: boolean;
  isWithdrawBtnDisabled?: boolean;

  menuIsOpen?: boolean;
  setMenuIsOpen?: any;
};

export const WithdrawPanel = (props: IWithdrawPanel) => {
  const vip_level = useSelector((state: RootState) => state.app?.vip_level);

  const { onClickToVipGrade } = usePageNavigate();

  const [amountInput, setAmountInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const [nameInput, setNameInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const [CPFInput, setCPFInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });

  const [selectInput, setSelectInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });

  // 暫時只有 u6 設置，防止提現連點
  const [isWithdrawBtnDisabled, setIsWithdrawBtnDisabled] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const withdrawBegin = useSelector(
    (state: RootState) => state.app.withdrawBegin
  );
  const withdrawEnd = useSelector((state: RootState) => state.app.withdrawEnd);
  const totalReasableValue = useSelector(totalReasableSelector);

  const duringRestrictWithdrawTime = (begin: string, end: string) => {
    const beginNumber = Number(begin.replace(':', ''));
    const endNumber = Number(end.replace(':', ''));
    const nowGmtMinus3String = moment().utcOffset(-3).format('HH:mm');
    const nowGmtMinus3Number = Number(nowGmtMinus3String.replace(':', ''));

    if (endNumber < beginNumber) {
      // 表示區間有跨日
      return (
        nowGmtMinus3Number >= beginNumber || nowGmtMinus3Number <= endNumber
      );
    } else {
      return (
        nowGmtMinus3Number >= beginNumber && nowGmtMinus3Number <= endNumber
      );
    }
  };

  const isDuringRestrictTime = duringRestrictWithdrawTime(
    withdrawBegin,
    withdrawEnd
  );

  const tipoPixOptions = [
    { value: 'CPF', label: 'CPF' },
    { value: 'E-mail', label: 'E-mail' },
    { value: 'Telefone(+55)', label: 'Telefone(+55)' },
    // { value: 'CNPJ', label: 'CNPJ' },
  ];

  const [selectOption, setSelectOption] = useState(tipoPixOptions[0]);
  const [triggerGetWithdrawLimit, currentWithdrawLimitData] =
    useGetWithdrawLimitMutation();
  // console.log("currentWithdrawLimitData", currentWithdrawLimitData);
  useEffect(() => {
    triggerGetWithdrawLimit({
      token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
    });
  }, []);

  const withdrawLimitMin = useMemo(() => {
    if (
      !currentWithdrawLimitData ||
      !currentWithdrawLimitData?.data ||
      !currentWithdrawLimitData?.data?.data ||
      !currentWithdrawLimitData?.data?.data?.withdrawMin
    )
      return 0;
    return (
      parseFloat(
        (currentWithdrawLimitData?.data?.data?.withdrawMin / 100).toFixed(2)
      ) || 0
    );
  }, [currentWithdrawLimitData]);

  const withdrawLimitMax = useMemo(() => {
    if (
      !currentWithdrawLimitData ||
      !currentWithdrawLimitData?.data ||
      !currentWithdrawLimitData?.data?.data ||
      !currentWithdrawLimitData?.data?.data?.withdrawMax
    )
      return 0;
    return (
      parseFloat(
        (currentWithdrawLimitData?.data?.data?.withdrawMax / 100).toFixed(2)
      ) || 0
    );
  }, [currentWithdrawLimitData]);

  const validateAmount = (value: string) => {
    const isOutOfRange =
      Number(value) > Number(withdrawLimitMax) ||
      Number(value) < Number(withdrawLimitMin);
    const isValueError = value === '' || isNaN(Number(value));
    const isNotBaseOn10 = Number(value) % 10;
    const isOverTotalReasableValue = Number(value) > totalReasableValue;
    const isError =
      isOutOfRange || isValueError || isNotBaseOn10 || isOverTotalReasableValue;
    const totalReasableValueBase10 =
      Number(Math.floor(totalReasableValue / 10)) * 10;
    // 錯誤訊息 (超過可提取): 可提取金額為0.00 - > O valor que pode ser sacado é 0.00
    // 錯誤訊息 (欄位空白): Valor da retirada (50 - 100)
    const errorMessage = isOutOfRange
      ? `O valor que pode ser sacado é R$ ${formatLocaleMoney(
          withdrawLimitMin
        )} - R$ ${formatLocaleMoney(withdrawLimitMax)}`
      : isValueError
      ? `Valor da retirada (R$ ${formatLocaleMoney(
          withdrawLimitMin
        )} - R$ ${formatLocaleMoney(withdrawLimitMax)})`
      : isNotBaseOn10
      ? 'O valor da retirada deve ser em múltiplos de R$50. Por exemplo:  R$50, R$100, R$1.100, R$1.650, R$28.650…'
      : isOverTotalReasableValue
      ? `O valor que pode ser sacado é R$ ${
          totalReasableValue > totalReasableValueBase10
            ? totalReasableValueBase10
            : 0
        }`
      : '';

    setAmountInput({
      data: value,
      isValidation: !isError,
      errorMessage,
    });

    return isError;
  };

  const validateName = (value: string) => {
    const isError = value === '' || /^\s*$/.test(value);
    setNameInput({
      data: value,
      isValidation: !isError,
      errorMessage: !isError ? '' : t['accountHolderNameHint'],
    });
    return isError;
  };

  const validateCPForCNPJ = (value: string) => {
    // NOTE: CPF, CNPJ
    // const isError = isNaN(Number(value)) || value === "" || (value.length !== 11 && value.length !== 14);
    // NOTE: CPF
    const isError = isNaN(Number(value)) || value === '' || value.length !== 11;
    setCPFInput({
      data: value,
      isValidation: !isError,
      errorMessage: !isError ? '' : t['CPFErrorMsg'],
    });

    // CPF 11, CNPJ 14
    return isError;
  };

  const validateSelectInput = (value: string) => {
    let isError = false;
    if (selectOption.label === 'CPF') {
      isError = isNaN(Number(value)) || value === '' || value.length !== 11;
      const errorMessage = t['CPFErrorMsg'];
      setSelectInput({
        data: value,
        isValidation: !isError,
        errorMessage: !isError ? '' : errorMessage,
      });

      // NOTE: 後端暫時不支援此方法
    } else if (selectOption.label === 'CNPJ') {
      isError = isNaN(Number(value)) || value === '' || value.length !== 14;
      const errorMessage = t['CNPJErrorMsg'];
      setSelectInput({
        data: value,
        isValidation: !isError,
        errorMessage: !isError ? '' : errorMessage,
      });
    } else if (selectOption.label === 'E-mail') {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      isError = !emailPattern.test(value) || value === '';
      setSelectInput({
        data: value,
        isValidation: !isError,
        errorMessage: !isError
          ? ''
          : value === ''
          ? t['EmailErrorMsg']
          : t['EmailErrorFormatMsg'],
      });
    } else if (selectOption.label === 'Telefone(+55)') {
      isError =
        isNaN(Number(value)) ||
        value === '' ||
        (value.length !== 10 && value.length !== 11);
      setSelectInput({
        data: value,
        isValidation: !isError,
        errorMessage: !isError ? '' : t['phoneNumberError'],
      });
    }
    return isError;
  };

  useEffect(() => {
    setSelectInput({
      data: '',
      isValidation: true,
      errorMessage: '',
    });
  }, [selectOption]);

  const [triggerWithdraw, { data, isLoading, isSuccess, isError }] =
    useWithdrawMutation();

  const [api, contextHolder] = notification.useNotification();

  const { update } = useAutoUpdateBalance({
    autoWindowFocusRefresh: false,
  });

  const onClickToWithdraw = () => {
    setIsWithdrawBtnDisabled(true);

    const isError1 = validateAmount(amountInput.data);
    const isError2 = validateName(nameInput.data);
    const isError3 = validateCPForCNPJ(CPFInput.data);
    const isError4 = validateSelectInput(selectInput.data);
    if (isError1 || isError2 || isError3 || isError4) {
      api.error({
        message: t['formatError'],
      });

      setIsWithdrawBtnDisabled(false);
      return;
    }

    let type: AccountType = 1;
    if (selectOption.label === 'CPF' || selectOption.label === 'CNPJ') {
      type = 1;
    } else if (selectOption.label === 'E-mail') {
      type = 2;
    } else if (selectOption.label === 'Telefone(+55)') {
      type = 3;
    }

    triggerWithdraw({
      token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
      app_package_name: environment.appPackageName,
      app_version: environment.appVersion,
      amount: Number(amountInput.data),
      pix: {
        customerName: nameInput.data,
        // CPF|CNPJ
        customerCert: CPFInput.data,
        accountType: type,
        accountNum: selectInput.data,
      },
      // pix: JSON.stringify({
      //   customerName: nameInput.data,
      //   // CPF|CNPJ
      //   customerCert: CPFInput.data,
      //   accountType: type,
      //   accountNum: selectInput.data,
      // })
    })
      .unwrap()
      .then((data) => {
        if (data?.code === 200) {
          update();
          api.success({
            message: data?.msg || t['withdrawSuccess'],
            onClick: () => {
              props.onClickToWithdrawRecord();
            },
            onClose: () => {
              props.onClickToWithdrawRecord();
            },
          });
        }
        // 112014 銀行關閉，提現時間範圍
        else if (data?.code === 103016) {
          // NOTE: cannot withdraw
          api.error({
            message: data?.msg,
          });
          setIsWithdrawBtnDisabled(false);
        } else {
          api.error({
            message: data?.msg,
          });
          setIsWithdrawBtnDisabled(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsWithdrawBtnDisabled(false);
      });
  };

  return renderByUVersion(
    {
      p1: (
        <PWithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
        />
      ),
      u1: (
        <CWithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
        />
      ),
      wild777bet: (
        <WWithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
        />
      ),
      u2: (
        <RWithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
        />
      ),
      u5: (
        <U5WithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
        />
      ),
      u6: (
        <U6WithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
          isWithdrawBtnDisabled={isWithdrawBtnDisabled}
        />
      ),
      u7: (
        <U7WithdrawPanel
          vip_level={vip_level}
          withdrawLimitMin={withdrawLimitMin}
          withdrawLimitMax={withdrawLimitMax}
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          validateAmount={validateAmount}
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
          tipoPixOptions={tipoPixOptions}
          onClickToWithdraw={onClickToWithdraw}
          onClickToVIP={onClickToVipGrade}
          onClickToWithdrawRecord={props.onClickToWithdrawRecord}
          contextHolder={contextHolder}
          isDuringRestrictTime={isDuringRestrictTime}
          isWithdrawBtnDisabled={isWithdrawBtnDisabled}
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
        />
      ),
    },
    <PWithdrawPanel
      vip_level={vip_level}
      withdrawLimitMin={withdrawLimitMin}
      withdrawLimitMax={withdrawLimitMax}
      amountInput={amountInput}
      setAmountInput={setAmountInput}
      validateAmount={validateAmount}
      nameInput={nameInput}
      setNameInput={setNameInput}
      validateName={validateName}
      CPFInput={CPFInput}
      setCPFInput={setCPFInput}
      validateCPForCNPJ={validateCPForCNPJ}
      selectInput={selectInput}
      setSelectInput={setSelectInput}
      selectOption={selectOption}
      setSelectOption={setSelectOption}
      validateSelectInput={validateSelectInput}
      tipoPixOptions={tipoPixOptions}
      onClickToWithdraw={onClickToWithdraw}
      onClickToVIP={onClickToVipGrade}
      onClickToWithdrawRecord={props.onClickToWithdrawRecord}
      contextHolder={contextHolder}
      isDuringRestrictTime={isDuringRestrictTime}
    />
  );
};
