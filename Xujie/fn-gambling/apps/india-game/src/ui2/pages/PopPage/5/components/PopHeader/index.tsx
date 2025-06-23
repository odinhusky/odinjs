import { forwardRef, Ref } from 'react';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { HeaderSystemLogo } from '@components/HeaderSystemLogo';

export const PopHeader = forwardRef<HTMLDivElement>(
  (_, ref: Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={cx(
          'h-[80px] w-full px-4',
          'flex justify-start items-center',
          'bgi-[var(--base-2-variant5)]',
          'fixed top-0 z-10',
          MOBILE_BREAK_POINT_MAX_WIDTH
        )}
      >
        <HeaderSystemLogo />
      </div>
    );
  }
);

export default PopHeader;
