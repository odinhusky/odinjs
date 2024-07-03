import { useGetNoticeMarqueesQuery } from '../../index';
import { useMemo } from 'react';

type Notice = {
  id: number;
  title: string;
  content: string;
  isMarquee: boolean; //是否為跑馬燈
  isEnabled: boolean; //是否啟用
};

type NoticeResult = {
  allNotices: Notice[]; // 全部公告
  marquees: Notice[]; //跑馬燈
  // bulletins: Notice[]; //公告
};

export const useNoticeMarqueesTransform = () => {
  const { data, ...rest } = useGetNoticeMarqueesQuery(null, {
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  const result: NoticeResult = useMemo(() => {
    if (!data?.data) return { allNotices: [], marquees: [], bulletins: [] };
    const resp = data.data;
    const allList = resp
      .filter((item) => item?.status === 1)
      .map((item) => {
        return {
          id: item.id || 0,
          title: item.title || '',
          content: item.content || '',
          isMarquee: item.type === 1,
          isEnabled: item.status === 1,
        };
      });

    const marquees = allList.filter((item) => item.isMarquee);
    // const bulletins = allList.filter((item) => !item.isMarquee);

    return {
      allNotices: allList,
      marquees: marquees,
      // bulletins: bulletins,
    };
  }, [data]);

  return {
    ...result,
    ...rest
  };
};
