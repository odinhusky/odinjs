import { renderByRWD } from "../../../../utils/renderByRWD";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import DesktopWalletPage from "./device/DesktopWalletPage";
import { IWalletPage } from "../pernambucana/WalletPage";
import TabletWalletPage from "./device/TabletWalletPage";
import MobileWalletPage from "./device/MobileWalletPage";


export const WalletPage = (props: IWalletPage) => {

  const device = useBreakpoint()

  return renderByRWD({
    desktop: <DesktopWalletPage {...props} />,
    tablet:<TabletWalletPage {...props} />,
    mobile: <MobileWalletPage {...props} />
  }, device)
}
