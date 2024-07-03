import { tcx } from "../../../../utils/tcx";
import { Progress } from "../../components/Progress";
import {twMerge} from "tailwind-merge";


interface IProgressBarProps {
  progress: number;
  progressClassName?: string;
  className?: string;
  percentClassName?: string
}

export const ProgressBar = ({
  progress,
  progressClassName,
  className,
  percentClassName
}: IProgressBarProps) => {
  return (
    <div className={tcx(
      'w-full flex items-center gap-4  bg-[var(--grayscale-30)] rounded-full',
      className)
    }>
      <div className={tcx('w-full h-3 bg-[var(--grayscale-20)] rounded-full overflow-hidden', progressClassName)}>
        <Progress
          className='rounded-full shadow-[inset_0px_-2px_0px_0px_rgba(0,_0,_0,_0.25),_inset_0px_2px_4px_0px_rgba(255,_255,_255,_0.25)]'
          progress={progress > 1 ? 100 : progress * 100}
          progressColor='var(--linear-2-main)'
        />
      </div>
      <div className={twMerge(
        'w-[80px] text-right flex-shrink-0',
        percentClassName
      )}>{(progress > 1 ? 100 : progress * 100).toLocaleString(undefined, { maximumFractionDigits:2, minimumFractionDigits: 2})}%</div>
    </div>
  )
}
