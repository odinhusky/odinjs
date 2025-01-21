// import { POST_AGENT_MESSAGE_DELETE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AgentMessageDeleteRequest = { messageId: string };
// export type AgentMessageDeleteResponse = { success: boolean; message: string };

// export const AgentMessageDeleteEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AgentMessageDeleteResponse>,
//     AgentMessageDeleteRequest
//   >({
//     query: (data: AgentMessageDeleteRequest) => ({
//       method: 'post',
//       url: POST_AGENT_MESSAGE_DELETE_URL,
//       data,
//     }),
//   });
