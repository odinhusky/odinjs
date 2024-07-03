import { PageOrModalPathEnum } from "../../../../PageOrModalPathEnum";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { environment } from "../../../../../../environments/environment";
import { IDepositInput } from "./DepositInput";

import { renderByUVersion } from "../../../../utils/renderByUVersion";

import { formatLocaleMoney } from "../../../../utils/format";
import { useRechargeMutation } from "../../../../../external";
import { AppLocalStorage } from "../../../../../persistant/localstorage";
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey";

import { DepositPanel as RDepositPanel } from '../../env/u2/tabsContent/deposit/DepositPanel';
import { DepositPanel as CDepositPanel } from '../../env/u1/tabsContent/deposit/DepositPanel';
import { DepositPanel as WDepositPanel } from '../../env/wild/tabsContent/deposit/DepositPanel';
import { DepositPanel as PDepositPanel } from '../../env/p1/tabsContent/deposit/DepositPanel';
import { DepositPanel as U5DepositPanel } from '../../env/u5/DepositPanel';
import { DepositPanel as U6DepositPanel } from '../../env/u6/DepositPanel';
import { DepositPanel as U7DepositPanel } from '../../env/u7/DepositPanel';

import { useDepositInput } from "../../hooks/useDepositInput";
import { useGetConfig } from "../../hooks/useGetConfig";
import { useDepositMoneyButton } from "../../hooks/useDepositMoneyButton";
import {
  GetRechargeConfigResponseConfig,
  GetRechargeConfigResponseOption
} from "../../../../../external/SystemEndpoint";

export interface IDepositPanel {
  data?: {
    config: GetRechargeConfigResponseConfig[],
    options: GetRechargeConfigResponseOption;
  }
}

export type IDepositPanelProps = IDepositPanel & {
  isLoaded: boolean;
  selectedIndex: number;
  selectedIndexConfig?: GetRechargeConfigResponseConfig;
  depositInputProps: IDepositInput;
  handleClickDepositMoneyButton: (rechargeValue: number, index: number, config: GetRechargeConfigResponseConfig) => void;
  depositButtonsOptions: {
    rechargeValue: number;
    config: GetRechargeConfigResponseConfig
    isShowRate: boolean;
    rate: string
  }[];
  onClickToNextDepositPage: (event: any) => void;
  menuIsOpen?:boolean;
  setMenuIsOpen?:any;
}

export const DepositPanel = (props: IDepositPanel) => {

  const depositInputProps = useDepositInput(props);
  const { depositButtonsOptions = [] } = useDepositMoneyButton(props)
  const { getConfig } = useGetConfig(props);

  const navigate = useNavigate();
  const [triggerRecharge, { data, isLoading, isSuccess, isError }] = useRechargeMutation();

  const [clicked, setClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexConfig, setSelectedIndexConfig] = useState<GetRechargeConfigResponseConfig>();
  const { inputValue, setInputValue } = depositInputProps;
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // NOTE: bd
  const { recharge_options_default = 0, recharge_options = [] } = props?.data?.options || {};

  // 根據預設值初始化
  useEffect(() => {
    // 設定有符合的充值按鈕
    const defaultIndex = recharge_options.indexOf(Number(recharge_options_default))
    setSelectedIndex(defaultIndex);

    // 設定預設輸數框
    setInputValue({
      isValidation: true,
      data: String(recharge_options_default),
      errorMessage: "",
    })

    const config = getConfig(recharge_options_default);
    setSelectedIndexConfig(config);
    // console.log(`rechargeValue:${recharge_options_default}`)
    // console.log("configs:", config);
  }, [props?.data, recharge_options_default, recharge_options])

  // NOTICE: 當輸入框有變動時
  useEffect(() => {
    // 設定有符合的充值按鈕
    const defaultIndex = recharge_options.indexOf(Number(inputValue.data))
    // 有匹配到符合的充值按鈕
    if (defaultIndex > -1) {
      setSelectedIndex(defaultIndex);
    } else {
      setSelectedIndex(-1)
    }
    // NOTICE: Fatal note - props?.data 在 getConfig 有用到
    const config = getConfig(Number(inputValue.data));
    setSelectedIndexConfig(config);
    // console.log(`[input] inputValue:${inputValue.data}`)
    // console.log("[input] configs:", config);
  }, [props?.data, recharge_options, inputValue.data])



  const isLoaded = recharge_options && recharge_options.length > 0;
  const onClickToNextDepositPage = (event: any) => {
    if (!isLoaded) return;;

    if (!inputValue.isValidation) return;
    if (!clicked) {
      setClicked(true);
      triggerRecharge({
        amount: Number(inputValue.data),
        configId: Number(selectedIndexConfig?.id),
        // 以下是 php api 所需參數
        appPackageName: environment.appPackageName,
        appVersion: environment.appVersion,
        phone: AppLocalStorage.getItem(AppLocalStorageKey.kPhone) || '',
        qr: 1,
        token: AppLocalStorage.getItem(AppLocalStorageKey.token) || ''
      }).then(({ data }: any) => {
        navigate(PageOrModalPathEnum.WalletDepositNextPage, {
          state: {
            amount: Number(inputValue.data),
            data,
          }
        });
      })
    }
  }

  const handleClickDepositMoneyButton = (rechargeValue: number, index: number, config: GetRechargeConfigResponseConfig) => {
    setSelectedIndex(index);
    setInputValue({
      data: String(rechargeValue),
      isValidation: true,
      errorMessage: "",
    })
    setSelectedIndexConfig(config);
  };

  const isShowInputTag = selectedIndexConfig && Number(selectedIndexConfig?.rate) > 0;
  
  const extraDepositBonus = formatLocaleMoney(Number(inputValue.data) * Number(selectedIndexConfig && selectedIndexConfig?.rate || 1));

  return renderByUVersion({
    "wild777bet": (
      <WDepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "p1": (
      <PDepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "u1": (
      <CDepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "u2": (
      <RDepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "u5": (
      <U5DepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "u6": (
      <U6DepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        selectedIndexConfig={selectedIndexConfig}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
      />
    ),
    "u7": (
      <U7DepositPanel
        {...props}
        isLoaded={isLoaded}
        selectedIndex={selectedIndex}
        selectedIndexConfig={selectedIndexConfig}
        depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
        handleClickDepositMoneyButton={handleClickDepositMoneyButton}
        depositButtonsOptions={depositButtonsOptions}
        onClickToNextDepositPage={onClickToNextDepositPage}
        menuIsOpen={menuIsOpen}
        setMenuIsOpen={setMenuIsOpen}
      />
    )
  }, (
    <PDepositPanel
      {...props}
      isLoaded={isLoaded}
      selectedIndex={selectedIndex}
      depositInputProps={{ ...depositInputProps, isShowInputTag, extraDepositBonus }}
      handleClickDepositMoneyButton={handleClickDepositMoneyButton}
      depositButtonsOptions={depositButtonsOptions}
      onClickToNextDepositPage={onClickToNextDepositPage}
    />
  ))

}
