// import { POST_PAY_PAYOUT_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';
//
// export interface PayPayoutRequest {
//   amount: number;
//   password: string;
// }
//
// /**
//  * 提領結果
//  *
//  * 充值時錢會先存在Lock assets
//  * 但是可提領的錢只能從Total balance裡面提,會從Total balance提到Lock assets中
//  *
//  * <提現成功>
//  *
//  * {Code:200,Msg:"",Body:'Submitted successfully}
//  *
//  * <提現失敗>
//  *
//  * case 1: 密碼正確, 提領值為空或小於單次提領最小值
//  *
//  * {Code:400,Msg:"The withdrawal amount must be greater than or equal to 100!",Body:null}
//  *
//  * case 2: 提領金額格式正確, 密碼錯誤
//  *
//  * {Code:400,Msg:"Wrong withdrawal password!",Body:null}
//  *
//  * case 3: 超過單次提領上限
//  *
//  * {Code:400,Msg:"The withdrawal amount must be less than or equal to 50,000!",Body:null}
//  *
//  * case 4:
//  * {Code:400,Msg:"Insufficient balance!",Body:null}
//  *
//  * case 5:
//  *
//  * {Code:400,Msg:"The bet amount does not meet the requirements!",Body:null}
//  *
//  * case 6: 提現金額已達當日可提領金額上限
//  *
//  */
// type PayPayoutResponse = string; //
//
// /** 錢包提領 */
// export const PostPayPayoutEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<PayPayoutResult, PayPayoutRequest>({
//     query: (data: PayPayoutRequest) => ({
//       method: 'post',
//       url: POST_PAY_PAYOUT_URL,
//       data: {
//         reqData: data,
//       },
//     }),
//
//     transformResponse,
//   });
//
// type PayPayoutResult = {
//   withdrawResult: string;
// };
//
// const defaultResult = {
//   withdrawResult: '',
// };
//
// const transformResponse = (
//   response: ResponseStructure<PayPayoutResponse>
// ): PayPayoutResult => {
//   const resp = response?.Body;
//   if (resp) {
//     return {
//       withdrawResult: resp,
//     };
//   }
//   return defaultResult;
// };
