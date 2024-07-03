// ShouldCloseUserInfoStatusPopoverOnlyInMobile
// 只有 Mobile 的斷點是開啟 /my 的 uVersion
// 目前除了 u7，其他版本都是 tablet 跟 mobile 斷點的時候就關閉右邊的 popover 切換到 /my 的路由。但 u7 tablet 還是顯示 popover 才有這個 constant
export const SHOULD_CLOSE_USER_INFO_STATUS_POPOVER_ONLY_IN_MOBILE_U_VERSIONS = [
  'u7',
];
