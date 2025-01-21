// import { POST_PROMOTE_TEAM_LOST_REBATE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type TeamLostRebateRequest = {};
// export type TeamLostRebateResponse = {
//   success: boolean;
//   lostRebate: number; // Example field, replace with actual data structure
// };

// export const TeamLostRebateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<TeamLostRebateResponse>,
//     TeamLostRebateRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_PROMOTE_TEAM_LOST_REBATE_URL,
//     }),
//   });
