import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_COLLECT_REWARD_URL } from '@mode2API/urls';

/**
 * for [IN] 俱樂部 - 一鍵領取獎勵
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostPostTeamCollectRewardEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ResponseStructure<string>, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_COLLECT_REWARD_URL,
        data: {
          reqData: {},
        },
      };
    },
  });

export default PostPostTeamCollectRewardEndpoint;
