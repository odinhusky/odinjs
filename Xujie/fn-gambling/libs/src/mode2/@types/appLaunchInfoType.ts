export interface AppLaunchInfo {
  buildId?: string; // 動態包版 apk uuid
  buildTime?: number; // 動態包版時間 EventTypeBuild EventType = 0 // 打包
  firstInstallTime?: number; // EventTypeInstall EventType = 1 // 安装
  lastUpdateTime?: number; // EventTypeForceUpdateTime EventType = 4 // 强更时间
  firstLaunch?: number; // EventTypeLaunch EventType = 2 // 启动
  lastLaunch?: number;
  launchCount?: number;
}
