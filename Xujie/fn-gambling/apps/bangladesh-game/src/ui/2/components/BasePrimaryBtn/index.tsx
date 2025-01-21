import { cx, isTailwindTextClass } from '@libs/commonUtils';
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
  
  const hasTextClass =
    isTailwindTextClass(className) || isTailwindTextClass(classNameText);

  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'w-full h-[40px]',
        'bgi-[var(--base-1-main)]',
        hasTextClass ? '' : 'text-sm mobile:text-base tablet:text-lg',
        'rounded',
        'hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)] disabled:bgi-[var(--grayscale-25)]',
        className
      )}
      style={style}
      onClick={handleClick}
    >
      {!classNameText ? (
        <span className={cx('bgi-text-[var(--grayscale-100)]')}>
          {children}
        </span>
      ) : null}

      {classNameText ? (
        <span className={cx(classNameText)}>{children}</span>
      ) : null}
    </button>
  );
};

export default BasePrimaryBtn;
