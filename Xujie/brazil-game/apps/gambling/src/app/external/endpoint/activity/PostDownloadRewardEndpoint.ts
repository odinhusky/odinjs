import { ExternelEndpoint } from '../../types';
import { POST_ACTIVITY_DOWNLOAD_REWARD_URL } from '../../ApiUrl';
import { ResponseStructure } from '../ResponseStructure';

export const PostDownloadRewardEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<ResponseStructure<null>, null>({
    query: (data: null) => ({
      method: 'post',
      url: POST_ACTIVITY_DOWNLOAD_REWARD_URL,
      data: data,
    }),
  });
