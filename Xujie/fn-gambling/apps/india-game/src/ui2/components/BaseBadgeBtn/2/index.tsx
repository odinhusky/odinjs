import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import { BaseBadgeBtnProps } from '../BaseBadgeBtnProps';

export const BaseBadgeBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameText = '',
  style = {},
  onClick = (e) => {},
  debounceTimer = 0,
}: BaseBadgeBtnProps) => {
  // 防抖邏輯處理
  const debouncedOnClick = useDebounceAction(onClick, debounceTimer);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 將 e 傳遞給 onClick
    debouncedOnClick(e);
  };

  return (
    <button
      type={type}
      className={cx(
        'w-[61px] h-[32px]',
        'bgi-[var(--base-2-variant5)]',
        'bgi-text-[var(--grayscale-100)]',
        'text-sm',
        FLEX_CENTER,
        'rounded-tr-lg rounded-br-lg',
        className
      )}
      disabled={disabled}
      style={style}
      onClick={handleClick}
    >
      <span className={cx(classNameText)}>{children}</span>
    </button>
  );
};

export default BaseBadgeBtn;
