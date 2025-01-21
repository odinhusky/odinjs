// import { POST_PLAYER_AUTH_SEND_OPT_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../../endpoint/ResponseStructure';

// export type AuthSendOptRequest = {
//   email: string;
//   phoneNumber: string;
// };

// export type AuthSendOptResponse = {
//   success: boolean;
//   message: string;
// };

// export const AuthSendOptEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<AuthSendOptResponse>, AuthSendOptRequest>({
//     query: (data: AuthSendOptRequest) => ({
//       method: 'post',
//       url: POST_PLAYER_AUTH_SEND_OPT_URL,
//       data,
//     }),
//   });
