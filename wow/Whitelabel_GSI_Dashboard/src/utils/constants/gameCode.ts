export enum Enums {
  /** 老虎機 */
  BingoKitty = "1055",
  AndarBahar = "ANDAR_BAHAR",
  Magician = "MAGICIAN",
  ThorsHammer = "THORS_HAMMER",
  SecretScrollOfNinja = "SECRET_SCROLL_OF_NINJA",
  BillionaireParty = "BILLIONAIRE_PARTY"
}
// TODO: 翻譯待處理
export const I18nKeys: Record<Enums, string> = {
  [Enums.BingoKitty]: "game.bingoKitty",
  [Enums.AndarBahar]: "game.andarBahar",
  [Enums.Magician]: "game.magician",
  [Enums.ThorsHammer]: "game.thorsHammer",
  [Enums.SecretScrollOfNinja]: "game.secretScrollOfNinja",
  [Enums.BillionaireParty]: "game.billionaireParty"
}
