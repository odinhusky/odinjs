import { cx, isTailwindTextClass } from '@libs/commonUtils';
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
        'rounded',
        'hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)] disabled:bgi-[var(--grayscale-25)] ',
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

export default BasePrimaryBtn;
