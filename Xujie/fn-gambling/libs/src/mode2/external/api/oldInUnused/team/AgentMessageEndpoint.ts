// import { POST_AGENT_MESSAGE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AgentMessageRequest = {};
// export type AgentMessageResponse = { success: boolean; messages: any };

// export const AgentMessageEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AgentMessageResponse>,
//     AgentMessageRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_AGENT_MESSAGE_URL,
//     }),
//   });
