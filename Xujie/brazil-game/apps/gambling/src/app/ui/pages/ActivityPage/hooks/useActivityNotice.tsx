import {useCallback, useEffect, useState} from "react";
import {AppLocalStorage} from "../../../../persistant/localstorage";
import {AppLocalStorageKey} from "../../../../persistant/AppLocalStorageKey";
import useDeepEffect from "../../../hooks/useDeepEffect";
import { useGetActivityLobbyQuery } from "apps/gambling/src/app/external";

import { ActivityLobbyResponse } from "apps/gambling/src/app/external/endpoint/activity/lobby/ActivityLobbyEndpoint";

type LastNoticeRecordStorage = {
  [key: string]: number
}

type IActivityNoticeState = {
  [key: string]: boolean
}

export const useActivityNotice = () => {
  const [noticeState, setNoticeState] = useState<IActivityNoticeState>({});
  const [activityCategories, setActivityCategories] = useState<string[]>([]);

  const { activityList } = useGetActivityLobbyQuery({}, {
    // selectFromResult: (result) => ({activityList: []})
    selectFromResult: (result) => ({activityList: result?.data?.data})
  });

  useDeepEffect(() => {
    if(!activityList || activityList.length === 0) return;

    const categories = activityList?.map((item: ActivityLobbyResponse)  => item.type.toLowerCase());

    setActivityCategories(categories);
  }, [activityList]);

  // 利用 router Change 來刷新 state
  useEffect(() => {
    updateState();
  }, [window.location.href, activityCategories])

  const getNoticeObj = (): LastNoticeRecordStorage => {
    const activityNotice = AppLocalStorage.getItem(AppLocalStorageKey.activityNotice);
    const noticeObj: LastNoticeRecordStorage = JSON.parse(activityNotice || "{}");
    return noticeObj;
  }
  const isShowNotice = (lastTime: number): boolean => {
    // 沒有上一次的紀錄就直接顯示
    if(lastTime === 0 || !lastTime) return true;
    
    // 有的話才計算
    const now = new Date();
    const lastTimeDate = new Date(lastTime);

    // return lastTime === 0 || now - lastTime > deviationInSeconds
    return now.toDateString() !== lastTimeDate.toDateString()
  }

  const updateState = useCallback(() => {
    if(!activityCategories) return;
    const noticeData: { [key: string]: boolean } = activityCategories.reduce((acc, item) => {
      const lastTime = getNoticeObj()[item] || 0
      return {...acc, [item]: isShowNotice(lastTime)};
    }, {});
    setNoticeState(noticeData);
  }, [activityCategories]);

  const useNoticeRecord = (category?: string) => {
    if (category) {
      let noticeObj = getNoticeObj();
      noticeObj[category] = Date.now();
      AppLocalStorage.setItem(AppLocalStorageKey.activityNotice, JSON.stringify(noticeObj));
      updateState();
    }
  };

  return {
    noticeState,
    getNoticeObj,
    isShowNotice,
    useNoticeRecord,
    updateState
  }
}