// import { POST_RECHARGE_ACCOUNT_SAVE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type RechargeAccountSaveRequest = {
//   /* define request fields */
// };
// export type RechargeAccountSaveResponse = { success: boolean; data: any };

// export const RechargeAccountSaveEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<RechargeAccountSaveResponse>,
//     RechargeAccountSaveRequest
//   >({
//     query: (data: RechargeAccountSaveRequest) => ({
//       method: 'post',
//       url: POST_RECHARGE_ACCOUNT_SAVE_URL,
//       data,
//     }),
//   });
