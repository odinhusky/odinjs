import { POST_DOWNLOAD_AWARD_START_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Successfully download start\"}"
 *
 * Failed:
 * "{\"Code\":400,\"Msg\":\"Already participated, please do not repeat! \",\"Body\":null}"
 */
type DownloadAwardStartResponse = string | null;

/** 下载任务奖励开始 */
export const PostDownloadAwardStartEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<DownloadAwardStartResult, void>({
    query: () => ({
      method: 'post',
      url: POST_DOWNLOAD_AWARD_START_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type DownloadAwardStartResult = {
  isSuccess: boolean;
};

const transformResponse = (
  response: ResponseStructure<DownloadAwardStartResponse>
): DownloadAwardStartResult => {
  return {
    isSuccess: response?.Code === 200,
  };
};
