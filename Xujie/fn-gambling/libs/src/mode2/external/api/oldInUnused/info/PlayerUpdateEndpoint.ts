// import { POST_PLAYER_UPDATE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type PlayerUpdateRequest = {
//   /* define request fields */
// };
// export type PlayerUpdateResponse = { success: boolean; data: any };

// export const PlayerUpdateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerUpdateResponse>,
//     PlayerUpdateRequest
//   >({
//     query: (data: PlayerUpdateRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_UPDATE_URL,
//       data,
//     }),
//   });
