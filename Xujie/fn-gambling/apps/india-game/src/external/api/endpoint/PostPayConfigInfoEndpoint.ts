// import { ExternalEndpoint } from '@mode2API/types';
// import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
// import { POST_PAY_CONFIG_INFO_URL } from '@/external/urls';
//
// type PayConfigInfoResponse = string[]; // ["tpay_upi","dummypay","tpay"]
//
// /** 加值時可使用支付方式 */
// /** @deprecated 相關資料目前由/v1/api/pay/payConfigInfoWithOptions取得*/
// export const PostPayConfigInfoEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<PayConfigInfoResult, void>({
//     query: () => ({
//       method: 'post',
//       url: POST_PAY_CONFIG_INFO_URL,
//       data: {
//         reqData: {},
//       },
//     }),
//
//     transformResponse,
//   });
//
// export type PayConfigInfoResult = {
//   payConfig: string[]; // ["tpay_upi","dummypay","tpay"]
// };
//
// const defaultResult = {
//   payConfig: [],
// };
//
// const transformResponse = (
//   response: ResponseStructure<PayConfigInfoResponse>
// ): PayConfigInfoResult => {
//   const resp = response?.Body;
//   if (resp) {
//     return {
//       payConfig: resp,
//     };
//   }
//   return defaultResult;
// };
