// import { LOGOUT_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';
//
// export type LogoutResponse = object;
// // NOTE Evan logout api 不走 RTK Query
// export const PostLogoutEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<ResponseStructure<LogoutResponse>, null>({
//     query: () => ({
//       method: 'post',
//       url: LOGOUT_URL,
//     }),
//   });
