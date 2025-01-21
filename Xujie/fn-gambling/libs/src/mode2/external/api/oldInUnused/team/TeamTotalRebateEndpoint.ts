// import { POST_PROMOTE_TEAM_TOTAL_REBATE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type TeamTotalRebateRequest = {};
// export type TeamTotalRebateResponse = {
//   success: boolean;
//   totalRebate: number; // Example field, replace with actual data structure
// };

// export const TeamTotalRebateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<TeamTotalRebateResponse>,
//     TeamTotalRebateRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_PROMOTE_TEAM_TOTAL_REBATE_URL,
//     }),
//   });
