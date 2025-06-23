import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_INBOX_CONFIG_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  PayActivationResult,
  PayChannelInfoResult,
  PayConfigInfoWithOptionsResponse,
  PayOptionsResult,
} from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { LimitedOfferResponse } from '@mode2API/endpoint/user/PostHomeEndpoint';

export interface PayInboxOptionsResult extends PayOptionsResult {}

interface PayInboxConfigLimitedOfferResponse extends LimitedOfferResponse {}

interface PayInboxConfigsResponse extends PayConfigInfoWithOptionsResponse {}

interface PayInboxConfigResponse {
  PayConfigInfos?: PayInboxConfigsResponse[];
  LimitedOffer?: PayInboxConfigLimitedOfferResponse;
  // endTime
}

export interface PayInboxInfoResult extends PayChannelInfoResult {
  options: PayInboxOptionsResult[];
}

export interface PayInboxConfigResult {
  payChannels: PayInboxInfoResult[];
  limitedOfferEndTime: number; //
}

export const PostPayInboxConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayInboxConfigResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PAY_INBOX_CONFIG_URL,
      data: {},
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayInboxConfigResponse>
): PayInboxConfigResult => {
  const resp = response.Body;
  const configs = resp?.PayConfigInfos || [];
  const hasDefaultSelection = configs.some((item) => item.IsDefault === true);
  // 防呆避免產品為空
  const payChannelItems = configs
    .filter((item) => {
      return (item.Configs?.length || 0) > 0;
    })
    .flatMap((item, index) => {
      const configs = item.Configs || [];
      const channelName = item.PayChannelName;

      const options = configs.map((item) => {
        return {
          id: item.Id || 0,
          amount: item.Amount || 0,
          name: item.Name || '',
          rebate: item.Rebate || 0.0,
          rebateAmount: parseFloat((item.RebateAmount || 0).toFixed(2)),
          isHot: item.IsHot === 1,
          cashBackRate: parseFloat((item.CashBackRate || 0).toFixed(2)),
          cashBackAmount: parseFloat((item.CashBackAmount || 0).toFixed(2)),
          indexKey: `${item.Id}_${item.Name}_${item.Amount}_${item.RebateAmount}`,
          fromChannelName: channelName || '',
          recommended: item.Recommended || false,
          isHighBonus: item.IsHighBonus || false,
          damaTimes: item.DamaTimes || 0,
          withBonusDamaTimes: item.WithBonusDamaTimes || 0,
        };
      });
      const amounts = options.map((item) => item.amount);
      const cashBackRates = options.map((item) => item.cashBackRate);
      const rebateAmounts = options.map((item) => item.rebateAmount);

      return {
        payLimit: {
          min: Math.min(...amounts),
          max: Math.max(...amounts),
        },
        displayName: item.PayChannelDisplayName || '',
        payName: (item.PayChannelName || '').toLowerCase(), // 防呆全轉
        isRecommend: item.IsRecommend === 1,
        isDefaultSelected: hasDefaultSelection
          ? item.IsDefault === true
          : index === 0,
        disableAmountInput: item.IsAmountFixed === true,
        options: options,
        maxCashBackRate: Math.max(...cashBackRates),
        payActivation: PayActivationResult.EXTERNAL,
        maxRebateAmount: Math.max(...rebateAmounts),
        // payActivation:
        //   {
        //     tpay_upi: PayActivationResult.UPI,
        //     tpay_udst: PayActivationResult.CRYPTO_WALLET,
        //     dummypay: PayActivationResult.EXTERNAL,
        //     tpay: PayActivationResult.EXTERNAL,
        //   }[item.PayChannelName || ''] || PayActivationResult.EXTERNAL,
      };
    });

  const limitedOfferEndTime = resp?.LimitedOffer?.EndTime || 0;
  return {
    payChannels: payChannelItems,
    limitedOfferEndTime: limitedOfferEndTime,
  };
};
