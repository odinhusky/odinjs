// import { POST_GET_VERSION_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type GetVersionRequest = {
//   /* define request fields */
// };
// export type GetVersionResponse = { success: boolean; data: any };

// export const GetVersionEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<GetVersionResponse>, GetVersionRequest>({
//     query: (data: GetVersionRequest) => ({
//       method: 'post',
//       url: POST_GET_VERSION_URL,
//       data,
//     }),
//   });
