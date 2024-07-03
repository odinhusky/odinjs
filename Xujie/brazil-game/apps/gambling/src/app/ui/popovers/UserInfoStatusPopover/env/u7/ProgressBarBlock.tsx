import cx from "apps/gambling/src/app/ui/utils/cx";
import { ProgressBar } from "../../../../components-bs/ProgressBar";
import { formatLocaleMoney } from "../../../../utils/format";
import t from "apps/gambling/src/assets/constant/lang";
import { PERCENT_DENOMINATOR } from "apps/gambling/src/assets/constant/math";
import { isNumber } from "lodash";

interface ProgressBarBlockProps {
  title: string;
  directProgress?: number;
  progress?: number;
  length?: number;
  gridNum?: number;
  progressColorClass?: string;
  containerClass?: string;
  titleClass?:string;
}

export const ProgressBarBlock = ({
  title,
  directProgress,
  progress,
  length = 0,
  gridNum,
  progressColorClass,
  containerClass,
  titleClass,
}: ProgressBarBlockProps) => {
  let molecular = null;
  let denominator = null;
  let percent = null;

  // 如果是直截給算好的 Progress 範圍在 0~1之間
  if(directProgress && directProgress > 0) {
    percent = directProgress;
  } else if (progress && progress >= 0) {
    molecular = formatLocaleMoney(progress / PERCENT_DENOMINATOR);
    denominator = formatLocaleMoney(length / PERCENT_DENOMINATOR);

    percent = progress / length;
  }

  const isShowRatio = molecular && denominator;

  // = style
  const fontClass = cx(
    'font-bold ',
    'text-sm leading-[18px]',
    'text-[var(--grayscale-100)]'
  );

  return (
    <div className={cx(
      'flex flex-col gap-3',
      containerClass
    )}>
      <div className={cx(
        'flex items-end',
        'flex-row',
      )}>
        <div className={cx(
          'font-medium',
          'text-[var(--transparent-white-70)]',
          'text-xs leading-4',
          'tab:text-xs tab:leading-[18px]',
          `${isShowRatio ? '' : 'text-left'}`,
          "flex-shrink-0",
          titleClass
        )}>
          {title}
        </div>
        
        {
          isShowRatio ? (
            <div className={cx(
              'flex-auto',
              'flex justify-end'
            )}>
              {/* 分子 */}
              <span
                className={cx(
                  fontClass
                )}
              >
                {t['moneyWithRSign'](molecular || 0)} 
              </span>
    
              {/* 分母 */}
              <span
                className={cx(
                  fontClass
                )}
              >
                &nbsp;/ {t['moneyWithRSign'](denominator || 0)}
              </span>
            </div>
          ) : null
        }
      </div>

      <div className={cx(
        'text-sm font-medium'
      )}>
        <ProgressBar
          progressColor={cx(
            'bg-linear-1-main',
            progressColorClass
          )}
          gridNum={gridNum ? gridNum : undefined}
          percentClassName={cx('w-auto')}
          barClassName={cx(
            'shadow-none',
          )}
          progress={percent}
          isDirect={isNumber(directProgress) && directProgress >= 0}
        />
      </div>
    </div>
  )
}

export default ProgressBarBlock;