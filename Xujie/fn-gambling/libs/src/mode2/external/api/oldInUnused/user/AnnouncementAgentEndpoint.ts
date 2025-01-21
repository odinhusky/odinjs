// import { POST_ANNOUNCEMENT_AGENT_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type AnnouncementAgentRequest = {
//   /* define request fields */
// };
// export type AnnouncementAgentResponse = { success: boolean; data: any };

// export const AnnouncementAgentEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AnnouncementAgentResponse>,
//     AnnouncementAgentRequest
//   >({
//     query: (data: AnnouncementAgentRequest) => ({
//       method: 'post',
//       url: POST_ANNOUNCEMENT_AGENT_URL,
//       data,
//     }),
//   });
