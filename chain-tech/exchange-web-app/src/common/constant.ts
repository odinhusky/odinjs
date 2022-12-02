export enum FinanceType {
    SPOT_DEPOSIT=1,
    SPOT_WITHDRAW,
    SPOT_TRANSFER,
    SPOT=10,
    CONTRACT_DEPOSIT,
    CONTRACT_TRANSFER,
    CONTRACT_MARGIN,
    CONTRACT_BENEFIT_AND_LOSS,
    CONTRACT_HANDLING_FEE,
    CONTRACT_COMMISSION,
    CONTRACT=20
}

export type ContractSide = "BUY" | "SELL"

export type ContractType = "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET"

export type C2cOrderType = "buy" | "sell"

export type LanguageType = "tw" | "cn" | "en"

export type FutureStatus = "CREATE" | "TRADING" | "DEAL" | "CANCEL" | "FAIL"

export type WalletType = "spot" | " otc"