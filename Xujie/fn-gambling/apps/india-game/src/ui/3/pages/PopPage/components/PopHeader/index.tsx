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
          'h-[80px] w-full flex justify-start items-center px-4 bgi-[var(--base-2-variant4)] fixed top-0',
          MOBILE_BREAK_POINT_MAX_WIDTH
        )}
      >
        <HeaderSystemLogo />
      </div>
    );
  }
);

export default PopHeader;
