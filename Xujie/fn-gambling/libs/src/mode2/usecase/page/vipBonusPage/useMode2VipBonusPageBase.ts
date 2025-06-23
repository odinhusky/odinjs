import useMode2VipBonusPageHeaderSetting from './useMode2VipBonusPageHeaderSetting';
import { usePostVipRewardHistoryMutation } from '@libs/mode2/external/api';
import {
  EMyBonusTabList,
  useMode2MyBonusListStore,
} from '@libs/mode2/zustand/page/activityPageStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useEffect, useState } from 'react';

export const useMode2VipBonusPageBase = () => {
  useMode2VipBonusPageHeaderSetting();

  const [postVipRewardHistory, { data, isSuccess }] =
    usePostVipRewardHistoryMutation();

  const myBonusTabIndex = useMode2MyBonusListStore(
    (state) => state.myBonusTabIndex
  );
  const setMyBonusTabIndex = useMode2MyBonusListStore(
    (state) => state.setMyBonusTabIndex
  );
  const setTotalRewards = useMode2MyBonusListStore(
    (state) => state.setTotalRewards
  );
  const myBonusList = useMode2MyBonusListStore((state) => state.myBonusList);
  const setMyBonusList = useMode2MyBonusListStore(
    (state) => state.setMyBonusList
  );

  const pageSize = 10;
  const defaultParams = {
    page: 1,
    pageSize: pageSize,
    range: {
      month: myBonusTabIndex === EMyBonusTabList.ALL ? 0 : dayjs().month() + 1,
      year: dayjs().year(),
    },
  };
  const [page, setPage] = useState(1);

  const handleOnScroll = (e: React.UIEvent<HTMLTableSectionElement>) => {
    const bottom =
      e.currentTarget.scrollHeight -
      e.currentTarget.scrollTop -
      e.currentTarget.clientHeight;
    if (bottom < pageSize) {
      console.log(
        '@@@===>handleOnScroll',
        bottom,
        !data || data?.items.length < pageSize
      );
      if (!data || data?.items.length < pageSize) {
        return;
      }
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (isSuccess && data) {
      console.log('@@@===> useMyBonusModalBase', data);
      setMyBonusList([...myBonusList, ...data.items]);
      setTotalRewards(data.totalRewards);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    postVipRewardHistory({
      ...defaultParams,
      page: page,
    });
  }, [page, myBonusTabIndex]);

  useEffect(() => {
    setPage(1);
    setMyBonusList([]);
  }, [myBonusTabIndex]);

  useEffect(() => {
    return () => {
      setMyBonusTabIndex(EMyBonusTabList.MONTH)
    }
  }, [])

  return {
    handleOnScroll,
  };
};

export default useMode2VipBonusPageBase;
