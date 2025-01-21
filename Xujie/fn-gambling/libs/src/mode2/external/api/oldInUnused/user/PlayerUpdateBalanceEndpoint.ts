// import { POST_PLAYER_UPDATE_BALANCE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type PlayerUpdateBalanceRequest = {
//   /* define request fields */
// };
// export type PlayerUpdateBalanceResponse = { success: boolean; data: any };

// export const PlayerUpdateBalanceEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerUpdateBalanceResponse>,
//     PlayerUpdateBalanceRequest
//   >({
//     query: (data: PlayerUpdateBalanceRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_UPDATE_BALANCE_URL,
//       data,
//     }),
//   });
