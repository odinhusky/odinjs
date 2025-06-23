import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_ADDON_CONFIG_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface PayAddOnConfigPayload {
  amount: number;
}

interface PayAddOnConfigInfoResponse {
  addOnAmount?: number;
  amount?: number;
  bonus?: number;
}

interface PayAddOnConfigResponse {
  addOnOptions?: PayAddOnConfigInfoResponse[];
  isPopupAddOn?: boolean;
}

export interface PayAdditionalResult {
  indexKey: string;
  addOnAmount: number;
  amount: number;
  bonus: number;
  isDefaultSelected: boolean;
}

export interface PayAddOnConfigResult {
  isPopupAddOn: boolean;
  payAdditionalOption: PayAdditionalResult[];
}

// const mockData = [
//   {
//     indexKey: '1',
//     addOnAmount: 12,
//     amount: 30,
//     bonus: 1,
//     isDefaultSelected: true,
//   },
//   {
//     indexKey: '2',
//     addOnAmount: 16,
//     amount: 40,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '3',
//     addOnAmount: 20,
//     amount: 50,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '4',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '5',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '6',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '7',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '8',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '9',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '10',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '11',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '12',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '13',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '14',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '15',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '16',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '17',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
//   {
//     indexKey: '18',
//     addOnAmount: 45,
//     amount: 100,
//     bonus: 1,
//     isDefaultSelected: false,
//   },
// ];

export const PostPayAddOnConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayAddOnConfigResult, PayAddOnConfigPayload>({
    query: (payload: PayAddOnConfigPayload) => ({
      method: 'post',
      url: POST_PAY_ADDON_CONFIG_URL,
      data: { amount: payload.amount },
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayAddOnConfigResponse>
): PayAddOnConfigResult => {
  const resp = response?.Body;

  const payAdditionalOption =
    resp?.addOnOptions?.map((item, index) => {
      return {
        indexKey: `${index}_${JSON.stringify(item)}`,
        addOnAmount: item?.addOnAmount || 0,
        amount: item?.amount || 0,
        bonus: item?.bonus || 0,
        isDefaultSelected: index === 0,
      };
    }) || [];

  return {
    payAdditionalOption: payAdditionalOption,
    isPopupAddOn: resp?.isPopupAddOn === true && payAdditionalOption.length > 0,
  };
  // // TODO Evan Mock
  // return {
  //   payAdditionalOption: mockData,
  //   isPopupAddOn: true,
  // };
};
