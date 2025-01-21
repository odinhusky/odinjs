// import { POST_ANNOUNCEMENT_GROUP_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AnnouncementGroupRequest = {
//   /* define request fields */
// };
// export type AnnouncementGroupResponse = { success: boolean; data: any };

// export const AnnouncementGroupEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AnnouncementGroupResponse>,
//     AnnouncementGroupRequest
//   >({
//     query: (data: AnnouncementGroupRequest) => ({
//       method: 'post',
//       url: POST_ANNOUNCEMENT_GROUP_URL,
//       data,
//     }),
//   });
