import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import React from 'react';
import { BasePrimaryOutlineBtnProps } from '../BasePrimaryOutlineBtnProps';

export const BasePrimaryOutlineBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameBg = '',
  classNameText = '',
  style = {},
  onClick = (e) => {},
  debounceTimer = 0,
}: BasePrimaryOutlineBtnProps) => {
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
        FLEX_CENTER,
        'text-sm font-medium',
        'rounded-[6px]',
        'p-px',
        'border bgi-border-[var(--base-1-main)]',
        className
      )}
      style={style}
      onClick={handleClick}
    >
      <div
        className={cx(
          'rounded-[6px]',
          'w-full h-full',
          FLEX_CENTER,
          classNameBg
        )}
      >
        <span
          className={cx(
            FLEX_CENTER,
            {
              'bgi-text-[var(--transparent-gray-30)]': disabled,
              'bgi-text-[var(--grayscale-100)]': !disabled,
            },
            classNameText ? classNameText : ''
          )}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export default BasePrimaryOutlineBtn;
