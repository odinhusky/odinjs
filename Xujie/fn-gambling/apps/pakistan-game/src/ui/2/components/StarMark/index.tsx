import { memo } from 'react';
import { cx } from '@libs/commonUtils/cx';

export const StarMark = memo(({ className }: { className?: string }) => {
  return (
    <div
      className={cx(
        'self-start text-base mobile:text-xl font-medium bgi-text-[var(--state-error-main)]',
        className
      )}
    >
      {'*'}
    </div>
  );
});

export default StarMark;
