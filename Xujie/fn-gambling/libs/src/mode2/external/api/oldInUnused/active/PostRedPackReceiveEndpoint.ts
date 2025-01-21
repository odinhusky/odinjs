// import { POST_RED_PACK_RECEIVE_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type RedPackReceiveRequest = {
//   /* define request fields */
// };

// type RedPackReceiveResponse = {
//   /* define response fields */
// };

// export const PostRedPackReceiveEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<RedPackReceiveResponse>,
//     RedPackReceiveRequest
//   >({
//     query: (data: RedPackReceiveRequest) => ({
//       method: 'post',
//       url: POST_RED_PACK_RECEIVE_URL,
//       data,
//     }),
//   });
