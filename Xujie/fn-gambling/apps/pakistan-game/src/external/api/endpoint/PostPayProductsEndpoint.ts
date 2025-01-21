// import { ExternalEndpoint } from '@mode2API/types';
// import { POST_PAY_PRODUCTS_URL } from '@/external/urls';
// import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
//
// interface PayProductsResponse {
//   Id?: number;
//   Name?: string;
//   Amount?: number;
//   Rebate?: number;
//   RebateAmount?: number;
//   IsHot?: number;
//   CashBackRate?: number;
//   Recommended?: boolean;
// }
//
// /** 可儲值金額列表 */
// export const PostPayProductsEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<PayProductsResult, void>({
//     query: () => ({
//       method: 'post',
//       url: POST_PAY_PRODUCTS_URL,
//       data: {
//         reqData: {},
//       },
//     }),
//
//     transformResponse,
//   });
//
// export type PayOptionsResult = {
//   indexKey: string;
//   id: number;
//   amount: number;
//   name: string;
//   rebate: number;
//   rebateAmount: number;
//   isHot: boolean;
//   cashBackRate: number;
//   isRecommended: boolean;
// };
//
// export type PayProductsResult = {
//   options: PayOptionsResult[];
// };
//
// const transformResponse = (
//   response: ResponseStructure<PayProductsResponse[]>
// ): PayProductsResult => {
//   const resp = response?.Body;
//   const options: PayOptionsResult[] =
//     resp?.map((item, index) => ({
//       indexKey: `${item.Id}_${item.Name}_${item.Amount}_${item.RebateAmount}`,
//       id: item.Id || 0,
//       amount: item.Amount || 0,
//       name: item.Name || '',
//       rebate: item.Rebate || 0.0,
//       rebateAmount: item.RebateAmount || 0,
//       isHot: item.IsHot === 1,
//       cashBackRate: item.CashBackRate || 0,
//       isRecommended: item.Recommended || false,
//     })) || [];
//
//   return {
//     options: options,
//   };
// };
