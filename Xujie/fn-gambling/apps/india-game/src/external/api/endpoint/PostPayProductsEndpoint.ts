// import { ExternalEndpoint } from '@mode2API/types';
// import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
// import { POST_PAY_PRODUCTS_URL } from '@/external/urls';
//
// type PayProductsResponse = {
//   Id: number;
//   Name: string;
//   Amount: number;
//   Rebate: number;
//   RebateAmount: number;
//   IsHot: number;
// }[];
//
// /** 可儲值金額列表 */
// /** @deprecated 相關資料目前由/v1/api/pay/payConfigInfoWithOptions取得*/
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
// export type PayProductResult = {
//   amount: number;
//   rebateAmount: number;
//   isHot: boolean;
// };
//
// export type PayProductsResult = {
//   list: PayProductResult[];
// };
//
// const defaultResult = {
//   list: [],
// };
//
// const transformResponse = (
//   response: ResponseStructure<PayProductsResponse>
// ): PayProductsResult => {
//   const resp = response?.Body;
//   if (resp) {
//     return {
//       list: resp.map((item) => ({
//         amount: item.Amount || 0,
//         rebateAmount: item.RebateAmount || 0,
//         isHot: item.IsHot === 1,
//       })),
//     };
//   }
//   return defaultResult;
// };
