// import { POST_SIGNIN_PLAYER_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type SignInPlayerRequest = {
//   /* define request fields */
// };
// export type SignInPlayerResponse = { success: boolean; data: any };

// export const SignInPlayerEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<SignInPlayerResponse>,
//     SignInPlayerRequest
//   >({
//     query: (data: SignInPlayerRequest) => ({
//       method: 'post',
//       url: POST_SIGNIN_PLAYER_URL,
//       data,
//     }),
//   });
