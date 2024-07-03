import cx from '../../../../utils/cx';
import { Progress } from '../../components/Progress';
import './index.scss';

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
  barClassName,
}: IProgressBarProps) => {
  return (
    <div
      className={cx(
        'w-full flex items-center gap-4  bg-[var(--transparent-20)] rounded-full relative',
        className
      )}
    >
      <div
        className={cx(
          'h-3 bg-[var(--grayscale-50)] rounded-full overflow-hidden',
          progressClassName
        )}
        style={{ width: progress > 100 ? '100%' : `${progress}%` }}
      >
        <Progress
          className={cx('rounded-full', barClassName)}
          progress={progress > 100 ? 100 : progress * 1}
          progressColor={progressColor}
        />
      </div>
      <div className={cx('progress-text flex-shrink-0', percentClassName)}>
        {(progress > 100 ? 100 : progress * 1).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
        /
        {(100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
};
