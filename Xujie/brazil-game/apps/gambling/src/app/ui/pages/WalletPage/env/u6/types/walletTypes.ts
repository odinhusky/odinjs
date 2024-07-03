export type BtnNames = 'howToInvite' | 'dailyData';

export type BalanceSectionType = 'total' | 'deposit' | 'promotion'

export type BalanceSectionValue = {
  [key in BalanceSectionType]?: {
    balance: number;
    retrievable: number;
  }
}
export type IBalanceSectionProps = {
  balanceSectionValue?: BalanceSectionValue
}