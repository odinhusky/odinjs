import {LoadingLogo} from "../../components-bs/Logos/LoadingLogo";
import {LoadingBar} from "../../components/LoadingBar";
import { renderByUVersion } from "../../utils/renderByUVersion";
import cx from "../../utils/cx";

type IBaseLoadingOverlay = {
  className?: string;
  isInGameRoute?: boolean;
  loadingIcon?: string;
}

const LogoClassName = () => {
  return renderByUVersion({
    "u6": "md:mb-5 lg:mb-6"
  },"")
}


export const BaseLoadingOverlay = (props: IBaseLoadingOverlay) => {
  return (
    <div className={cx("bg-[var(--page-background)] flex flex-col justify-center items-center", props.className)}>
      <div className={"mb-4"}>
        <LoadingLogo isInGameRoute={props.isInGameRoute} loadingIcon={props.loadingIcon}/>
      </div>
      {/*<ThreeDots height={25} className={'inline-block'} />*/}
      <LoadingBar />
    </div>
  )
}
