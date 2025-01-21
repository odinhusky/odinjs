// import { POST_GAME_PLAY_HISTORY_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export interface PlayHistoryRequest {
//   /* define request fields */
// };
// export interface PlayHistoryResponse {
//   /* define response fields */
// };

// export const PostPlayHistoryEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<PlayHistoryResponse>, PlayHistoryRequest>({
//     query: (data: PlayHistoryRequest) => ({
//       method: 'post',
//       url: POST_GAME_PLAY_HISTORY_URL,
//       data,
//     }),
//   });
