import { IDepositPanelProps } from "../../components/deposit/DepositPanel";
import WalletSharedDepositPanel from "./components/WalletSharedDepositPanel";

export const DepositPanel = (props: IDepositPanelProps) => {

  return <WalletSharedDepositPanel {...props}/>
}
