// import { POST_PROMOTE_BONUS_TRANSFER_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';

// export type PromoteBonusTransferRequest = {};
// export type PromoteBonusTransferResponse = {
//   success: boolean;
//   message: string;
// };

// export const PromoteBonusTransferEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<PromoteBonusTransferResponse>,
//     PromoteBonusTransferRequest
//   >({
//     query: () => ({
//       method: 'post',
//       url: POST_PROMOTE_BONUS_TRANSFER_URL,
//     }),
//   });
