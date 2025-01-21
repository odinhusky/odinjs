import { handleMoreGamePageScroll } from './acitonType';

import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import handleGlobalScroll from '../handleGlobalScroll';

type ActionClickPayloadMap = {
  [handleMoreGamePageScroll]: void;
};

export interface HandleIndexClickProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useMoreGamePageActions = () => {
  const allLoaded = useMoreGamePageStoreStore((state) => state.allLoaded);

  const moreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.moreGamePageContainerRef
  );

  const page = useMoreGamePageStoreStore((state) => state.page);

  const setPage = useMoreGamePageStoreStore((state) => state.setPage);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleMoreGamePageScroll]: () => {
      handleGlobalScroll({
        target: handleMoreGamePageScroll,
        callback: () => {
          if (allLoaded || moreGamePageContainerRef === null) return;
          if (
            moreGamePageContainerRef.current &&
            moreGamePageContainerRef.current.scrollTop +
              moreGamePageContainerRef.current.clientHeight >=
              moreGamePageContainerRef.current.scrollHeight
          ) {
            setPage(page + 1);
          }
        },
      });
    },
  };

  const handleMoreGamePageAction = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleIndexClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleMoreGamePageAction,
  };
};

export default useMoreGamePageActions;
