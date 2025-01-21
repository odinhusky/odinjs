// import { POST_GETGP_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type GetGpRequest = {
//   /* define request fields */
// };
// export type GetGpResponse = { success: boolean; data: any };

// export const GetGpEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<GetGpResponse>, GetGpRequest>({
//     query: (data: GetGpRequest) => ({
//       method: 'post',
//       url: POST_GETGP_URL,
//       data,
//     }),
//   });
