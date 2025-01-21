// import { POST_PACKAGE_CONFIG_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type PackageConfigRequest = {
//   /* define request fields */
// };
// export type PackageConfigResponse = { success: boolean; data: any };

// export const PackageConfigEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PackageConfigResponse>,
//     PackageConfigRequest
//   >({
//     query: (data: PackageConfigRequest) => ({
//       method: 'post',
//       url: POST_PACKAGE_CONFIG_URL,
//       data,
//     }),
//   });
