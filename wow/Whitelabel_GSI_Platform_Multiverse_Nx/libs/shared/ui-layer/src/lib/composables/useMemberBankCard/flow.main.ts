import { createMemberBankCardFlowHandlers } from "./flow.handlers"
import { createMemberBankCardFlowLoaders } from "./flowLoaders"
import type { CreateMemberBankCardFlowParams } from "./flow.types"

export const createMemberBankCardFlow = (params: CreateMemberBankCardFlowParams) => {
  const loaders = createMemberBankCardFlowLoaders(params)
  const handlers = createMemberBankCardFlowHandlers(params, loaders)

  return {
    ensureMockCardsInitialized: loaders.ensureMockCardsInitialized,
    loadCards: loaders.loadCards,
    onTypeChange: handlers.onTypeChange,
    onCurrencyChange: handlers.onCurrencyChange,
    onGatewayChange: handlers.onGatewayChange,
    handleHeaderCurrencyChange: handlers.handleHeaderCurrencyChange,
    initializeListPage: handlers.initializeListPage,
    initializeCreatePage: handlers.initializeCreatePage,
    initializeEditPage: handlers.initializeEditPage
  }
}
