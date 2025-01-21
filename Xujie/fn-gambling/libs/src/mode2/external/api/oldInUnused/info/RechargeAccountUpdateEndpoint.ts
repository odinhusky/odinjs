// import { POST_RECHARGE_ACCOUNT_UPDATE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type RechargeAccountUpdateRequest = {
//   /* define request fields */
// };
// export type RechargeAccountUpdateResponse = { success: boolean; data: any };

// export const RechargeAccountUpdateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<RechargeAccountUpdateResponse>,
//     RechargeAccountUpdateRequest
//   >({
//     query: (data: RechargeAccountUpdateRequest) => ({
//       method: 'post',
//       url: POST_RECHARGE_ACCOUNT_UPDATE_URL,
//       data,
//     }),
//   });
