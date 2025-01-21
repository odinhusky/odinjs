// import { POST_RANK_PLAYER_WIN_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export interface PlayerWinRankingRequest {}
// export interface PlayerWinRankingResponse {}

// export const PostPlayerWinRankingEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerWinRankingResponse>,
//     PlayerWinRankingRequest
//   >({
//     query: (data: PlayerWinRankingRequest) => ({
//       method: 'post',
//       url: POST_RANK_PLAYER_WIN_URL,
//       data,
//     }),
//   });
