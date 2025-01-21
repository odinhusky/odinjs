// import { POST_PLAYER_UPDATE_BALANCE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type UpdateBalanceRequest = {
//   playerId: string;
//   amount: number;
// };

// export type UpdateBalanceResponse = {
//   success: boolean;
//   newBalance: number;
// };

// export const UpdateBalanceEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<UpdateBalanceResponse>,
//     UpdateBalanceRequest
//   >({
//     query: (data: UpdateBalanceRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_UPDATE_BALANCE_URL,
//       data,
//     }),
//   });
