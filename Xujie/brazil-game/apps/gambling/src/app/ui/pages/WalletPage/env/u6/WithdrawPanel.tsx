import { IWithdrawPanelCommon } from "../../components/withdraw/WithdrawPanel";
import WalletSharedWithdrawPanel from "./components/WalletSharedWithdrawPanel";

export const WithdrawPanel = (props: IWithdrawPanelCommon) => {

  return <WalletSharedWithdrawPanel {...props} />;
}
