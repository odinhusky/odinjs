// import { POST_PLAYER_UPDATE_NICKNAME_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type PlayerUpdateNicknameRequest = {
//   /* define request fields */
// };
// export type PlayerUpdateNicknameResponse = { success: boolean; data: any };

// export const PlayerUpdateNicknameEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PlayerUpdateNicknameResponse>,
//     PlayerUpdateNicknameRequest
//   >({
//     query: (data: PlayerUpdateNicknameRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_UPDATE_NICKNAME_URL,
//       data,
//     }),
//   });
