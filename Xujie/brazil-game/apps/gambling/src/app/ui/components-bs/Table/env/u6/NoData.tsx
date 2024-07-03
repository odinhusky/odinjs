import { environment } from "../../../../../../environments/environment"
import cx from "../../../../utils/cx"
export const NoData = (props: any) => {
  return (
    <div className="p-2 w-full">
      <div
        className={
          "h-full mt-0 flex flex-col justify-center w-full items-center rounded-lg " +
          props.className
        }
      >
        <img
          className={"tablet:w-56 w-32 mb-2 "+ props.imgClassName}
          alt="NoData"
          src={`assets/${environment.uVersion}/noData.png`}
        />
        <div className={cx("text-sm  text-white", props.textClassName)}>Nada aqui</div>
    </div>
    </div>
    
  )
}
