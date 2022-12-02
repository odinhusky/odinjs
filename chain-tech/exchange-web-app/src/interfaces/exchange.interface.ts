import { OtcUser } from "./otc.interface"

export interface Position {
    positionId: string
    owner: string
    side: string
    status: string
    leverage: number
    symbol: string
    avgPrice: number
    margin: number
    profitAndLoss: number
    quantity: number
    forceClose: number
    type: string
    profitPrice: number
    lossPrice: number
}

export interface Future {
    orderId: string;
    investor: string;
    symbol: string;
    origQty: number;
    avgPrice: number;
    cumQty?: number;
    executedQty: number;
    price: number;
    stopPrice?: number;
    side: string;
    status: string;
    type: string;
    positionSide: string;
    createdDate: number;
    handlingFee: number;
    profitAndLoss: number;
}

export interface Coin {
    symbol: string;
    balance: number;
    freeze: number;
}

export interface Contract {
    symbol: string;
    margin: number;
    balance: number;
}

export interface Investor {
    investorId: string;
    walletAddress: string;
    createdDate: Date;
    fiatCurrency: string;
    coins: Coin[];
    contract: Contract[];
    tradingStatus: string;
    favorite: string[];
    inviteCode: string;
    strategy: number;
}

export interface Role {
    id: number;
    value: string;
    name: string;
    remark: string;
    privileges: string[];
}

export interface User {
    userId: string;
    status: string;
    account: string;
    phone: string;
    kyc?: any;
    investor: Investor;
    roles: Role[];
    createdDate: Date;
    updatedDate: Date;
}

export interface UserInfo {
    token: string
    detail: User
    favorite: string[]
    otc: OtcUser
}

export interface LoginResponse {
    token: string
    user: User
}

export interface Payment {
    id: string
    type: string
    name: string
    code: string
    account: string
    sysUser: string
}

export interface Carousal {
    createdDate: Date;
    updatedDate: Date;
    createdBy?: any;
    updatedBy?: any;
    id: number;
    imagePath: string;
    announcementId?: any;
    status: string;
    lang: string;
    type: number;
} 

export interface Announcement {
    id: number;
    subject: string;
    outline: string;
    content: string;
    topic: string;
    status: string;
    thumbnail: string;
    createdDate: number;
    updatedDate: number;
    createdBy: string;
    updatedBy: string;
}

export interface Marquee {
    id: number;
    title: string;
    lang: string;
    content: string;
    updatedDate: Date;
    updatedBy?: any;
}

export interface FinanceRecord {
    id: number;
    type: number;
    network: string;
    coin: string;
    investorId: string;
    futureId: string;
    positionId?: string;
    transactionId?: string;
    fromWallet?: string;
    toWallet?: string;
    payment: number;
    balance: number;
    margin?: number;
    remark: string;
    createdDate: number;
    updatedDate: number;
}

export interface UserSecurity {
    kyc?: string;
    phone: boolean;
    googleAuth: boolean;
    financePwd: boolean;
}

export interface SpotProperty {
    equityValue: number;
    coins: Coin[];
}

export interface FutureProperty {
    symbol: string;
    margin: number;
    balance: number;
}

export interface Property {
    spot: SpotProperty;
    futures: FutureProperty;
}

export interface CommissionInfo {
    memberNumber: number
    tradeMembers: string[]
    records: Commission[]
}

export interface Commission {
    childAccount: string
    amount: number
    createdDate: number
}

export interface AgentApplication {
    id: number
    name: string
    email: string
    phone: string
    telegram: string
    whatsapp: string
    other: string
    teamName: string
    teamPeopleNumber: string
    location: string
    description: string
}