export enum DOMAIN_TYPE_ENUMS {
  // 添加中
  ADDING = 0,

  // 使用中
  IN_USE,

  // 已到期
  EXPIRED
}

export const DOMAIN_TYPE_I18N_KEYS: Record<DOMAIN_TYPE_ENUMS, string> = {
  [DOMAIN_TYPE_ENUMS.ADDING]: "collaboration.adding",
  [DOMAIN_TYPE_ENUMS.IN_USE]: "collaboration.in_use",
  [DOMAIN_TYPE_ENUMS.EXPIRED]: "collaboration.expired"
}
