// import {
//   POST_WHEEL_PLAYER_SPIN_URL,
//   POST_WHEEL_PLAYER_SUMMARY_URL,
// } from '@mode2API/urls';
// import { ExternalEndpoint } from '@mode2API/types';
// import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
// import { WheelPlayerSpinResult } from '@mode2API/endpoint/wheel/PostWheelPlayerSpinEndpoint';
//
// interface WheelPlayerSummaryResponse {
//   amount: 0;
//   playerId: 0;
// }
//
// export interface WheelPlayerSummaryResult {
//   level: number;
// }
//
// export const PostWheelPlayerSummaryEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<WheelPlayerSummaryResult, void>({
//     query: () => {
//       return {
//         method: 'post',
//         url: POST_WHEEL_PLAYER_SUMMARY_URL,
//         data: {},
//       };
//     },
//     transformResponse,
//   });
//
// const transformResponse = (
//   response: ResponseStructure<WheelPlayerSummaryResponse>
// ): WheelPlayerSummaryResult => {
//   const resp = response?.Body;
//   return {
//     level: 0,
//   };
// };
