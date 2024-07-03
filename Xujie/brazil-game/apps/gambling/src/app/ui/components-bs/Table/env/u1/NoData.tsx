import {environment} from "../../../../../../environments/environment"
import cx from "classnames";

export const NoData = (props: any) => {
  return (
    <div className={cx(props.className)}>
      <div className={cx(
        "h-full mt-0 md:pt-2 lg:pt-3 py-9 lg:py-11 flex flex-col justify-center w-full items-center",
        "bg-[var(--white-20)]"
      )}>
        <img className={'h-[64px] md:h-[104px] lg:h-[120px] mb-2'} alt="NoData"
             src={`assets/${environment.uVersion}/noData.png`}/>
        <div className='text-sm md:text-base lg:text-xl font-normal text-[var(--grayscale-70)]'>Nada aqui</div>
      </div>
    </div>
  )
}
