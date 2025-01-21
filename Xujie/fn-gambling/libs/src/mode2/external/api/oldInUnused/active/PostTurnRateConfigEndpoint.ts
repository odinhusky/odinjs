// import { POST_TURN_RATE_CONFIG_URL } from '../../urls';
// import { ResponseStructure } from '../ResponseStructure';
// import { ExternalEndpoint } from '../../types';

// export type TurnRateConfigRequest = {
//   /* define request fields */
// };

// type TurnRateConfigResponse = {
//   /* define response fields */
// };

// export const PostTurnRateConfigEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<TurnRateConfigResponse>,
//     TurnRateConfigRequest
//   >({
//     query: (data: TurnRateConfigRequest) => ({
//       method: 'post',
//       url: POST_TURN_RATE_CONFIG_URL,
//       data,
//     }),
//   });
