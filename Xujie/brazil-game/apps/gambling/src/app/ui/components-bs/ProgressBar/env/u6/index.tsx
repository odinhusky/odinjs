import { Progress } from "../../components/Progress";
import cx from "../../../../utils/cx";
interface IProgressBarProps {
  progress: number;
  progressClassName?: string;
  className?: string;
  percentClassName?: string;
  progressColor?: string;
  barClassName?: string;
}

export const ProgressBar = ({
  progress,
  progressClassName,
  className,
  percentClassName,
  progressColor,
  barClassName
}: IProgressBarProps) => {
  return (
    <div className={cx(
      'w-full flex items-center gap-4  bg-[var(--grayscale-30)] rounded-full',
      className)
    }>
      <div className={cx('w-full h-3 bg-[var(--grayscale-20)] rounded-full overflow-hidden', progressClassName)}>
        <Progress
          className={cx('rounded-full shadow-[inset_0px_-2px_0px_0px_rgba(0,_0,_0,_0.25),_inset_0px_2px_4px_0px_rgba(255,_255,_255,_0.25)]',barClassName)}
          progress={progress > 1 ? 100 : progress * 100}
          progressColor={progressColor}
        />
      </div>
      <div className={cx(
        'w-[80px] text-right flex-shrink-0',
        percentClassName
      )}>{(progress > 1 ? 100 : progress * 100).toLocaleString(undefined, { maximumFractionDigits:2, minimumFractionDigits: 2})}%</div>
    </div>
  )
}
