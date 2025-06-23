import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_WINNING_SHARE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PromoteWinningShareResponse {
  inviteCode?: string;
  winningAmount?: number;
}

export interface PromoteWinningShareResult {
  winningAmount: number;
}

export const PostPromoteWinningShareEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteWinningShareResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_WINNING_SHARE_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteWinningShareResponse>
): PromoteWinningShareResult => {
  const resp = response.Body;
  return {
    winningAmount: resp?.winningAmount || 0,
  };
};
