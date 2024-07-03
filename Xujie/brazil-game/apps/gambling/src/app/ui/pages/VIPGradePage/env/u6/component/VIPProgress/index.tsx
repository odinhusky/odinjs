import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

import { ProgressBar } from "apps/gambling/src/app/ui/components-bs/ProgressBar";

interface VIPProgressProps {
  title: string,
  numerator: number | undefined,
  denominator: number,
  className?: string
}

export const VIPProgress = ({
  title,
  numerator,
  denominator,
  className = ''
}: VIPProgressProps) => {

  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  return (
    <div className={cx(className)}>
      <div 
        className={cx(
          "flex justify-between text-base font-bold",
          {
            "text-sm": isTablet,
            'w-full flex justify-center items-center flex-col': isMobile,
            'text-xs': isMobile
          }
        )}
      >
        <div className={cx(
          'text-[var(--grayscale-100)] text-base font-medium',
          {
            'text-sm': isTablet,
            'text-xs': isMobile
          }
        )}>{title}</div>
        <div>
          <span className={cx(
            'text-base font-medium text-[var(--grayscale-70)]',
            {
              'bg-linear-4-main bg-clip-text text-[transparent]': ((numerator || 0) / 100) / (denominator / 100 || 1) >= 1,
              'text-sm': isTablet || isMobile,
            }
          )}>R$ {formatLocaleMoney((numerator || 0) / 100)}</span>

          <span 
            className={cx(
              'text-base font-medium text-[var(--grayscale-100)]',
              {
                'text-sm': isTablet || isMobile,
              }
            )}
          >/R$ {formatLocaleMoney(denominator / 100)}</span>
        </div>
      </div>
      <ProgressBar
        percentClassName={cx(
          'w-auto',
          {
            'text-sm': isDesktop || isTablet,
            'text-xs': isMobile
          }
        )}
        progressClassName="bg-[var(--grayscale-50)]"
        className={cx(
          "h-5 mt-2 text-white text-lg font-extrabold",
          'bg-transparent',
          {
            'mt-[6px] text-base': isTablet,
            'h-3 p-0 mt-[5px] gap-2': isMobile
          }
        )}
        progressColor="var(--linear-4-main)"
        progress={
          ((numerator || 0) / 100) / (denominator / 100 || 1)
        }
      />
    </div>
  )
}

export default VIPProgress;