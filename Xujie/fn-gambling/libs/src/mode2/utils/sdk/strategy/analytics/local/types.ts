import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';

export const ReportStoreKey = 'ReportStoreQueue';

export enum ReportEvent {
  CLICK = 'CLICK',
  PAGE_STAY = 'PAGE_STAY',
}

export interface ReportPayloadUnit {
  url: string; // window.location.href
  event: ReportEvent; // 'click' | 'pageStay'
  action: string; // '[handleXXXXXClose, XXXPage]'
  playerId: string; // useUserProfileStore.getState().id
  playerToken: string; // sdkUtils.getToken:
  userRole: UserRoleType;
  deviceId: string;
  os: string; // sdkUtils.getOs: 'web' | 'android' | 'ios' | 'pwa'
  version: string; // 當前版本
  duration?: number; // 停留時間秒數, eg: 15.02
  timestamp: number; // unix 秒單位
  additional: unknown;
}
