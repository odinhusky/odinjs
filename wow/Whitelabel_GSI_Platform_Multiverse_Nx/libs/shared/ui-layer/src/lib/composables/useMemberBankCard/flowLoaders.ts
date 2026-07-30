import { createMemberBankCardOptionLoaders } from "./flow.loaders.options"
import { createMemberBankCardRecordLoaders } from "./flow.loaders.records"
import type { CreateMemberBankCardFlowParams } from "./flow.types"

export const createMemberBankCardFlowLoaders = (params: CreateMemberBankCardFlowParams) => {
  const optionLoaders = createMemberBankCardOptionLoaders(params)
  const recordLoaders = createMemberBankCardRecordLoaders(params, {
    loadEwalletProviderOptions: optionLoaders.loadEwalletProviderOptions,
    loadPaymentTypes: optionLoaders.loadPaymentTypes,
    syncFormOptions: optionLoaders.syncFormOptions
  })

  return {
    ...optionLoaders,
    ...recordLoaders
  }
}
