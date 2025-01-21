import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosCryptoBaseQuery } from '@mode2/gateway/axiosCryptoBaseQuery';
import { axiosBaseQuery } from '@mode2/gateway/axiosBaseQuery';
import { PostBankSaveEndpoint } from '@/external/api/endpoint/PostBankSaveEndpoint';
import { PostWalletAndOtherBankListEndpoint } from './endpoint/PostWalletAndOtherBankListEndpoint';
import { PostSavedBankListEndpoint } from './endpoint/PostSavedBankListEndpoint';
import { PostPlayerInfoSaveEndpoint } from '@/external/api/endpoint/PostPlayerInfoSaveEndpoint';
import { PostPayPayoutEndpoint } from '@/external/api/endpoint/PostPayPayoutEndpoint';

// endpoints for pakistan only
export const pakistanAPI = createApi({
  reducerPath: 'pakistanApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    postBankSave: PostBankSaveEndpoint(builder),
    postSavedBankList: PostSavedBankListEndpoint(builder),
    postPlayerInfoSave: PostPlayerInfoSaveEndpoint(builder),
    postPayPayout: PostPayPayoutEndpoint(builder),
  }),
});

export const pakistanCryptoAPI = createApi({
  reducerPath: 'pakistanCryptoApi',
  baseQuery: axiosCryptoBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    postWalletAndOtherBankList: PostWalletAndOtherBankListEndpoint(builder),
    // postPayConfigInfo: PostPayConfigInfoEndpoint(builder),
    // postPayProducts: PostPayProductsEndpoint(builder),
  }),
});

export const {
  // crypto
  usePostWalletAndOtherBankListMutation,
  // usePostPayConfigInfoMutation,
  // usePostPayProductsMutation,

  //not crypto
  usePostPayPayoutMutation,
  usePostBankSaveMutation,
  usePostSavedBankListMutation,
  usePostPlayerInfoSaveMutation,
} = {
  ...pakistanCryptoAPI,
  ...pakistanAPI,
};
