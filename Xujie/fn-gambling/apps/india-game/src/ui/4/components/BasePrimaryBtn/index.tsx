import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import React, { CSSProperties } from 'react';

interface BasePrimaryBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: () => void;
  debounceTimer?: number;
}

export const BasePrimaryBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameText = '',
  style = {},
  onClick = () => {},
  debounceTimer = 0,
}: BasePrimaryBtnProps) => {
  const handleClick = useDebounceAction(onClick, debounceTimer);

  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'w-full h-10',
        'bgi-[var(--base-1-variant3)]',
        'text-sm',
        FLEX_CENTER,
        'rounded-md',
        'active:transition active:duration-300 active:scale-95',
        'disabled:bgi-text-[var(--grayscale-20)] disabled:bgi-[var(--linear-2)] disabled:shadow-[var(--box-shadow-bottom)]',
        className
      )}
      style={style}
      onClick={handleClick}
    >
      <span
        className={cx(
          {
            'bgi-text-[var(--grayscale-20)]': disabled,
            'bgi-text-[var(--base-2-variant5)]': !disabled,
          },
          classNameText ? classNameText : ''
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default BasePrimaryBtn;
