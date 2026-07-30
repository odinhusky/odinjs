import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { MockStoreState } from "./types"

export const mockStore: MockStoreState = {
  initialized: false,
  lastId: 0,
  cards: [],
  cryptoIds: {}
}

export const createMockCards = (currencyId: number, currencyCode: string): BankCardItemType[] => {
  const now = new Date().toISOString()
  const cards: BankCardItemType[] = []

  const createCard = (item: Partial<BankCardItemType> & { crypto_id?: number }) => {
    mockStore.lastId += 1

    if (typeof item.crypto_id === "number") {
      mockStore.cryptoIds[mockStore.lastId] = Number(item.crypto_id)
    }

    return {
      id: mockStore.lastId,
      name: item.name || "",
      bank_name: item.bank_name || "",
      account_number: item.account_number || "",
      account_name: item.account_name || "",
      currency_id: currencyId,
      payment_type_id: Number(item.payment_type_id || FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER),
      payment_gateway_id: item.payment_gateway_id,
      payment_gateway_name: item.payment_gateway_name,
      pg_code: item.pg_code,
      currency_code: currencyCode,
      branch: item.branch || "",
      bank_id: Number(item.bank_id || 0),
      crypto_id: item.crypto_id,
      deleted: false,
      created_at: now,
      chain: item.chain || "",
      currency_brand: item.currency_brand || "",
      crypto_rate: Number(item.crypto_rate || 0),
      wallet_address: item.wallet_address || ""
    }
  }

  cards.push(
    createCard({
      payment_type_id: 1,
      name: "Main Salary Card",
      bank_name: "DBS",
      bank_id: 101,
      account_name: "Alex Tan",
      account_number: "103822001",
      branch: "Marina Bay"
    }),
    createCard({
      payment_type_id: 1,
      name: "Backup Transfer Card",
      bank_name: "OCBC",
      bank_id: 102,
      account_name: "Chris Lee",
      account_number: "204933102",
      branch: "Orchard"
    }),
    createCard({
      payment_type_id: 1,
      name: "Family Account",
      bank_name: "UOB",
      bank_id: 103,
      account_name: "Jamie Ong",
      account_number: "550190233",
      branch: "Tampines"
    }),
    createCard({
      payment_type_id: 2,
      payment_gateway_id: 201,
      payment_gateway_name: "bigpayz_ewallet",
      pg_code: "bigpayz",
      name: "GCash Primary",
      account_name: "Mia Santos",
      account_number: "09171234567",
      bank_id: 501,
      bank_name: "GCash"
    }),
    createCard({
      payment_type_id: 2,
      payment_gateway_id: 202,
      payment_gateway_name: "gspay_gold_brl_starpagobr",
      pg_code: "starpagobr",
      name: "BR Wallet",
      account_name: "Carlos Da Silva",
      account_number: "123.456.789-01",
      bank_id: 502,
      bank_name: "Maya Wallet"
    }),
    createCard({
      payment_type_id: 2,
      payment_gateway_id: 201,
      payment_gateway_name: "bigpayz_ewallet",
      pg_code: "bigpayz",
      name: "TnG Backup",
      account_name: "Tan Wei",
      account_number: "0128844112",
      bank_id: 503,
      bank_name: "Touch n Go"
    }),
    createCard({
      payment_type_id: 3,
      name: "USDT TRC20",
      bank_id: 601,
      crypto_id: 301,
      chain: "TRC20",
      currency_brand: "USDT",
      wallet_address: "TA1p3E6dwR8xK3mock0001"
    }),
    createCard({
      payment_type_id: 3,
      name: "USDC ERC20",
      bank_id: 602,
      crypto_id: 302,
      chain: "ERC20",
      currency_brand: "USDC",
      wallet_address: "0x5cc1mockErc200002"
    }),
    createCard({
      payment_type_id: 3,
      name: "BTC Base",
      bank_id: 603,
      crypto_id: 303,
      chain: "BEP20",
      currency_brand: "BTC",
      wallet_address: "bc1mockbase0003"
    }),
    createCard({
      payment_type_id: 7,
      payment_gateway_id: 701,
      payment_gateway_name: "coinpay_crypto_payment",
      pg_code: "coinpay",
      name: "CoinPay Wallet A",
      bank_id: 611,
      crypto_id: 301,
      chain: "Polygon",
      currency_brand: "USDT",
      wallet_address: "0xpolygon0004"
    }),
    createCard({
      payment_type_id: 7,
      payment_gateway_id: 702,
      payment_gateway_name: "fastchain_crypto_payment",
      pg_code: "fastchain",
      name: "FastChain Wallet B",
      bank_id: 612,
      crypto_id: 302,
      chain: "Arbitrum",
      currency_brand: "USDC",
      wallet_address: "0xarb0005"
    }),
    createCard({
      payment_type_id: 7,
      payment_gateway_id: 701,
      payment_gateway_name: "coinpay_crypto_payment",
      pg_code: "coinpay",
      name: "CoinPay Wallet C",
      bank_id: 613,
      crypto_id: 303,
      chain: "Base",
      currency_brand: "BTC",
      wallet_address: "bc1base0006"
    })
  )

  return cards
}
