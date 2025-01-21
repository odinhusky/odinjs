// import { POST_GET_RES_AREA_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type GetResAreaRequest = {
//   /* define request fields */
// };
// export type GetResAreaResponse = { success: boolean; data: any };

// export const GetResAreaEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<GetResAreaResponse>, GetResAreaRequest>({
//     query: (data: GetResAreaRequest) => ({
//       method: 'post',
//       url: POST_GET_RES_AREA_URL,
//       data,
//     }),
//   });
