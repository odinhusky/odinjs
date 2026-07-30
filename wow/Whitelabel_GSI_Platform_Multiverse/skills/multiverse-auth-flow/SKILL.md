---
name: multiverse-auth-flow
description: 在 Whitelabel_GSI_Platform_Multiverse 中，當使用者提到 login、register、SMS OTP、phone login、forgot-password、register_method、login_method、login_otp、register_otp、country-code、default-country 或 auth payload 問題時使用。
---

# Multiverse Auth Flow

當任務涉及登入、註冊、OTP、忘記密碼或 auth payload 行為時，從 repository root 使用此 skill。Auth flow 很容易因 template 與 site setting 差異而誤改；先確認 contract，再改 UI。

## 必要輸入

規劃或編輯前，先確認任何缺少的 auth scope：

- Target template/siteKey，或明確的 `all template` scope。
- 目標 surface：login、register、phone login、SMS OTP、forgot-password、reset-password、modal/dialog，或 shared hook/API。
- 問題類型：UI gating、payload normalization、API endpoint/type、country-code/default-country、auto-login，或 merge conflict coexistence。
- 使用者期待的 backend payload 範例；若沒有，先從現有 shared hook/API contracts 推導並回報。
- 是否允許 shared auth change；若未允許，優先 template-local patch。

## 先讀的 truth sources

- `src/common/hooks/useAuth.ts`：login/register/forgot-password payload normalization 的 shared choke point。
- `src/common/hooks/useEnv.ts`：`isPhoneRegisterMode`、`isRegisterOtpEnabled`、`isLoginOtpEnabled`、`defaultCountryCode`。
- `src/stores/envStore.ts`：site setting source of truth，包含 `registerMethod`、`register_otp`、`login_otp`、`international_calling_code`。
- `src/api/login.ts`、`src/api/request.type.ts`、`src/api/response.type.ts`：auth endpoint 與 request/response contracts。
- Target template auth files，例如 `ModeLoginRegister.vue`、`Login/Index.vue`、`Register/Index.vue`、`PhoneForgotPassword.vue`、modal auth components。

## 核心 invariants

- `REGISTER_METHOD.Enums.Account = 0`，`REGISTER_METHOD.Enums.Phone = 1`；`register_method: 0` 是合法值，不能因 falsy 被移除。
- `LOGIN_METHOD.Enums.Password = 0`，`LOGIN_METHOD.Enums.Sms = 1`；`login_method` 代表當次登入方式。
- `register_method` 是 register-side metadata；送 `/v1/player/user/login` 前應移除，不可用它強迫 SMS login。
- `login_otp` 控制 SMS login visibility；`register_otp` 控制 register OTP。不要用 `register_method` 或 `register_otp` 推論 SMS login 可見性。
- Phone/password login payload 保留 `login_method: 0`、`phone`、`country`、`password`。
- SMS login payload 使用 `login_method: 1`、`username` 作為 phone number、`sms_otp`，並保留可用的 `country`。
- Phone register auto-login：有 register OTP 且實際有 `sms_otp` 才走 SMS login；password auto-login 走 `country + phone + password`。
- `handleGetOTP()` 與 `handleForgetPasswordSms()` 是不同 contract：OTP request 可送 `phone_number` 與 `request_type`；`/v1/player/user/forgot_sms_otp` submit 保持 `{ phone, sms_otp, country_code }`。
- 當 SMS login 要在 account-register site 也可用時，template-local gate 優先使用 `showPhoneLoginLayout = isPhoneRegisterMode || isSmsLogin` 或等效 computed。

## 流程

- 先判斷問題屬於 shared contract、template-local UI、還是 endpoint/type plumbing。
- 若 target 是單一 template，只檢查該 template 與最接近 sibling；若是 all template，再用 scoped `rg` 找所有 auth surfaces。
- 比對 target template 是否已經有正確 pattern；已正確的 files 不要重複 patch。
- 修改 shared hook 前，先列出會被所有 templates 影響的 payload path。
- 修改 template UI 前，確認 login/register/forgot-password 是否共用同一 form state、country state、OTP button、modal event 或 route flow。
- 實作後，回報 payload contract、改到 shared 還是 template-local、受影響 templates，以及保留不變的 auth behavior。

## 常見陷阱

- 把 `register_method: 1` 誤解成必須送 `login_method: 1`。
- 修正 `register_method: 0` 後，serializer 又把 numeric zero 移除。
- 用 `isPhoneRegisterMode` 隱藏 SMS login，導致 `login_otp === 1` 的 account-register sites 看不到 SMS login。
- 把 forgot-password OTP request 的 `phone_number` contract 套到 forgot-password submit，誤改掉既有 `phone` payload。
- 對 clone templates 批次套同一 patch，卻漏掉 `set_r016` 這類 inline/one-off flow。
