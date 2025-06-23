import { useEffect, useState } from 'react';

export const useTable = <T, S>(
  service: (
    payload: T & {
      limit: number;
      page: number;
    }
  ) => Promise<S[]>,
  options?: {
    searchData?: T;
    limit?: number;
    fetchType?: 'scroll' | 'pagination'; //滚动加载 or 分页加载
  }
) => {
  const {
    searchData = {} as T,
    limit = 20,
    fetchType = 'scroll',
  } = options || {};
  const [dataSource, setDataSource] = useState<S[]>([]);
  const [triggerData, setTriggerData] = useState({
    page: 1,
    limit,
    ...searchData,
  });
  const [isFinish, setFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTriggerData((preState) => ({ ...preState, page: 1, ...searchData }));
  }, [searchData]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      service(triggerData).then((data) => {
        setIsLoading(false);
        setDataSource((pre) =>
          triggerData.page === 1 || fetchType === 'pagination'
            ? data
            : [...pre, ...data]
        );
        data.length < limit && setFinish(true);
      });
    }
  }, [triggerData]);

  const fetchData = async (current?: number) => {
    if (fetchType === 'pagination') {
      setTriggerData((preState) => ({
        ...preState,
        page: current,
      }));
    } else {
      if (isFinish || isLoading) return;
      setTriggerData((preState) => ({
        ...preState,
        page: preState.page + 1,
      }));
    }
  };

  const resetDataSource = () => {
    setDataSource([]);
    setFinish(false);
  };

  return {
    dataSource,
    fetchData,
    isFinish,
    isLoading,
    current: triggerData.page,
    resetDataSource,
  };
};
