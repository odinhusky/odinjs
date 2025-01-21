// import { POST_AGENT_CLOSE_POPUP_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AgentClosePopupRequest = {};
// export type AgentClosePopupResponse = { success: boolean; message: string };

// export const AgentClosePopupEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AgentClosePopupResponse>,
//     AgentClosePopupRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_AGENT_CLOSE_POPUP_URL,
//     }),
//   });
