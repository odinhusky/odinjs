export enum Enums {
  /** Forgot password */
  ForgotPassword = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ForgotPassword]: "email_template_type.forgot_password"
}
