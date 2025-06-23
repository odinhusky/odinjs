import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import useSearchGamePageStore from '@libs/mode2/zustand/page/SearchGamePage/searchGamePageStore';
import useSearchGamePageAction from '@mode2/action/searchGamePageAction/useSearchGamePageAction';
import { handleSearchGamePageScrollTopBtnClick } from '@libs/mode2/action/actionTypes';

export const SearchGamePageScrollTopBtn = () => {
  const isShowSearchGamePageScrollTopBtn = useSearchGamePageStore(
    (state) => state.isShowSearchGamePageScrollTopBtn
  );

  const { handleSearchGamePageClick } = useSearchGamePageAction();

  return (
    <button
      className={cx('absolute bottom-0 right-0 z-[10]', FLEX_CENTER, 'hidden', {
        flex: isShowSearchGamePageScrollTopBtn,
      })}
      onClick={() => {
        handleSearchGamePageClick({
          actionName: handleSearchGamePageScrollTopBtnClick,
        });
      }}
    >
      <Icon
        name="ic_scroll_to_top_type2"
        className={cx('w-10 h-10', 'block')}
      />
    </button>
  );
};

export default SearchGamePageScrollTopBtn;
