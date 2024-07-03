import { useGetHasWithdrawPasswordQuery } from '../../index';
import { useMemo } from 'react';

type HasWithdrawPasswordResult = {
  isBinding: boolean;
};

export const useHasWithdrawPasswordTransform = (isLogin: boolean) => {
  const { data, ...rest } = useGetHasWithdrawPasswordQuery(null, {
    skip: !isLogin,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const result: HasWithdrawPasswordResult = useMemo(() => {
    if (!data?.data) return { isBinding: false };
    const resp = data.data === true;
    return { isBinding: resp };
  }, [data]);

  return {
    ...result,
    ...rest,
  };
};
