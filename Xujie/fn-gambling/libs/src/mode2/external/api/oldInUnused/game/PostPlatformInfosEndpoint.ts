// import { POST_GAME_PLATFORM_INFOS_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export interface PlatformInfosRequest {
//   /* define request fields */
// };
// export interface PlatformInfosResponse {
//   /* define response fields */
// };

// export const PostPlatformInfosEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlatformInfosResponse>,
//     PlatformInfosRequest
//   >({
//     query: (data: PlatformInfosRequest) => ({
//       method: 'post',
//       url: POST_GAME_PLATFORM_INFOS_URL,
//       data,
//     }),
//   });
