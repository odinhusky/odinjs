import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import cx from "../../utils/cx";

interface BaseBadgeProps {
  active?: boolean;
  text: string;
  className?: string;
}

export const BaseBadge = ({
  active = false,
  text,
  className
}: BaseBadgeProps) => {
  return (
    <div 
      className={cx(
        FLEX_CENTER,
        'rounded-2xl',
        'text-xs leading-4 text-white',
        'py-1 px-3',
        'bg-[var(--grayscale-50)]',
        {
          'bg-linear-1-main': active
        },
        className,
      )}
    >
      {text}
    </div>
  )
};

export default BaseBadge;