// import { POST_PROMOTE_THIS_WEEK_REBATE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type ThisWeekRebateRequest = {};
// export type ThisWeekRebateResponse = {
//   success: boolean;
//   rebates: number; // Example field, replace with actual data structure
// };

// export const ThisWeekRebateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<ThisWeekRebateResponse>,
//     ThisWeekRebateRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_PROMOTE_THIS_WEEK_REBATE_URL,
//     }),
//   });
