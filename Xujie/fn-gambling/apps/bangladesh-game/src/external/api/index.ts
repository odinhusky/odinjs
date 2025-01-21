import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosCryptoBaseQuery } from '@mode2/gateway/axiosCryptoBaseQuery';
import { axiosBaseQuery } from '@mode2/gateway/axiosBaseQuery';
import { PostBankSaveEndpoint } from '@/external/api/endpoint/PostBankSaveEndpoint';
import { PostPayPayoutEndpoint } from '@/external/api/endpoint/PostPayPayoutEndpoint';

// endpoints for bangladesh only
export const bangladeshAPI = createApi({
  reducerPath: 'bangladeshApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    postBankSave: PostBankSaveEndpoint(builder),
  }),
});

export const bangladeshCryptoAPI = createApi({
  reducerPath: 'bangladeshCryptoApi',
  baseQuery: axiosCryptoBaseQuery({
    baseUrl: '',
  }),
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: (builder) => ({
    postPayPayout: PostPayPayoutEndpoint(builder),
  }),
});

export const {
  // crypto
  usePostPayPayoutMutation,

  //not crypto
  usePostBankSaveMutation,
} = {
  ...bangladeshCryptoAPI,
  ...bangladeshAPI,
};
