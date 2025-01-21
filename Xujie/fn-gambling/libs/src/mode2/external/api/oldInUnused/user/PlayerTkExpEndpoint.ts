// import { POST_PLAYER_TKEXP_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type PlayerTkExpRequest = {
//   /* define request fields */
// };
// export type PlayerTkExpResponse = { success: boolean; data: any };

// export const PlayerTkExpEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<PlayerTkExpResponse>, PlayerTkExpRequest>({
//     query: (data: PlayerTkExpRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_TKEXP_URL,
//       data,
//     }),
//   });
