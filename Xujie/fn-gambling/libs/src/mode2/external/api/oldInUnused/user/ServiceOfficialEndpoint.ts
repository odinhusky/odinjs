// import { POST_SERVICE_OFFICIAL_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type ServiceOfficialRequest = {
//   /* define request fields */
// };
// export type ServiceOfficialResponse = { success: boolean; data: any };

// export const ServiceOfficialEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<ServiceOfficialResponse>,
//     ServiceOfficialRequest
//   >({
//     query: (data: ServiceOfficialRequest) => ({
//       method: 'post',
//       url: POST_SERVICE_OFFICIAL_URL,
//       data,
//     }),
//   });
