import { BalanceSectionType, IBalanceSectionProps } from "./types/walletTypes";
import {useState} from "react";
import WalletBtnGroup from "./components/WalletBtnGroup";
import WalletTotalSection from './components/WalletTotalSection';

export const BalanceSection = ({ balanceSectionValue }: IBalanceSectionProps) => {
  const [tabState, setTabState] = useState<BalanceSectionType>('total')

  return (
    <div className='mt-3 mobile:mt-4 tablet:mt-5'>
      <WalletBtnGroup
        tabState={tabState}
        handleSetTabState={(val: BalanceSectionType) => { setTabState(val) }}
      />

      <WalletTotalSection
        balanceSectionValue={balanceSectionValue}
        tabState={tabState}
      />
    </div>
  )
}

export default BalanceSection;