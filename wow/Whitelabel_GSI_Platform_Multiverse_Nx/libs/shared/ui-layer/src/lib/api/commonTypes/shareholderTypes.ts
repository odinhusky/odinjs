import { TimeStringType } from "@shared-lib/api/commonTypes"
import { MY_REPORT_TARGET_ENUMS } from "@shared-lib/constants/enums/myReportTarget"

export interface ShareholderCurrencyBaseParamsType {
  currency_id?: number
}

export interface ShareholderBaseParamsType extends ShareholderCurrencyBaseParamsType {
  start_time?: TimeStringType
  end_time?: TimeStringType
}
// ShareholderBaseParamsType output:
// {
//   currency_id?: number; // 繼承自 ShareholderCurrencyBaseParamsType
//   start_time?: TimeStringType;
//   end_time?: TimeStringType;
// }

export interface MyReportBaseParamsType extends ShareholderBaseParamsType {
  target?: MY_REPORT_TARGET_ENUMS
  offset?: number
  size?: number
}

// MyReportBaseParamsType output:
// {
//   currency_id?: number;          // 繼承自第一層
//   start_time?: TimeStringType;           // 繼承自第二層
//   end_time?: TimeStringType;             // 繼承自第二層
//   target?: MY_REPORT_TARGET_ENUMS;
//   offset?: number;
//   size?: number;
// }
