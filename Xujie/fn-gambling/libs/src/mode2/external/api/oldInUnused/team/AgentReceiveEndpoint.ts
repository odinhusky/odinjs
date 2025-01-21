// import { POST_AGENT_RECEIVE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type AgentReceiveRequest = {};
// export type AgentReceiveResponse = { success: boolean; message: string };

// export const AgentReceiveEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AgentReceiveResponse>,
//     AgentReceiveRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_AGENT_RECEIVE_URL,
//     }),
//   });
