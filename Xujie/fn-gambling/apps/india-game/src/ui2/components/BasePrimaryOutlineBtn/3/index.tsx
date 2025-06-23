import { cx, isTailwindTextClass } from '@libs/commonUtils';
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

  const hasTextClass =
    isTailwindTextClass(className) || isTailwindTextClass(classNameText);

  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'w-full h-10',
        'bgi-[var(--base-1-main)]',
        hasTextClass ? '' : 'text-sm mobile:text-base tablet:text-lg',
        FLEX_CENTER,
        'rounded-full',
        'p-px',
        'hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)] disabled:bgi-[var(--grayscale-25)]',
        className
      )}
      style={style}
      onClick={handleClick}
    >
      <div
        className={cx(
          'bg-[var(--grayscale-100)]',
          'rounded-full',
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
              'bgi-text-[var(--base-1-main)]': !disabled,
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
