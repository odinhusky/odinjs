export enum OtcOrderStatus {
    APPEAL= -2,
    CANCEL,
    WAIT_FOR_PAID,
    WAIT_FOR_SEND,
    FINISH,
    WAIT_FOR_BUYER,
    WAIT_FOR_SELLER,
    WAIT_FOR_BOTH
}

export enum AdvertisementType {
    BUY,
    SELL
}

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