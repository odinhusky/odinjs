// import { ExternalEndpoint } from '@mode2API/types';
// import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
// import { POST_PAY_CONFIG_INFO_URL } from '@/external/urls';
//
// type PayConfigInfoResponse = string[]; // ["tpay_upi","dummypay","tpay"]
//
// // 充值頁面開啟方式
// export enum PayActivationResult {
//   EXTERNAL = 'EXTERNAL',
//   INTERNAL = 'INTERNAL',
//
//   CRYPTO_WALLET = 'CRYPTO_WALLET',
//   UPI = 'UPI',
//   PHONEPE = 'PHONEPE',
// }
//
// export type PayChannelInfoResult = {
//   displayName: string; // 支付通道名稱
//   payName: string; // 調教充值訂單所需參數
//   payActivation: PayActivationResult; // 是否使用內部開啟支付方式， iframe open || usdt adds
//   isDefaultSelected: boolean;
// };
//
// /** 加值時可使用支付方式 */
// export const PostPayConfigInfoEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<PayConfigInfoResult, void>({
//     query: () => ({
//       method: 'post',
//       url: POST_PAY_CONFIG_INFO_URL,
//       data: {
//         reqData: {},
//       },
//     }),
//     transformResponse,
//   });
//
// export type PayConfigInfoResult = {
//   payChannels: PayChannelInfoResult[]; // ["tpay_upi","dummypay","tpay"]
// };
//
// const transformResponse = (
//   response: ResponseStructure<PayConfigInfoResponse>
// ): PayConfigInfoResult => {
//   const resp = response?.Body;
//   const channels =
//     resp?.map((item, index) => {
//       return {
//         displayName: `PAY ${index + 1}`,
//         payName: item,
//         payActivation: PayActivationResult.EXTERNAL,
//         isDefaultSelected: index === 0,
//       };
//     }) || [];
//   return {
//     payChannels: channels,
//   };
// };
