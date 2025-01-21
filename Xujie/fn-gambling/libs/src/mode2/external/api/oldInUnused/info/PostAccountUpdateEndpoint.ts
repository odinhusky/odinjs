// import { POST_ACCOUNT_UPDATE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export interface AccountUpdateRequest {}
// export interface AccountUpdateResponse {}

// export const PostAccountUpdateEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<AccountUpdateResponse>,
//     AccountUpdateRequest
//   >({
//     query: (data: AccountUpdateRequest) => ({
//       method: 'post',
//       url: POST_ACCOUNT_UPDATE_URL,
//       data,
//     }),
//   });
