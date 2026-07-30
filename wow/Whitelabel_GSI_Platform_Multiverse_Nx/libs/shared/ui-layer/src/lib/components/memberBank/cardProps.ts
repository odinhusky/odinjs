import { MEMBER_BANK_CARD_MODE_OBJ } from "@shared-lib/constants/propsCategoryObj"

export type MemberBankCardMode = (typeof MEMBER_BANK_CARD_MODE_OBJ)[keyof typeof MEMBER_BANK_CARD_MODE_OBJ]

export interface MemberBankCardBaseProps<TCard> {
  card: TCard
  mode?: MemberBankCardMode
  disabled?: boolean
}

export interface MemberBankCardSelectableProps {
  selected?: boolean
  selectableValue?: number | null
}
