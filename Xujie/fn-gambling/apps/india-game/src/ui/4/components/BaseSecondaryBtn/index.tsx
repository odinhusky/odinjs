import { cx, isTailwindTextClass } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import React, { CSSProperties } from 'react';

interface BaseSecondaryBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: () => void;
  debounceTimer?: number;
}

export const BaseSecondaryBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameText = '',
  style = {},
  onClick = () => {},
  debounceTimer = 0,
}: BaseSecondaryBtnProps) => {
  const handleClick = useDebounceAction(onClick, debounceTimer);

  const hasTextClass =
    isTailwindTextClass(className) || isTailwindTextClass(classNameText);

  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'w-full h-10',
        'bgi-[var(--base-2-variant5)]',
        hasTextClass ? '' : 'text-sm',
        FLEX_CENTER,
        'rounded-md',
        // 'hover:bgi-[var(--base-2-light)]',
        // 'active:bgi-[var(--base-2-dark)]',
        'active:transition active:duration-300 active:scale-95',
        'disabled:transition disabled:duration-0 disabled:scale-100',
        // 'disabled:bgi-[var(--grayscale-25)]',
        // 'disabled:bgi-text-[var(--transparent-white-30)]',
        className
      )}
      style={style}
      onClick={handleClick}
    >
      <span
        className={cx(
          {
            'bgi-text-[var(--transparent-white-30)]': disabled,
            'bgi-text-[var(--grayscale-100)]': !disabled,
          },
          classNameText ? classNameText : ''
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default BaseSecondaryBtn;
