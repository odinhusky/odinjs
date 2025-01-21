// import { POST_GET_APPLE_VERSION_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type GetAppleVersionRequest = {
//   /* define request fields */
// };
// export type GetAppleVersionResponse = { success: boolean; data: any };

// export const GetAppleVersionEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<GetAppleVersionResponse>,
//     GetAppleVersionRequest
//   >({
//     query: (data: GetAppleVersionRequest) => ({
//       method: 'post',
//       url: POST_GET_APPLE_VERSION_URL,
//       data,
//     }),
//   });
