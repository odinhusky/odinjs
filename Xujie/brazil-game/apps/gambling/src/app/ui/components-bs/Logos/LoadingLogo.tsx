import {renderByUVersion} from "../../utils/renderByUVersion";
import {LoadingLogo as CLoadingLogo} from "./env/u1/LoadingLogo";
import {LoadingLogo as RLoadingLogo} from "./env/u2/LoadingLogo";
import {LoadingLogo as U5LoadingLogo} from "./env/u5/LoadingLogo";
import {LoadingLogo as U7LoadingLogo} from "./env/u7/LoadingLogo";
import {environment} from "../../../../environments/environment";


export type ILoadingLogo = {
  className?: string;
  isInGameRoute?: boolean;
  loadingIcon?: string;
}
export const LoadingLogo = (props: ILoadingLogo) => {
  const url = props.loadingIcon ? props.loadingIcon  : `assets/${environment.uVersion}/${environment.mvVersion}/logo.png`
  return renderByUVersion({
    "wild777bet": <CLoadingLogo {...props} loadingIcon={url}/>,
    "u1":  <CLoadingLogo {...props} loadingIcon={url}/>,
    "u2": <RLoadingLogo {...props} loadingIcon={url}/>,
    "u5": <U5LoadingLogo {...props} loadingIcon={url}/>,
    "u6": <U5LoadingLogo {...props} loadingIcon={url}/>,
    "u7": <U7LoadingLogo {...props} loadingIcon={url}/>,
  }, <CLoadingLogo {...props} loadingIcon={url}/>,)
}
