import cx from "apps/gambling/src/app/ui/utils/cx";
import U7BorderDiv from "../../../../components/U7BorderDiv";
import { ReactNode } from "react";
import { FLEX_END_CENTER, FLEX_ITEMS_CENTER, U7_TEXT_FONT } from "apps/gambling/src/assets/constant/style";

interface U7SettingInfoBoxProps {
  containerClass?: string;
  className?: string;
  title: ReactNode;
  children?: ReactNode;
}

export const U7SettingInfoBox = ({
  containerClass,
  className,
  title,
  children,
}: U7SettingInfoBoxProps) => {
  return (
    <U7BorderDiv className={cx(containerClass)}>
      <div className={cx(
        'w-full',
        FLEX_ITEMS_CENTER, 'gap-5',
        'bg-linear-4-main',
        'py-[6px] px-3',
        'py-[10px] px-5',
        'rounded-lg',
        className
      )}>
        <div className={cx(
          'flex-auto',
          FLEX_ITEMS_CENTER,
          U7_TEXT_FONT,
          'text-[var(--grayscale-70)]',
          'mr-auto'
        )}>
          { title }
        </div>

        <div className={cx(
          U7_TEXT_FONT,
          'flex-1',
          FLEX_END_CENTER,
        )}>
          {children}
        </div>
      </div>
    </U7BorderDiv>
  )
};

export default U7SettingInfoBox;