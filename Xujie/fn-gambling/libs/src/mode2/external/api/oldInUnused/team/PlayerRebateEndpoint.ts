// import { POST_PROMOTE_PLAYER_REBATE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type PlayerRebateRequest = {
//   playerId: string;
// };
// export type PlayerRebateResponse = {
//   success: boolean;
//   rebateAmount: number; // Example field, replace with actual data structure
// };

// export const PlayerRebateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerRebateResponse>,
//     PlayerRebateRequest
//   >({
//     query: (data: PlayerRebateRequest) => ({
//       method: 'post',
//       url: POST_PROMOTE_PLAYER_REBATE_URL,
//       data,
//     }),
//   });
