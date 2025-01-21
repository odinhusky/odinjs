// import { POST_PLAYER_BINDMAIL_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type PlayerBindMailRequest = {
//   /* define request fields */
// };
// export type PlayerBindMailResponse = { success: boolean; data: any };

// export const PlayerBindMailEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerBindMailResponse>,
//     PlayerBindMailRequest
//   >({
//     query: (data: PlayerBindMailRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_BINDMAIL_URL,
//       data,
//     }),
//   });
