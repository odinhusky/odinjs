import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QueueModalLang, appSlice } from '../../reduxStore/appSlice';
import { RootState } from '../../reduxStore';
import useDeepEffect from './useDeepEffect';
import { get, has, isArray, isEmpty, isEqual } from 'lodash';
import { useLocation } from 'react-router';
import { useGetActivityLobbyQuery } from '../../external';
import { useActivityNotice } from '../pages/ActivityPage/hooks/useActivityNotice';
import { ActivityLobbyResponse } from '../../external/endpoint/activity/lobby/ActivityLobbyEndpoint';
import {
  queueModalShowPages,
  queueModalCantShowPages,
} from 'apps/gambling/src/assets/constant/router';

type ActionType = {
  [key in string]: (bool: boolean) => void;
};

interface useQueueModalShowProps {
  readyCallback?: (bool: boolean) => void;
}

// ! 只能在一個地方使用
export const useQueueModalShow = (props?: useQueueModalShowProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const isShowLoginModal = useSelector(
    (state: RootState) => state.app.isShowLoginModal
  );

  const { activityList, isSuccess, isShowBox } = useGetActivityLobbyQuery(
    {},
    {
      selectFromResult: (result) => ({
        ...result,
        activityList: [],
        isShowBox: result?.data?.data.some(
          (item) => item.type === QueueModalLang.BOX_INVITE_REWARD.upper
        ),
      }),
      // selectFromResult: (result) => ({
      //   ...result,
      //   activityList: result?.data?.data,
      //   isShowBox: result?.data?.data.some(item => item.type === QueueModalLang.BOX_INVITE_REWARD.upper)
      // })
    }
  );

  const { getNoticeObj, isShowNotice } = useActivityNotice();
  const activityOrderTmp = ['box_invite_reward', 'bet_reward', 'loss_reward'];
  // const activityOrderTmp = ['bet_reward', 'loss_reward'];

  const loginOrderTmp = ['invite_bonus', 'deposit'];
  const allModalKeys = [...activityOrderTmp, ...loginOrderTmp];

  const actions: ActionType = useMemo(
    () => ({
      box_invite_reward: (bool: boolean) =>
        dispatch(appSlice.actions.setShowBoxModal(bool)),
      bet_reward: (bool: boolean) =>
        dispatch(appSlice.actions.setShowDailyCashBackModal(bool)),
      loss_reward: (bool: boolean) =>
        dispatch(appSlice.actions.setShowLossReliefModal(bool)),
      invite_bonus: (bool: boolean) =>
        dispatch(appSlice.actions.setIsShowInviteBonusModal(bool)),
      deposit: (bool: boolean) =>
        dispatch(appSlice.actions.setShowDepositModal(bool)),
    }),
    []
  );

  const [showModalList, setShowModalList] = useState<string[]>([]);

  const closeAllModal = () => {
    allModalKeys.forEach((key) => {
      actions[key](false);
    });
  };

  useDeepEffect(() => {
    if (
      isSuccess &&
      isArray(activityList)
      // && queueModalShowPages.includes(location.pathname)
    ) {
      const activityModalType = isEmpty(activityList)
        ? []
        : activityList.map((item: ActivityLobbyResponse) =>
            item.type.toLowerCase()
          );
      const activityNotice = getNoticeObj();
      const shouldShowActivityModalList = isEqual(activityNotice, {})
        ? [...activityModalType]
        : activityModalType?.flatMap((type) => {
            const hasType = has(activityNotice, type);
            if (hasType) {
              const typeTimeStamp = get(activityNotice, type);
              if (isShowNotice(typeTimeStamp)) return type;
              else return [];
            } else {
              return type;
            }
          });

      const activityModalOrderList = isEmpty(shouldShowActivityModalList)
        ? []
        : activityOrderTmp.filter((item) =>
            shouldShowActivityModalList?.includes(item)
          );

      // 互斥，有 BOX_INVITE_REWARD 就不能有 invite_bonus
      const loginModalOrderList = isLogin
        ? isShowBox
          ? [...loginOrderTmp.slice(1)]
          : [...loginOrderTmp]
        : [];

      const shouldShowModalList = [
        ...activityModalOrderList,
        ...loginModalOrderList,
      ];

      // console.log('@@ shouldShowActivityModalList', shouldShowActivityModalList)

      setShowModalList(shouldShowModalList);
    } else {
      setShowModalList([]);
    }
  }, [isSuccess, activityList, isLogin, isShowBox]);
  // }, [isSuccess, activityList, location, isLogin, isShowBox]);

  // 當 showModalList 數量變動的時候，開啟第一個 key 的 modal
  useDeepEffect(() => {
    // console.log('@@ showModalList', showModalList, location.pathname);
    // if(!isShowLoginModal && queueModalShowPages.includes(location.pathname)) {
    if (!isShowLoginModal && !isEmpty(showModalList)) {
      const firstModalKey = showModalList[0];

      if (
        activityOrderTmp.includes(firstModalKey) &&
        queueModalShowPages.includes(location.pathname)
      )
        actions[firstModalKey](true);

      if (
        loginOrderTmp.includes(firstModalKey) &&
        !queueModalCantShowPages.includes(location.pathname)
      )
        actions[firstModalKey](true);
    } else {
      closeAllModal();
    }
  }, [showModalList, isShowLoginModal]);
  // }, [showModalList, location, isShowLoginModal])

  // 當 Queue 已經空的時候呼叫開啟 modal 的檢查
  const showModalByKey = (key: string) => {
    if (
      queueModalShowPages.includes(location.pathname) &&
      isEmpty(showModalList)
    ) {
      if (
        (loginOrderTmp.includes(key) && isLogin) ||
        activityOrderTmp.includes(key)
      ) {
        actions[key](true);
      }
    }
  };

  const closeQueueModal = (key?: string) => {
    // 如果是最後一個則呼叫傳進來的 Callback Fn
    if (key === loginOrderTmp[loginOrderTmp.length - 1]) {
      if (props?.readyCallback) {
        // 呼叫外面的 callback 告知狀態
        props.readyCallback(true);
      }
    }

    if (key) {
      actions[key](false);
      setShowModalList((prev) => (isEmpty(prev) ? prev : prev.slice(1)));
    } else {
      setShowModalList((prev) => {
        const key = prev[0];
        actions[key](false);
        return prev.slice(1);
      });
    }
  };

  return {
    showModalList,
    showModalByKey,
    closeQueueModal,
  };
};
