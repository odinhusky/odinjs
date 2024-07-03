import { ArrowLeft } from "../../../Icons/ArrowLeft";
import cx from "../../../../utils/cx";

type IGameBackNavigation = {
  onClick?: () => void;
  className?: string;
}

export const GameBackNavigation = (props: IGameBackNavigation) => {
  return (
    <div
      className={cx(
        "fixed top-5 left-5 z-[100] h-8 px-3",
        "flex items-center justify-center box-border cursor-pointer",
        "linear-1-button rounded-full"
      )}
      onClick={props.onClick}
    >
      <ArrowLeft className='mr-1 !w-6 !h-6'/>
      <div className="text-white text-base font-medium">Retornar</div>
    </div>
  )
}
