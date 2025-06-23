import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import React from 'react';
import { BasePrimaryBtnProps } from '../BasePrimaryBtnProps';

export const BasePrimaryBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameText = '',
  style = {},
  onClick = (e) => {},
  debounceTimer = 0,
}: BasePrimaryBtnProps) => {
  // 防抖邏輯處理
  const debouncedOnClick = useDebounceAction(onClick, debounceTimer);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 將 e 傳遞給 onClick
    debouncedOnClick(e);
  };

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
        'disabled:transition disabled:duration-0 disabled:scale-100',
        'disabled:bgi-text-[var(--grayscale-20)] disabled:bgi-[var(--linear-2)] disabled:bg-shadow-[var(--box-shadow-bottom)]',
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
