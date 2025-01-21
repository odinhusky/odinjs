import { useAdjustEventTokensStore } from '@mode2/zustand/platform/adjustEventTokensStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useGetEventTokensQuery } from '@mode2API/index';
import { isEmpty } from 'lodash';
import sdkUtils from '@mode2/utils/sdk';

/**
 * 非 hook 使用，init app 就需要
 * <Provider store={store}> 之前，掛起 RTK Query Endpoint
 */
export const useAdjustEventToken = () => {
  const eventTokens = useAdjustEventTokensStore.getState().eventTokens;
  const setEventTokens = useAdjustEventTokensStore.getState().setEventTokens;
  const { data, ...rest } = useGetEventTokensQuery(
    { packageName: sdkUtils.getAppName() },
    {
      skip: !isEmpty(eventTokens),
      refetchOnFocus: isEmpty(eventTokens),
      refetchOnReconnect: isEmpty(eventTokens),
      refetchOnMountOrArgChange: false,
    }
  );

  useDeepEffect(() => {
    if (data) {
      setEventTokens(data.eventTokenList);
    }
  }, [data]);
};
