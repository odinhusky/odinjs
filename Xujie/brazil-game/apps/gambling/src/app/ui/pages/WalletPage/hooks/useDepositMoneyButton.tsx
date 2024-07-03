import { useState } from "react";
import { formatLocaleMoney } from "../../../utils/format";
import { InputValue } from "../../../components-bs/Inputs/Input";
import { IDepositPanel } from "../components/deposit/DepositPanel";
import { useGetConfig } from "./useGetConfig";




export const useDepositMoneyButton = (props: IDepositPanel) => {
  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const [selectedIndexConfig, setSelectedIndexConfig] = useState<RechargeResponseConfig>();
  const { getConfig } = useGetConfig(props);

  const depositButtonsOptions = props?.data?.options?.recharge_options?.map((rechargeValue: number, index: number) => {
    const config = getConfig(rechargeValue);
    const isShowRate = Number(config?.rate) > 0 || (Number(rechargeValue) * Number(config?.rate)) > Number(config?.amount_min);

    const rate = config && config?.rate && parseFloat(config?.rate) !== 0 ? formatLocaleMoney(Number(rechargeValue) * Number(config?.rate)) : ""
    return {
      rechargeValue, config, isShowRate, rate
    }
  })

  return {
    depositButtonsOptions
  }
}
