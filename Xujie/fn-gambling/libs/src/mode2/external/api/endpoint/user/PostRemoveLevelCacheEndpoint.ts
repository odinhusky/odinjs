import { POST_PLAYERRE_REMOVE_CACHE_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Operation successful\"}"
 */
type RemoveLevelCacheResponse = string | null;

export const PostRemoveLevelCacheEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RemoveLevelCacheResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PLAYERRE_REMOVE_CACHE_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type RemoveLevelCacheResult = {
  isSuccess: boolean;
  message: string;
};

const transformResponse = (
  response: ResponseStructure<RemoveLevelCacheResponse>
): RemoveLevelCacheResult => {
  return {
    isSuccess: response?.Code === 200,
    message: response?.Body || '',
  };
};
