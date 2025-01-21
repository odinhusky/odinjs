// import { POST_RECHARGE_BANK_SAVE_URL } from '../../urls';
// import { ExternalEndpoint } from '../../types';
// import { ResponseStructure } from '../ResponseStructure';
// import { RequestStructure } from '../RequestStructure';

// export type RechargeBankSaveRequest = {
//   email: string;
//   mobile: string;
//   name: string;
// };
// export type RechargeBankSaveResponse = { success: boolean; data: any };

// export const RechargeBankSaveEndpoint = (builder: ExternalEndpoint) =>
//   builder.mutation<
//     ResponseStructure<RechargeBankSaveResponse>,
//     RequestStructure<RechargeBankSaveRequest>
//   >({
//     query: (data: RequestStructure<RechargeBankSaveRequest>) => ({
//       method: 'post',
//       url: POST_RECHARGE_BANK_SAVE_URL,
//       data,
//     }),
//   });
