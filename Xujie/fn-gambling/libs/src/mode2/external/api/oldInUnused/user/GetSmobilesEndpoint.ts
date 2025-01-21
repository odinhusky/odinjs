// import { POST_GET_SMOBILES_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';
//
// export type GetSmobilesRequest = {
//   /* define request fields */
// };
// export type GetSmobilesResponse = { success: boolean; data: any };
//
// // Evan 相同資料已經從 /v1/api/home 回應 [ServicesMobiles]，先移除
// export const GetSmobilesEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<GetSmobilesResponse>, GetSmobilesRequest>({
//     query: (data: GetSmobilesRequest) => ({
//       method: 'post',
//       url: POST_GET_SMOBILES_URL,
//       data,
//     }),
//   });
