import { POST_DOWNLOAD_RECEIVE_PRIZE_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Successfully received bonus!\"}"
 *
 * Failed:
 * "{\"Code\":400,\"Msg\":\"The reward has been received, please do not repeat the operation\",\"Body\":null}"
 */
type DownloadReceivePrizeResponse = string | null;

/** 下载任务触发领取 */
export const PostDownloadReceivePrizeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<DownloadReceivePrizeResult, void>({
    query: () => ({
      method: 'post',
      url: POST_DOWNLOAD_RECEIVE_PRIZE_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type DownloadReceivePrizeResult = {
  isSuccess: boolean;
};

const transformResponse = (
  response: ResponseStructure<DownloadReceivePrizeResponse>
): DownloadReceivePrizeResult => {
  return {
    isSuccess: response?.Code === 200,
  };
};
