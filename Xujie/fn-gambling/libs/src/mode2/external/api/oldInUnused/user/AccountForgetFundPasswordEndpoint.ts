// import { POST_ACCOUNT_FORGET_FUND_PASSWORD_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AccountForgetFundPasswordRequest = {
//   /* define request fields */
// };
// export type AccountForgetFundPasswordResponse = { success: boolean; data: any };

// export const AccountForgetFundPasswordEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AccountForgetFundPasswordResponse>,
//     AccountForgetFundPasswordRequest
//   >({
//     query: (data: AccountForgetFundPasswordRequest) => ({
//       method: 'post',
//       url: POST_ACCOUNT_FORGET_FUND_PASSWORD_URL,
//       data,
//     }),
//   });
