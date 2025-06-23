import { cx } from '@libs/commonUtils';
import { SearchGameButtonProps } from '../SearchGameButtonProps';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import Icon from '@components/Icon';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';

export const SearchGameButton = ({
  className,
  classNameText,
  classNameIcon,
  debounceTimer = 0,
}: SearchGameButtonProps) => {
  const { navToSearchGamePage } = useNavPageClick();

  const onClick: (e: React.MouseEvent<HTMLButtonElement>) => void = (e) => {
    navToSearchGamePage();
  };

  // 防抖邏輯處理
  const debouncedOnClick = useDebounceAction(onClick, debounceTimer);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 將 e 傳遞給 onClick
    debouncedOnClick(e);
  };

  return (
    <button
      className={cx(FLEX_COL, 'items-center', 'w-full', className)}
      onClick={handleClick}
    >
      <div className={cx(FLEX_CENTER)}>
        <Icon
          name="ic_search_white"
          color="white"
          className={cx('w-6 h-6', classNameIcon)}
        />
      </div>

      {/* // TODO I18N */}
      <span
        className={cx(
          FLEX_CENTER,
          'text-base',
          'bgi-text-[var(--transparent-white-70)]',
          classNameText
        )}
      >
        Search
      </span>
    </button>
  );
};

export default SearchGameButton;
