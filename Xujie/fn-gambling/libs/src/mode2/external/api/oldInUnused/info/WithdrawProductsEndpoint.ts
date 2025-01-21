// import { POST_WITHDRAW_PRODUCTS_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type WithdrawProductsRequest = {
//   /* define request fields */
// };
// export type WithdrawProductsResponse = { success: boolean; data: any };

// export const WithdrawProductsEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<WithdrawProductsResponse>,
//     WithdrawProductsRequest
//   >({
//     query: (data: WithdrawProductsRequest) => ({
//       method: 'post',
//       url: POST_WITHDRAW_PRODUCTS_URL,
//       data,
//     }),
//   });
