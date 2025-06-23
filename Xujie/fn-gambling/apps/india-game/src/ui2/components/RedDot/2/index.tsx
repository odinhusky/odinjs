import { memo } from 'react';
import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';
import RedDotProps from '../RedotProps';

export const RedDot = memo(
  ({ type = 'css', size, className, children }: RedDotProps) => {
    const widthClass = `w-${size ? `[${size}px]` : '3'}`;
    const heightClass = `h-${size ? `[${size}px]` : '3'}`;

    return type === 'img' ? (
      <Icon
        name="ic_red_dot"
        className={cx(
          'red_dot',
          widthClass,
          heightClass,
          'rounded-[50%]',
          'animate-heartBeat',
          className
        )}
      />
    ) : (
      <div
        className={cx(
          'red_dot',
          widthClass,
          heightClass,
          'rounded-[50%]',
          'bgi-[var(--state-error-main)]',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

export default RedDot;
