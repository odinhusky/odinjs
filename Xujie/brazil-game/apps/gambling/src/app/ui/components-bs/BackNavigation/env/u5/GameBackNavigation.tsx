import {ArrowLeft} from "../../../Icons/ArrowLeft";
import cx from "classnames";

type IGameBackNavigation = {
  onClick?: () => void;
  className?: string;
}

export const GameBackNavigation = (props: IGameBackNavigation) => {
  return (
    <div
      className={cx("flex flex-row w-full items-center px-5 py-3 lg:py-8 fixed z-10 cursor-pointer", props.className)}
      onClick={() => props.onClick && props.onClick()}
    >
      <span>
        <ArrowLeft className='relative z-10 text-white mr-1 !w-7 !h-7'/>
      </span>
      <div className="text-base font-bold text-white">Retornar</div>
    </div>
  )
}
