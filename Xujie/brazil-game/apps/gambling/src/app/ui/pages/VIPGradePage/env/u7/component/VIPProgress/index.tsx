import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

import { ProgressBar } from "apps/gambling/src/app/ui/components-bs/ProgressBar";

interface VIPProgressProps {
  title: string;
  numerator: number | undefined;
  denominator: number;
  className?: string;
}

export const VIPProgress = ({
  title,
  numerator,
  denominator,
  className = "",
}: VIPProgressProps) => {
  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  return (
    <div className={cx(className)}>
      <div
        className={cx("flex justify-between text-base font-bold", {
          "text-sm": isTablet,
          "w-full flex items-center": isMobile,
          "text-xs": isMobile,
        })}
      >
        <div
          className={cx("text-[var(--grayscale-100)] text-base font-medium", {
            "text-sm": isTablet,
            "text-xs": isMobile,
          })}
        >
          {title}
        </div>
        <div className="text-right">
          <span
            className={cx("text-base font-medium text-[var(--grayscale-100)]", {
              "bg-linear-4-main bg-clip-text text-[var(--grayscale-100)]":
                (numerator || 0) / 100 / (denominator / 100 || 1) >= 1,
              "text-sm": isTablet || isMobile,
            })}
          >
            R$ {formatLocaleMoney((numerator || 0) / 100)}
          </span>

          <span
            className={cx("text-base font-medium text-[var(--text-amount)]", {
              "text-sm": isTablet || isMobile,
            })}
          >
            /R$ {formatLocaleMoney(denominator / 100)}
          </span>
        </div>
      </div>
      <ProgressBar
        progressColor={"bg-linear-3-main shadow-[0px_-2px_4px_#00000040_inset,0px_2px_4px_#FFFFFF40_inset]"}
        progress={(numerator || 0) / 100 / (denominator / 100 || 1)}
      />
    </div>
  );
};

export default VIPProgress;
