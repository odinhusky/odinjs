import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import { handleSearchGamePageScrollTopBtnClick } from '@mode2/action/actionTypes';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import useSearchGamePageStore from '@libs/mode2/zustand/page/SearchGamePage/searchGamePageStore';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleSearchGamePageScrollTopBtnClick]: void;
};

export interface HandleSearchGamePageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSearchGamePageAction = () => {
  const searchGamePageGridContainerRef = useSearchGamePageStore(
    (state) => state.searchGamePageGridContainerRef
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSearchGamePageScrollTopBtnClick]: () => {
      handleGlobalClick({
        target: handleSearchGamePageScrollTopBtnClick,
        callback: () => {
          if (
            searchGamePageGridContainerRef &&
            searchGamePageGridContainerRef?.current
          ) {
            searchGamePageGridContainerRef.current?.scrollTo({
              scrollLeft: 0,
              scrollTop: 0,
            }); // 2️⃣ 滾動到最上方
          }
        },
      });
    },
  };

  const handleSearchGamePageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSearchGamePageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSearchGamePageClick,
  };
};

export default useSearchGamePageAction;
